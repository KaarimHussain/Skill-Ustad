import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import ollama
from pydantic import BaseModel, ValidationError
from typing import List
import os
import re
from dotenv import load_dotenv

router = APIRouter()

class DescriptionRequest(BaseModel):
    label: str
    context: str

class DescriptionResponse(BaseModel):
    description: str

class RoadmapRequest(BaseModel):
    prompt: str

class RoadmapResponse(BaseModel):
    nodes: list
    edges: list

@router.post("/api/description", response_model=DescriptionResponse)
async def generate_description(data: DescriptionRequest):
    # 1. Simplified system prompt focusing on a single 'description' field
    system_prompt = """
    You are a specialized AI assistant that generates a detailed description in a structured JSON format.
    You MUST adhere to the following JSON schema:
    {
      "description": "A detailed explanation of the concept, approximately 5 to 6 lines long, suitable for a beginner."
    }
    
    CRITICAL RULES:
    - Your entire response MUST be a single, valid JSON object and nothing else.
    - Do NOT include any introductory text, closing remarks, or markdown like ```json.
    - The 'description' field MUST contain a clear explanation that is 5 to 6 lines in length.
    """

    # 2. User prompt remains simple
    user_prompt = f"Generate a detailed description (5-6 lines) for the concept '{data.label}' within the context of '{data.context}'."

    try:
        response = ollama.generate(
            model="qwen3:1.7b",
            prompt=user_prompt,
            system=system_prompt,
            options={"temperature": 0.6},
            format="json" # Enforces JSON output
        )

        raw_response = response["response"]
        parsed_json = json.loads(raw_response)
        
        # 3. Validate directly against your DescriptionResponse model
        validated_data = DescriptionResponse.model_validate(parsed_json)

        return validated_data # FastAPI will serialize this Pydantic object correctly

    except json.JSONDecodeError:
        # AI's output was not valid JSON
        raise HTTPException(status_code=500, detail="AI failed to generate valid JSON.")
    except ValidationError as e:
        # JSON was valid, but didn't match {"description": "..."}
        raise HTTPException(status_code=500, detail=f"AI response did not match expected format: {e}")
    except Exception as e:
        # Catch-all for other errors
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/generate-roadmap", response_model=RoadmapResponse)
async def generate_roadmap(data: RoadmapRequest):
    try:
        # Enhanced system prompt with template structure and strict JSON enforcement
        system_prompt = (
            "You are an expert learning roadmap creator. You must create comprehensive learning paths "
            "that follow proven educational structures.\n\n"
            
            "CRITICAL REQUIREMENTS:\n"
            "- Respond ONLY with valid JSON - no explanations, no markdown, no extra text\n"
            "- Your response MUST start with '{' and end with '}'\n"
            "- Generate exactly this JSON structure:\n"
            "{\n"
            "  \"nodes\": [\n"
            "    {\n"
            "      \"id\": \"unique_id\",\n"
            "      \"type\": \"start|course|milestone|project|concept|topic|step|quiz|end\",\n"
            "      \"data\": {\n"
            "        \"label\": \"Node title\",\n"
            "        \"description\": \"Detailed description of what to learn/do\"\n"
            "      },\n"
            "      \"position\": { \"x\": 100 + on each new node, \"y\": 100 (should be maintained) }\n"
            "    }\n"
            "  ],\n"
            "  \"edges\": [\n"
            "    {\n"
            "      \"id\": \"edge_id\",\n"
            "      \"source\": \"source_node_id\",\n"
            "      \"target\": \"target_node_id\"\n"
            "    }\n"
            "  ]\n"
            "}\n\n"
            
            "MANDATORY NODE TYPE RESTRICTIONS:\n"
            "- EXACTLY ONE 'start' node (id: 'start') at the beginning\n"
            "- EXACTLY ONE 'end' node (id: 'end') at the completion\n"
            "- Use ONLY these node types: start, course, milestone, project, concept, topic, step, quiz, end\n"
            "- NEVER use any other node types (no 'assessment', 'task', etc.)\n\n"
            
            "ROADMAP STRUCTURE REQUIREMENTS:\n"
            "- A Single Roadmap should minimum of 10 nodes"
            "- Generate 12-15 nodes total (including start and end)\n"
            "- Node distribution: start(1) + course(2-3) + concept(2-3) + topic(3-4) + project(2-3) + milestone(1-2) + quiz(1-2) + step(1-2) + end(1)\n"
            "- Position nodes in logical flow: x increases by 200-300, y varies for branching (100, 300, 500)\n\n"
            
            "LEARNING PATH RULES:\n"
            "1. START: Begin with exactly one 'start' node\n"
            "2. FOUNDATION: Follow with 'course' or 'concept' nodes for basics\n"
            "3. TOPICS: Add 'topic' nodes for specific subject areas\n"
            "4. PROJECTS: Place 'project' nodes after every 2-3 topic/concept nodes\n"
            "5. STEPS: Use 'step' nodes for detailed learning actions\n"
            "6. QUIZZES: Insert 'quiz' nodes randomly throughout (not in sequence)\n"
            "7. MILESTONES: Add 'milestone' nodes at major achievement points\n"
            "8. END: Finish with exactly one 'end' node\n\n"
            
            "NODE TYPE DEFINITIONS:\n"
            "- start: Starting point of learning journey\n"
            "- course: Structured learning content or course\n"
            "- milestone: Important achievement or checkpoint\n"
            "- project: Hands-on project or practical application\n"
            "- concept: Core concept or theoretical knowledge\n"
            "- topic: Specific topic or subject area\n"
            "- step: Individual step in the learning process\n"
            "- quiz: Quick quiz to test knowledge\n"
            "- end: Completion or end goal\n\n"
            
            "EDGE REQUIREMENTS:\n"
            "- Create logical learning progressions\n"
            "- Ensure every node (except 'end') connects to at least one next node\n"
            "- Ensure every node (except 'start') has at least one incoming connection\n"
            "- Edge IDs format: 'e{source}-{target}'\n\n"

            "EDGE CONNECTIVITY RULES:\n"
            "- EVERY node must be connected in the learning path\n"
            "- Source and target IDs in edges MUST exactly match node IDs\n"
            "- Create a linear progression: start → [learning nodes] → end\n"
            "- No orphaned nodes (nodes with no connections)\n"
            "- Example valid edge: {\"id\": \"e1-2\", \"source\": \"1\", \"target\": \"2\"}\n"
            "- Double-check all edge references match existing node IDs\n\n"
            
            "CONTENT QUALITY:\n"
            "- Descriptions must be specific and actionable (15-35 words each)\n"
            "- Labels should be clear and concise (2-5 words)\n"
            "- Projects should combine multiple learned concepts\n"
            "- Quizzes should test recent learning\n"
            "- Milestones should mark significant progress points\n\n"
            
            "Remember: Use ONLY the specified node types. Output ONLY valid JSON. No other text allowed."
        )

        # Enhanced user prompt with template context
        user_prompt = (
            f"Create a comprehensive learning roadmap for: {data.prompt}\n\n"
            
            "Use these successful roadmap patterns as inspiration:\n"
            "- Web Development: HTML → CSS → JavaScript → Framework → Backend → Full-stack Project\n"
            "- Data Science: Python → SQL → Statistics → Data Manipulation → Visualization → ML → Project\n"
            "- Cybersecurity: Networking → OS → Security Principles → Defensive/Offensive → Practical Challenges\n"
            "- Cloud Computing: IT Basics → Linux → Cloud Provider → IaC → Containers → Deployment Project\n"
            "- Mobile Development: Language → UI/UX → SDK → APIs → State Management → Published App\n\n"
            
            "Structure your roadmap with:\n"
            "1. Foundation topics (3-4 nodes)\n"
            "2. Core concepts (4-5 nodes)\n"
            "3. Practical application (2-3 project nodes)\n"
            "4. Advanced topics (3-4 nodes)\n"
            "5. Capstone project (1 node)\n"
            "6. Assessment checkpoints (1-2 nodes)\n\n"
            
            "Generate the JSON roadmap now:"
        )

        # Generate using Ollama with strict JSON format
        response = ollama.generate(
            model="gemma3:latest",
            prompt=user_prompt,
            system=system_prompt,
            format="json"  # Enforces JSON output
        )

        print("🧪 RAW Ollama OUTPUT:", response["response"])

        # Parse and validate the JSON response
        text = response["response"].strip()
        
        # Additional cleaning in case of any formatting issues
        if text.startswith('```json'):
            text = re.sub(r'^```json\s*', '', text)
        if text.endswith('```'):
            text = re.sub(r'\s*```$', '', text)
        
        # Extract JSON if wrapped in extra text
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            text = json_match.group()
        
        # Attempt JSON repair if needed
        try:
            parsed = json.loads(text)
        except json.JSONDecodeError:
            print("🔧 Attempting JSON repair...")
            from json_repair import repair_json
            repaired_text = repair_json(text)
            parsed = json.loads(repaired_text)

        # Validate required structure
        if "nodes" not in parsed or "edges" not in parsed:
            raise ValueError("Missing required keys 'nodes' or 'edges' in AI response")
        
        if not isinstance(parsed["nodes"], list) or not isinstance(parsed["edges"], list):
            raise ValueError("'nodes' and 'edges' must be arrays")
        
        if len(parsed["nodes"]) < 5:
            raise ValueError(f"Insufficient nodes generated: {len(parsed['nodes'])}. Minimum 5 required.")

        # Clean up any extra fields that shouldn't be there
        if "capstone" in parsed:
            del parsed["capstone"]
        
        # Validate and fix node structure
        node_ids = set()
        for i, node in enumerate(parsed["nodes"]):
            # Check required fields
            required_fields = ["id", "type", "data", "position"]
            for field in required_fields:
                if field not in node:
                    print(f"🔧 Fixing Node {i}: Adding missing field '{field}'")
                    if field == "position":
                        # Add default position based on index
                        node["position"] = {"x": (i % 5) * 250, "y": (i // 5) * 200}
                    elif field == "data":
                        node["data"] = {"label": f"Node {i}", "description": "Auto-generated node"}
                    elif field == "id":
                        node["id"] = f"node_{i}"
                    elif field == "type":
                        node["type"] = "topic"
            
            # Check for duplicate IDs and fix them
            original_id = node["id"]
            counter = 1
            while node["id"] in node_ids:
                node["id"] = f"{original_id}_{counter}"
                counter += 1
                print(f"🔧 Fixed duplicate ID: {original_id} → {node['id']}")
            node_ids.add(node["id"])
            
            # Validate and fix data field
            data = node.get("data", {})
            if "label" not in data:
                # Check if there's a 'title' field we can use instead
                if "title" in data:
                    print(f"🔧 Node {i}: Converting 'title' to 'label'")
                    data["label"] = data["title"]
                    # Optionally remove the title field to avoid confusion
                    # del data["title"]
                else:
                    print(f"🔧 Node {i}: Adding missing label")
                    data["label"] = f"Learning Topic {i+1}"
            
            # Ensure description exists
            if "description" not in data:
                print(f"🔧 Node {i}: Adding missing description")
                data["description"] = f"Learn about {data.get('label', 'this topic')}"
            
            # Validate position field
            position = node.get("position", {})
            if not isinstance(position, dict) or "x" not in position or "y" not in position:
                print(f"🔧 Fixing position for Node {i}")
                node["position"] = {"x": (i % 5) * 250, "y": (i // 5) * 200}

        # ENHANCED EDGE VALIDATION AND AUTO-FIX
        valid_node_ids = {node["id"] for node in parsed["nodes"]}
        fixed_edges = []
        connected_nodes = set()
        
        print("🔍 Starting edge validation and repair...")
        
        # Step 1: Validate existing edges and remove invalid ones
        for i, edge in enumerate(parsed["edges"]):
            # Check required fields
            required_fields = ["id", "source", "target"]
            edge_valid = True
            
            for field in required_fields:
                if field not in edge:
                    print(f"🔧 Edge {i} missing required field: {field}")
                    edge_valid = False
                    break
            
            if not edge_valid:
                continue
            
            # Validate that source and target nodes exist
            if edge["source"] not in valid_node_ids:
                print(f"🔧 Edge {i}: Invalid source '{edge['source']}' - node doesn't exist")
                continue
            
            if edge["target"] not in valid_node_ids:
                print(f"🔧 Edge {i}: Invalid target '{edge['target']}' - node doesn't exist")
                continue
            
            # Avoid self-referencing edges
            if edge["source"] == edge["target"]:
                print(f"🔧 Edge {i}: Self-referencing edge detected - skipping")
                continue
            
            # Edge is valid
            fixed_edges.append(edge)
            connected_nodes.add(edge["source"])
            connected_nodes.add(edge["target"])
        
        print(f"🔍 Valid edges found: {len(fixed_edges)}")
        print(f"🔍 Connected nodes: {len(connected_nodes)}/{len(valid_node_ids)}")
        
        # Step 2: Find orphaned nodes and create connections
        orphaned_nodes = valid_node_ids - connected_nodes
        if orphaned_nodes:
            print(f"🔧 Found {len(orphaned_nodes)} orphaned nodes: {orphaned_nodes}")
            
            # Strategy: Create a logical learning path
            node_list = parsed["nodes"]
            
            # Find start and end nodes
            start_nodes = [n for n in node_list if n["type"] == "start"]
            end_nodes = [n for n in node_list if n["type"] == "end"]
            
            # If we have too few edges, create a complete linear path
            if len(fixed_edges) < len(node_list) - 1:
                print("🔧 Creating complete linear learning path...")
                fixed_edges = []
                connected_nodes = set()
                
                for i in range(len(node_list) - 1):
                    current_node = node_list[i]
                    next_node = node_list[i + 1]
                    
                    edge_id = f"e{current_node['id']}-{next_node['id']}"
                    fixed_edges.append({
                        "id": edge_id,
                        "source": current_node["id"],
                        "target": next_node["id"]
                    })
                    connected_nodes.add(current_node["id"])
                    connected_nodes.add(next_node["id"])
                
                print(f"🔧 Created {len(fixed_edges)} linear connections")
            
            else:
                # Connect orphaned nodes to existing path
                for orphaned_id in orphaned_nodes:
                    orphaned_node = next((n for n in node_list if n["id"] == orphaned_id), None)
                    if not orphaned_node:
                        continue
                    
                    # Find a suitable connection based on node type
                    if orphaned_node["type"] == "start" and end_nodes:
                        # Connect start to first learning node
                        learning_nodes = [n for n in node_list if n["type"] not in ["start", "end"]]
                        if learning_nodes:
                            target_id = learning_nodes[0]["id"]
                            fixed_edges.append({
                                "id": f"e{orphaned_id}-{target_id}",
                                "source": orphaned_id,
                                "target": target_id
                            })
                            print(f"🔧 Connected start node {orphaned_id} to {target_id}")
                    
                    elif orphaned_node["type"] == "end":
                        # Connect last learning node to end
                        learning_nodes = [n for n in node_list if n["type"] not in ["start", "end"]]
                        if learning_nodes:
                            source_id = learning_nodes[-1]["id"]
                            fixed_edges.append({
                                "id": f"e{source_id}-{orphaned_id}",
                                "source": source_id,
                                "target": orphaned_id
                            })
                            print(f"🔧 Connected {source_id} to end node {orphaned_id}")
                    
                    else:
                        # Connect to nearby nodes in the sequence
                        node_index = next((i for i, n in enumerate(node_list) if n["id"] == orphaned_id), -1)
                        if node_index > 0:
                            prev_node = node_list[node_index - 1]
                            fixed_edges.append({
                                "id": f"e{prev_node['id']}-{orphaned_id}",
                                "source": prev_node["id"],
                                "target": orphaned_id
                            })
                            print(f"🔧 Connected {prev_node['id']} to orphaned {orphaned_id}")
                        
                        if node_index < len(node_list) - 1:
                            next_node = node_list[node_index + 1]
                            fixed_edges.append({
                                "id": f"e{orphaned_id}-{next_node['id']}",
                                "source": orphaned_id,
                                "target": next_node["id"]
                            })
                            print(f"🔧 Connected orphaned {orphaned_id} to {next_node['id']}")
        
        # Step 3: Ensure start and end nodes are properly connected
        start_nodes = [n for n in parsed["nodes"] if n["type"] == "start"]
        end_nodes = [n for n in parsed["nodes"] if n["type"] == "end"]
        
        if start_nodes:
            start_id = start_nodes[0]["id"]
            # Ensure start node has outgoing connections
            has_outgoing = any(edge["source"] == start_id for edge in fixed_edges)
            if not has_outgoing:
                learning_nodes = [n for n in parsed["nodes"] if n["type"] not in ["start", "end"]]
                if learning_nodes:
                    target_id = learning_nodes[0]["id"]
                    fixed_edges.append({
                        "id": f"e{start_id}-{target_id}",
                        "source": start_id,
                        "target": target_id
                    })
                    print(f"🔧 Added outgoing edge from start: {start_id} → {target_id}")
        
        if end_nodes:
            end_id = end_nodes[0]["id"]
            # Ensure end node has incoming connections
            has_incoming = any(edge["target"] == end_id for edge in fixed_edges)
            if not has_incoming:
                learning_nodes = [n for n in parsed["nodes"] if n["type"] not in ["start", "end"]]
                if learning_nodes:
                    source_id = learning_nodes[-1]["id"]
                    fixed_edges.append({
                        "id": f"e{source_id}-{end_id}",
                        "source": source_id,
                        "target": end_id
                    })
                    print(f"🔧 Added incoming edge to end: {source_id} → {end_id}")
        
        # Step 4: Remove duplicate edges
        unique_edges = []
        seen_connections = set()
        
        for edge in fixed_edges:
            connection = (edge["source"], edge["target"])
            if connection not in seen_connections:
                unique_edges.append(edge)
                seen_connections.add(connection)
            else:
                print(f"🔧 Removed duplicate edge: {edge['source']} → {edge['target']}")
        
        parsed["edges"] = unique_edges
        
        # Final validation summary
        final_connected_nodes = set()
        for edge in parsed["edges"]:
            final_connected_nodes.add(edge["source"])
            final_connected_nodes.add(edge["target"])
        
        print(f"✅ Edge validation complete:")
        print(f"   - Total nodes: {len(parsed['nodes'])}")
        print(f"   - Total edges: {len(parsed['edges'])}")
        print(f"   - Connected nodes: {len(final_connected_nodes)}/{len(valid_node_ids)}")
        print(f"   - Orphaned nodes: {len(valid_node_ids - final_connected_nodes)}")

        print(f"✅ Successfully generated roadmap with {len(parsed['nodes'])} nodes and {len(parsed['edges'])} edges")
        
        return parsed

    except json.JSONDecodeError as e:
        print(f"🚨 JSON Parse Error: {e}")
        print(f"🚨 Raw response: {response.get('response', 'N/A')}")
        raise HTTPException(
            status_code=500, 
            detail=f"AI generated invalid JSON format. Parse error: {str(e)}"
        )
    except ValueError as e:
        print(f"🚨 Validation Error: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"AI response validation failed: {str(e)}"
        )
    except Exception as e:
        print(f"🚨 Generation Error: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to generate roadmap: {str(e)}"
        )