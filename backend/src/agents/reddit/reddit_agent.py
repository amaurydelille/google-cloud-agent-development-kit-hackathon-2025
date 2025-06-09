import sys
import os
import asyncio
import json
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Add the root backend directory to the Python path
backend_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(backend_root)

from google.adk.agents import LlmAgent, ParallelAgent
from google.genai import types
from reddit_utils import search_subreddits, search_posts_from_subreddits_parallel
from pydantic import BaseModel

class RedditAgent:
    class SummaryOutput(BaseModel):
        summary: str

    class ProsConsOutput(BaseModel):
        pros: list[str]
        cons: list[str]

    def __init__(self, keywords: list[str]):
        logger.info(f"Initializing RedditAgent with keywords: {keywords}")
        self.keywords = keywords

    async def initialize_agents(self):
        self.posts = await self.get_relevant_posts_from_subreddits_by_keywords(self.keywords)
        logger.info(f"Found {len(self.posts)} total posts from all subreddits")

        logger.info("Creating summarizer agent instructions")
        self.summarizer_instructions = f"""
        You are a helpful assistant that summarizes posts from a given subreddit without losing
        relevant information and key points.
        
        Your summary should be human readable and easy to understand, straight to the point.
        You should not include any other information than the summary.

        Here are the posts to summarize:
        {json.dumps(self.posts, indent=4)}
        """
        logger.info("Initializing summarizer agent")
        self.summarizer_agent = LlmAgent(
            name="Summarizer",
            description="Summarize the posts",
            tools=[],
            model="gemini-2.0-flash",
            generate_content_config=types.GenerateContentConfig(
                temperature=0.3,
            ),
            instruction=self.summarizer_instructions,
            output_schema=self.SummaryOutput,
            output_key="summary",
            disallow_transfer_to_parent=True,
            disallow_transfer_to_peers=True
        )

        logger.info("Creating pros/cons agent instructions")
        self.pros_cons_instructions = f"""
        You have a sharp eye for business opportunities and trends, you are able to identify the most relevant posts and classify them
        into pros and cons depending on the given business idea keywords.
        You are also able to identify non-relevant posts and filter them out, as well as sterile business opportunities and trends.
        So you need to return a list of pros and a list of cons.
        
        Your lists should be human readable and easy to understand, straight to the point.
        You should not include any other information than the summary.

        Here is the business idea: {", ".join(self.keywords)}
        Here are the posts to analyze:
        {json.dumps(self.posts, indent=4)}
        """
        logger.info("Initializing pros/cons agent")
        self.pros_cons_agent = LlmAgent(
            name="ProsCons",
            description="Analyze the posts and identify the pros and cons",
            tools=[],
            model="gemini-2.0-flash",
            generate_content_config=types.GenerateContentConfig(
                temperature=0.3,
            ),
            instruction=self.pros_cons_instructions,
            output_schema=self.ProsConsOutput,
            output_key="pros_cons",
            disallow_transfer_to_parent=True,
            disallow_transfer_to_peers=True
        )
        logger.info("RedditAgent initialization completed")

    async def get_relevant_posts_from_subreddits_by_keywords(self, keywords: list[str], limit: int = 25):
        logger.info(f"Searching for subreddits with keywords: {keywords}, limit: {limit}")
        subreddits = search_subreddits(keywords, limit)
        logger.info(f"Found {len(subreddits)} relevant subreddits")
        print(subreddits)
        
        logger.info("Fetching posts from all subreddits in parallel...")
        posts = await search_posts_from_subreddits_parallel(subreddits, limit)
        
        logger.info(f"Total posts collected: {len(posts)}")
        return posts

    async def run(self):
        await self.initialize_agents()
        
        logger.info("Starting Reddit analysis with parallel agents")
        manager_agent = ParallelAgent(
            name="Manager",
            description="Manage the sub-agents",
            sub_agents=[self.summarizer_agent, self.pros_cons_agent]
        )
        logger.info("Created parallel agent manager")
        
        agent_event_generator = manager_agent.run_async()
        logger.info("Started async agent execution")
        
        async for event in agent_event_generator:
            logger.info(f"Received agent event: {type(event).__name__}")
            logger.debug(f"Event details: {event}")
            yield event
        
        logger.info("Reddit analysis completed")


if __name__ == "__main__":
    async def main():
        logger.info("Starting Reddit Agent application")
        reddit_agent = RedditAgent(keywords=["real estate", "asset management"])
        logger.info("Reddit Agent created, starting analysis")
        
        results = []
        async for event in reddit_agent.run():
            results.append(event)
        
        logger.info("Analysis completed, processing results")
        print(json.dumps(results, indent=4, default=str))
        return results
    
    asyncio.run(main())
    

