import sys
import os
import asyncio
import time

# Add the root backend directory to the Python path
backend_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(backend_root)

import requests
import json
from utils.requests import SafeRequest


def search_subreddits(keywords: list[str], limit: int = 25):
    url = f"https://www.reddit.com/subreddits/search.json"
    params = {
        'q': ' '.join(keywords),
        'limit': limit,
        'sort': 'relevance'
    }
    headers = {
        'User-Agent': 'SubredditSearchBot/1.0'
    }
    
    try:
        data = SafeRequest.reddit_request(url, params, headers, verbose=True)
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

def search_posts_by_subreddit(subreddit: str, limit: int = 25):
    url = f"https://www.reddit.com/r/{subreddit}/top.json"
    params = {
        'limit': limit,
        'sort': 'top'
    }
    headers = {
        'User-Agent': 'SubredditSearchBot/1.0'
    }
    try:
        data = SafeRequest.reddit_request(url, params, headers, verbose=True)
        posts = []
        
        for child in data['data']['children']:
            post_data = child['data']
            post_info = {
                'title': post_data['title'],
                'content': post_data['selftext'],
                'url': post_data['url'],
                'score': post_data['score'],
            }
            posts.append(post_info)
            
        return posts
        
    except requests.exceptions.RequestException as e:
        return {'error': f'Request failed: {str(e)}'}
    except json.JSONDecodeError as e:
        return {'error': f'JSON decode error: {str(e)}'}
    except KeyError as e:
        return {'error': f'Unexpected response format: {str(e)}'}

async def search_posts_by_subreddit_async(subreddit: str, limit: int = 25):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, search_posts_by_subreddit, subreddit, limit)

async def search_posts_from_subreddits_parallel(subreddits: list[dict], limit: int = 25):
    start_time = time.time()
    tasks = [search_posts_by_subreddit_async(subreddit['name'], limit) for subreddit in subreddits]
    print(f"Created {len(tasks)} parallel tasks for fetching posts")
    
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    all_posts = []
    success_count = 0
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            print(f"Error fetching posts from r/{subreddits[i]['name']}: {result}")
            continue
        if isinstance(result, dict) and 'error' in result:
            print(f"Error in response for r/{subreddits[i]['name']}: {result['error']}")
            continue
        all_posts.extend(result)
        success_count += 1
        print(f"Successfully fetched {len(result)} posts from r/{subreddits[i]['name']}")
    
    end_time = time.time()
    print(f"Parallel execution completed in {end_time - start_time:.2f} seconds")
    print(f"Successfully fetched from {success_count}/{len(subreddits)} subreddits")
    
    return all_posts

if __name__ == "__main__":
    async def main():
        start_time = time.time()
        keyword = ["real estate", "asset management"]
        results = search_subreddits(keyword)
        
        if 'error' in results:
            print(f"Error: {results['error']}")
        else:
            print(f"Found {len(results)} subreddits for keyword '{keyword}':")
            posts = await search_posts_from_subreddits_parallel(results)
            print(f"Total posts fetched: {len(posts)}")
            print(json.dumps(posts[:5], indent=4))

        end_time = time.time()
        print(f"Time taken: {end_time - start_time} seconds")
    
    asyncio.run(main())

