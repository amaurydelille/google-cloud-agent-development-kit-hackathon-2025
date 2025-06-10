import sys
import os
import asyncio
import time
from dotenv import load_dotenv
import bs4

load_dotenv()

# Google API key and custom search engine ID
GOOGLE_CUSTOM_SEARCH_API = os.getenv("GOOGLE_CUSTOM_SEARCH_API")
GOOGLE_CX = os.getenv("GOOGLE_CX")


# Add the root backend directory to the Python path
backend_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
sys.path.append(backend_root)

import requests
import json
from utils.requests import SafeRequest

BASE_URL = "https://www.googleapis.com/customsearch/v1"

link_example = "https://www.coe.int/en/web/interculturalcities/paris"

def search_google(query: str, api_key: str = GOOGLE_CUSTOM_SEARCH_API, cx: str = GOOGLE_CX, num: int = 10) -> list[dict]:
    try:
        params = {
            'q': query,
            'cx': cx,
            'num': num,
            'key': api_key
        }

        response = SafeRequest.google_request(BASE_URL, params=params)

        if response and response.get('items'):
            return response['items']
        else:
            return []
        
    except Exception as e:
        print(f"Error searching Google: {e}")
        return []
    
def fetch_website_content(url: str) -> str:
    try:
        response = requests.get(url)
        soup = bs4.BeautifulSoup(response.text, 'html.parser')
        
        # We assume that the JS, footer and header are not relevant to the content
        for script_or_style in soup(['script', 'style', 'footer', 'header']):
            script_or_style.decompose()
        
        # Get the text content of the body
        body_text = soup.body.get_text(strip=True)
        
        return body_text

    except Exception as e:
        print(f"Error fetching website content: {e}")
        return ""
    
if __name__ == "__main__":
    search_result = search_google("What is the capital of France?")
    print(json.dumps(search_result, indent=4))