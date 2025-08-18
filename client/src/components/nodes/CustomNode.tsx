// CustomNodes.tsx
import React from 'react';
import { type NodeProps } from 'reactflow';
import { type NodeData } from '@/types/nodes';

export const StartNode: React.FC<NodeProps<NodeData>> = ({ data }) => (
    <div className="custom-node start-node">
        <div className="node-label">{data.label}</div>
        <div className="node-description">{data.description}</div>
    </div>
);

export const CourseNode: React.FC<NodeProps<NodeData>> = ({ data }) => (
    <div className="custom-node course-node">
        <div className="node-label">{data.label}</div>
        <div className="node-description">{data.description}</div>
    </div>
);

export const MilestoneNode: React.FC<NodeProps<NodeData>> = ({ data }) => (
    <div className="custom-node milestone-node">
        <div className="node-label">{data.label}</div>
        <div className="node-description">{data.description}</div>
    </div>
);

export const ProjectNode: React.FC<NodeProps<NodeData>> = ({ data }) => (
    <div className="custom-node project-node">
        <div className="node-label">{data.label}</div>
        <div className="node-description">{data.description}</div>
    </div>
);

export const EndNode: React.FC<NodeProps<NodeData>> = ({ data }) => (
    <div className="custom-node end-node">
        <div className="node-label">{data.label}</div>
        <div className="node-description">{data.description}</div>
    </div>
);

export const nodeTypes = {
    start: StartNode,
    course: CourseNode,
    milestone: MilestoneNode,
    project: ProjectNode,
    end: EndNode,
};