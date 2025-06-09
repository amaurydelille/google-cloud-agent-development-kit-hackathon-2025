import sys
import os

# Add the src directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from google.adk.agents import LlmAgent, BaseAgent, SequentialAgent
import requests
import json
from utils.requests import safe_request

# =================================
# QUICK GUIDE FOR GOOGLE ADK AGENTS
# =================================
# - BaseAgent:       Abstract class for all agents.

# - LLMAgent:        Core component, "thinking" and non-deterministic agent. 
#                    Leverages LLMs to generate responses, make decisions and interact
#                    with tools.

# - WorkflowAgent:   Agent that controls the execution flow of sub-agents.
#                    Manager deciding how and when other agents run.

# - CustomAgent:     Provides flexibility to build custom agents following arbitrary
#                    orchestration logic.

# - ParallelAgent:   Executes multiple agents in parallel.

# - SequentialAgent: Executes a sequence of agents in order.


def search_subreddits(keywords: list[str], limit: int = 25):
    url = f"https://www.reddit.com/subreddits/search.json"
    params = {
        'q': keyword,
        'limit': limit,
        'sort': 'relevance'
    }
    headers = {
        'User-Agent': 'SubredditSearchBot/1.0'
    }
    
    try:
        data = safe_request(url, params, headers, verbose=True)
        subreddits = []
        
        for child in data['data']['children']:
            subreddit_data = child['data']
            subreddit_info = {
                'name': subreddit_data['display_name'],
                'title': subreddit_data['title'],
                'description': subreddit_data.get('public_description', ''),
                'subscribers': subreddit_data.get('subscribers', 0),
                'url': f"https://reddit.com{subreddit_data['url']}"
            }
            subreddits.append(subreddit_info)
        
        return subreddits
        
    except requests.exceptions.RequestException as e:
        return {'error': f'Request failed: {str(e)}'}
    except json.JSONDecodeError as e:
        return {'error': f'JSON decode error: {str(e)}'}
    except KeyError as e:
        return {'error': f'Unexpected response format: {str(e)}'}


if __name__ == "__main__":
    keyword = "python"
    results = search_subreddits(keyword)
    
    if 'error' in results:
        print(f"Error: {results['error']}")
    else:
        print(f"Found {len(results)} subreddits for keyword '{keyword}':")
        for subreddit in results:
            print(f"- r/{subreddit['name']}: {subreddit['title']} ({subreddit['subscribers']} subscribers)")

