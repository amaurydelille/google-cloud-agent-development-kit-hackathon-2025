import sys
import os
import asyncio
import json
import logging
from google.adk.agents import BaseAgent, LlmAgent, SequentialAgent
from google.adk.runners import Runner
from google_utils import search_google, fetch_website_content
from google.genai import types
from pydantic import BaseModel, Field
from google.adk.sessions import InMemorySessionService
from dotenv import load_dotenv
from typing import List

load_dotenv()

# Add the root backend directory to the Python path
backend_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(backend_root)

class SearchItem(BaseModel):
    title: str = Field(description="The title of the search result")
    link: str = Field(description="The URL of the search result")
    snippet: str = Field(description="A brief description of the search result")

class SearchOutput(BaseModel):
    items: List[SearchItem]

class GoogleAgent():

    def __init__(self, query: str, k: int = 10):
        self.query = query
        self.k = k
        self.search_results = search_google(self.query)

    async def initialize_agents(self):
        SEARCH_INSTRUCTION = f"""
        You are a search agent that can search the web for information given a query.
        Your role is to analyze the search results and return the {self.k} most items
        that are the most relevant to the query. You have a sharp eye for business
        opportunities and you are able select the items that will bring the most 
        value to the user, business-wise and opportunity-wise.

        Here is the query: {self.query}

        Here are the search results: {json.dumps(self.search_results, indent=2)}
        """

        self.search_agent = LlmAgent(
            name="search_agent",
            description="A search agent that can search the web for information given a query",
            instruction=SEARCH_INSTRUCTION,
            output_schema=SearchOutput,
            model="gemini-2.0-flash",
            generate_content_config=types.GenerateContentConfig(
                temperature=0.3
            ),
            disallow_transfer_to_parent=True,
            disallow_transfer_to_peers=True
        )

        FETCH_WEBSITE_INSTRUCTION = f"""
        You are a website content agent that can fetch the content of websites given their URL.
        You can use the fetch_website_content tool to fetch the content of a website.
        Your role is to fetch the content of every URL and to summarize the content of the websites
        and relate it to the query, from a business perspective. You will have to return a
        concise but relevant enough summary of what you found on every website. Your summary
        should be in the same language as the query and summarize every website in one.

        Here is the query: {self.query}
        """

        self.fetch_website_agent = LlmAgent(
            name="fetch_website_agent",
            description="A agent that can fetch the content of a website",
            instruction=FETCH_WEBSITE_INSTRUCTION,
            model="gemini-2.0-flash",
            tools=[fetch_website_content],
            generate_content_config=types.GenerateContentConfig(
                temperature=0.3
            ),
            disallow_transfer_to_parent=True,
            disallow_transfer_to_peers=True
        )

        self.sequential_agent = SequentialAgent(
            sub_agents=[self.search_agent, self.fetch_website_agent],
            name="sequential_agent",
            description="A agent that can search the web for information and fetch the content of a website",
        )

        self.session_service = InMemorySessionService()
        self.session = await self.session_service.create_session(
            session_id="google_session",
            user_id="google_user",
            app_name="google_app"
        )

        self.runner_agent = Runner(
            app_name="google_app",
            agent=self.sequential_agent,
            session_service=self.session_service,
        )

    async def call_agent_async(self):
        async for event in self.runner_agent.run_async(
            session_id="google_session",
            user_id="google_user",
            new_message=types.Content(parts=[types.Part(text=self.query)])
        ):
            print(f"  [Event] Author: {event.author}, Type: {type(event).__name__}, Final: {event.is_final_response()}, Content: {event.content}")
            if event.is_final_response():
                if event.content and event.content.parts[0].text:
                    final_response = event.content.parts[0].text
                elif event.actions and event.actions.escalate:
                    final_response = "I'm sorry, I'm not able to analyze the posts. Please try again."
                break
        print(final_response)

    async def run(self):
        await self.initialize_agents()
        await self.call_agent_async()

if __name__ == "__main__":
    async def main():
        query = "House and assets tokenization"
        agent = GoogleAgent(query=query)
        await agent.run()

    asyncio.run(main())
    
    