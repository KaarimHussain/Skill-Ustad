# utils/web_search.py
from duckduckgo_search import DDGS

def perform_web_search(query, max_results=3):
    results = []
    with DDGS() as ddgs:
        for r in ddgs.text(query):
            if r["body"]:
                results.append({
                    "title": r["title"],
                    "snippet": r["body"],
                    "link": r["href"]
                })
            if len(results) >= max_results:
                break
    return results
