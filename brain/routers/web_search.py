from fastapi import APIRouter
from duckduckgo_search import DDGS
import requests
from bs4 import BeautifulSoup

router = APIRouter()

# Scraper function to extract full content from a URL
def fetch_full_content(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        res = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(res.text, 'html.parser')

        # Extract meta title
        title = soup.title.string.strip() if soup.title else "No title"

        # Extract first 10 paragraphs (skip empty ones)
        paragraphs = [p.get_text(strip=True) for p in soup.find_all('p')]
        paragraphs = [p for p in paragraphs if p]  # remove empty
        content = "\n".join(paragraphs[:10]) if paragraphs else "No readable content."

        return {
            "scraped_title": title,
            "content": content
        }
    except Exception as e:
        return {
            "scraped_title": "Error fetching content",
            "content": str(e)
        }

# Final API endpoint with search + scraping
@router.get("/api/search")
async def getResult(query: str, max_results: int = 5):
    final_results = []
    with DDGS() as ddgs:
        results = ddgs.text(query)

        for r in list(results)[:max_results]:
            if not r.get("href"): continue

            scraped = fetch_full_content(r["href"])
            final_results.append({
                "title": r.get("title", "No title"),
                "snippet": r.get("body", "No snippet"),
                "link": r.get("href", "No link"),
                "scraped_title": scraped["scraped_title"],
                "full_content": scraped["content"]
            })

    return final_results
