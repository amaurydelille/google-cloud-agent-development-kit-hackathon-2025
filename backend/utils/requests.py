import requests as req
import time
import json
import random

class SafeRequest:
    # Class-level variables for rate limiting
    _count_reddit = 0
    _start_time_reddit = time.time()
    _last_request_time = 0

    _count_google = 0 # Google API limits are 100 requests per day

    @staticmethod
    def __request(url: str, method: str = 'GET', params: dict = {}, headers: dict = {}, 
                data: dict = {}, retries: int = 3, verbose: bool = False) -> dict:
        for attempt in range(retries):
            try:
                response = req.request(method, url, params=params, headers=headers, data=data)
                response.raise_for_status()
                response_data = response.json() 
                if verbose:
                    print(f"Request successful for {url}")
                return response_data
            except req.exceptions.RequestException as e:
                if hasattr(e, 'response') and e.response and e.response.status_code == 429:
                    wait_time = (2 ** attempt) * 60 + random.uniform(0, 30)
                    if verbose:
                        print(f"Rate limited (429), waiting {wait_time:.2f} seconds before retry {attempt + 1}/{retries}")
                    time.sleep(wait_time)
                elif attempt == retries - 1:
                    raise e
                else:
                    time.sleep(2 ** attempt)
                    
        raise req.exceptions.RequestException(f"Failed to fetch data from {url} after {retries} attempts")

    @staticmethod
    def reddit_request(url: str, params: dict = {}, headers: dict = {}, 
                    data: dict = {}, retries: int = 5, verbose: bool = False) -> dict:
        try:
            current_time = time.time()
            
            if SafeRequest._last_request_time > 0:
                time_since_last = current_time - SafeRequest._last_request_time
                min_delay = 5.0
                if time_since_last < min_delay:
                    sleep_time = min_delay - time_since_last + random.uniform(1, 3)
                    if verbose:
                        print(f"Rate limiting: waiting {sleep_time:.2f} seconds between requests")
                    time.sleep(sleep_time)
            
            if current_time - SafeRequest._start_time_reddit >= 60:
                SafeRequest._count_reddit = 0
                SafeRequest._start_time_reddit = current_time
            
            SafeRequest._count_reddit += 1
            if SafeRequest._count_reddit >= 10:
                wait_time = 60 - (current_time - SafeRequest._start_time_reddit) + random.uniform(10, 20)
                if wait_time > 0:
                    if verbose:
                        print(f"Conservative rate limit reached, waiting {wait_time:.2f} seconds...")
                    time.sleep(wait_time)
                SafeRequest._count_reddit = 0
                SafeRequest._start_time_reddit = time.time()

            headers['User-Agent'] = 'SubredditSearchBot/1.0'
            SafeRequest._last_request_time = time.time()
            return SafeRequest.__request(url, 'GET', params, headers, data, retries, verbose)
            
        except req.exceptions.RequestException as e:
            if verbose:
                print(f"Request failed: {e}")
            raise e
        
    @staticmethod
    def google_request(url: str, params: dict = {}, headers: dict = {}, 
                    data: dict = {}, retries: int = 5, verbose: bool = False) -> dict:
        try:
            if SafeRequest._count_google >= 99:
                raise req.exceptions.RequestException("Google API limit reached")
            
            SafeRequest._count_google += 1
            return SafeRequest.__request(url, 'GET', params, headers, data, retries, verbose)
        except req.exceptions.RequestException as e:
            if verbose:
                print(f"Request failed: {e}")
            raise e