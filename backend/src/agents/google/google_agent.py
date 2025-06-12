import sys
import os
import asyncio
import json
import logging
from google.adk.agents import BaseAgent, LlmAgent, SequentialAgent
from google.adk.runners import Runner
from .google_utils import search_google, fetch_website_content
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
        Your role is to analyze the search results and return the {self.k} most relevant URLs
        that will bring the most value to the user, business-wise and opportunity-wise.

        Here is the query: {self.query}

        Here are the search results: {json.dumps(self.search_results, indent=2)}

        Return only the URLs of the most relevant results, one per line, then hand off to the next agent to fetch and analyze the content.
        Here is the format of the output:

        {{
            "urls": [
                "url1",
                "url2",
                "url3",
                ...
            ]
        }}

        DO NOT include any other text in your response.
        """

        self.search_agent = LlmAgent(
            name="search_agent",
            description="A search agent that can search the web for information given a query",
            instruction=SEARCH_INSTRUCTION,
            model="gemini-2.0-flash",
            generate_content_config=types.GenerateContentConfig(
                temperature=0.3
            ),
            disallow_transfer_to_parent=True
        )

        FETCH_WEBSITE_INSTRUCTION = f"""
        You are a website content agent that can fetch the content of websites given their URLs.
        You will receive a list of URLs from the previous agent. For each URL, use the fetch_website_content tool 
        to fetch the content and then provide a comprehensive summary of all the websites combined.

        Your summary should:
        - Be in the same language as the query
        - Focus on business opportunities and insights
        - Synthesize information from all websites into a cohesive analysis
        - Highlight key findings relevant to the query

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
        final_response = None
        async for event in self.runner_agent.run_async(
            session_id="google_session",
            user_id="google_user",
            new_message=types.Content(parts=[types.Part(text=self.query)])
        ):
            print(f"  [Event] Author: {event.author}, Type: {type(event).__name__}, Final: {event.is_final_response()}, Content: {event.content}")
            yield event
            if event.is_final_response():
                if event.content and event.content.parts[0].text:
                    final_response = event.content.parts[0].text
                elif event.actions and event.actions.escalate:
                    final_response = "I'm sorry, I'm not able to analyze the posts. Please try again."
                
                if event.author == "fetch_website_agent":
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
        query = "House and assets tokenization"
        agent = GoogleAgent(query=query)
        await agent.run()

    asyncio.run(main())
    
    