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

from google.adk.agents import BaseAgent, LlmAgent, ParallelAgent
from google.adk.agents.invocation_context import InvocationContext
from google.genai import types
from reddit_utils import search_subreddits, search_posts_from_subreddits_parallel
from pydantic import BaseModel
from google.adk.events import Event
from typing import AsyncGenerator
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner

# Contexts refers to the information available yo our agent and its tools during
# specific operations. It's like a background knowledge and resources needed to
# perform the task.

SESSION_ID = "reddit_session"
USER_ID = "reddit_user"

class RedditAgent():
    class SummaryOutput(BaseModel):
        summary: str

    class ProsConsOutput(BaseModel):
        pros: list[str]
        cons: list[str]

    keywords: list[str]
    posts: list | None = None
    summarizer_agent: LlmAgent | None = None
    pros_cons_agent: LlmAgent | None = None
    summarizer_instructions: str | None = None
    pros_cons_instructions: str | None = None

    def __init__(self, keywords: list[str]):
        logger.info(f"Initializing RedditAgent with keywords: {keywords}")
        self.keywords = keywords

    async def initialize_agents(self):
        self.posts = await self.get_relevant_posts_from_subreddits_by_keywords(self.keywords)
        logger.info(f"Found {len(self.posts)} total posts from all subreddits")

        summarizer_instructions = f"""
        You are a helpful assistant that summarizes posts from a given subreddit without losing
        relevant information and key points.
        
        Your summary should be human readable and easy to understand, straight to the point.
        You should not include any other information than the summary.

        Here are the posts to summarize:
        {json.dumps(self.posts, indent=4)}
        """
        
        self.summarizer_agent = LlmAgent(
            name="Summarizer",
            description="Summarize the posts",
            tools=[],
            model="gemini-2.0-flash",
            generate_content_config=types.GenerateContentConfig(
                temperature=0.3,
            ),
            instruction=summarizer_instructions,
            output_schema=self.SummaryOutput,
            output_key="summary",
            disallow_transfer_to_parent=True,
            disallow_transfer_to_peers=True
        )

        pros_cons_instructions = f"""
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
        
        self.pros_cons_agent = LlmAgent(
            name="ProsCons",
            description="Analyze the posts and identify the pros and cons",
            tools=[],
            model="gemini-2.0-flash",
            generate_content_config=types.GenerateContentConfig(
                temperature=0.3,
            ),
            instruction=pros_cons_instructions,
            output_schema=self.ProsConsOutput,
            output_key="pros_cons",
            disallow_transfer_to_parent=True,
            disallow_transfer_to_peers=True
        )

        self.parallel_agent = ParallelAgent(
            name="Parallel",
            description="Run the summarizer and pros/cons agents in parallel",
            sub_agents=[self.summarizer_agent, self.pros_cons_agent],
        )

        self.session_service = InMemorySessionService()
        self.session = await self.session_service.create_session(
            session_id="reddit_session",
            user_id="reddit_user",
            app_name="RedditAgent"
        )

        self.runner_agent = Runner(
            agent=self.parallel_agent,
            app_name="RedditAgent",
            session_service=self.session_service
        )

    async def get_relevant_posts_from_subreddits_by_keywords(self, keywords: list[str], limit: int = 25):
        logger.info(f"Searching for subreddits with keywords: {keywords}, limit: {limit}")
        subreddits = search_subreddits(keywords, limit)
        logger.info(f"Found {len(subreddits)} relevant subreddits")
        
        logger.info("Fetching posts from all subreddits in parallel...")
        posts = await search_posts_from_subreddits_parallel(subreddits, limit)
        
        logger.info(f"Total posts collected: {len(posts)}")
        return posts

    async def call_agent_async(self):
        final_response = None
        async for event in self.runner_agent.run_async(
            session_id="reddit_session",
            user_id="reddit_user",
            new_message=types.Content(parts=[types.Part(text="Analyze reddit for business idea.")])
        ):
            print(f"  [Event] Author: {event.author}, Type: {type(event).__name__}, Final: {event.is_final_response()}, Content: {event.content}")
            yield event
            if event.is_final_response():
                if event.content and event.content.parts[0].text:
                    final_response = event.content.parts[0].text
                elif event.actions and event.actions.escalate:
                    final_response = "I'm sorry, I'm not able to analyze the posts. Please try again."
                break
        
        if final_response:
            print(final_response)
        else:
            print("No final response received")

    async def run(self):
        await self.initialize_agents()
        await self.call_agent_async()

if __name__ == "__main__":

    async def main():
        logger.info("Starting Reddit Agent application")
        reddit_agent = RedditAgent(keywords=["real estate", "asset management"])
        logger.info("Reddit Agent created, starting analysis")

        await reddit_agent.run()

        logger.info("Analysis completed, processing results")
  
    asyncio.run(main()) 
    

