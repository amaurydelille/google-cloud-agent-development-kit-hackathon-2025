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
from typing import List, Dict, Any
from utils.models import run_sentiment_analysis, run_bigquery_query

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

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
        self.bigquery_metrics = []
        self.statista_insights = []
        self.final_summary = ""
        self.agent_errors = {}

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

        DO NOT include "```json" or "```" in your response.
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
        to fetch the content and then provide a comprehensive summary of all the websites combined. You
        have to be brutal and honest in your summary. If you think it's not worth it, say so. But if you think it's worth it,
        say so.

        Also, you should analyze the sentiment of the content of the websites and return the sentiment score and magnitude.
        You have a tool to run sentiment analysis on the content of the websites.
        The final sentiment score and magnitude is the average of the sentiment scores and magnitudes of the websites.

        Your summary should:
        - Be in the same language as the query
        - Focus on business opportunities and insights
        - Synthesize information from all websites into a cohesive analysis
        - Highlight key findings relevant to the query
        - Contain no more than 300 words.

        Here is the query: {self.query}

        Here is the format of the output:
        {{
            "summary": "...",
            "sentiment_score": ...,
            "sentiment_magnitude": ...
        }}

        DO NOT include "```json" or "```" in your response.
        DO NOT include any other text in your response.
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

        BIGQUERY_INSTRUCTION = f"""
        You are a data analysis agent that can query BigQuery public datasets to find real-world statistics.
        Your task is to find any relevant metrics, growth trends, or economic indicators for the following user query:

        User query: "{self.query}"

        You have to write SQL queries to find the most relevant metrics, growth trends, or economic indicators related to the user query.
        Then you have to run the SQL queries to get the data, using the function tool I gave you.
        You can use any public dataset available in BigQuery.
        You have to return numbers as metrics in the field "value".

        Return a JSON output being a list of objects with the following structure:
        {{
            "metric_name": "...",
            "value": ...,
            "unit": "...",
            "source_dataset": "...",
            "insight_summary": "..."
        }}

        If nothing useful is found, return an empty array [].
        DO NOT include "```json" or "```" in your response.
        """

        self.bigquery_agent = LlmAgent(
            name="bigquery_agent",
            description="Queries BigQuery for economic/market metrics",
            instruction=BIGQUERY_INSTRUCTION,
            model="gemini-1.5-pro",
            tools=[run_bigquery_query],
            generate_content_config=types.GenerateContentConfig(temperature=0.3),
            disallow_transfer_to_parent=True,
            disallow_transfer_to_peers=True
        )

        STATISTA_INSTRUCTION = f"""
        You are a summarization agent that analyzes any data summaries or scraped content from known economic sources like Statista.
        You will simulate or synthesize insights about the business domain in this query:
        You have to return numbers as metrics in the field "value".

        "{self.query}"

        Summarize likely market size, segmentation, and revenue projections if available.
        Return a JSON output being a list of objects with the following structure:
        {{
            "metric_name": "...",
            "value": ...,
            "unit": "...",
            "source_dataset": "...",
            "insight_summary": "..."
        }}

        If nothing useful is found, return an empty array [].
        DO NOT include "```json" or "```" in your response.
        """

        self.statista_agent = LlmAgent(
            name="statista_agent",
            description="Synthesizes insights similar to Statista market summaries",
            instruction=STATISTA_INSTRUCTION,
            model="gemini-2.0-flash",
            generate_content_config=types.GenerateContentConfig(temperature=0.3),
            disallow_transfer_to_parent=True,
            disallow_transfer_to_peers=True
        )

        self.sequential_agent = SequentialAgent(
            sub_agents=[
                self.search_agent,
                self.fetch_website_agent,
                self.bigquery_agent,
                self.statista_agent
            ],
            name="sequential_agent",
            description="Performs a full research + data insight analysis",
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

    def parse_json_response(self, text: str):
        try:
            text = text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            return json.loads(text.strip())
        except:
            return []

    async def call_agent_async(self):
        final_response = None
        try:
            async for event in self.runner_agent.run_async(
                session_id="google_session",
                user_id="google_user",
                new_message=types.Content(parts=[types.Part(text=self.query)])
            ):
                yield event
                if event.is_final_response():
                    if event.content and event.content.parts[0].text:
                        final_response = event.content.parts[0].text
                        
                        try:
                            if event.author == "bigquery_agent":
                                self.bigquery_metrics = self.parse_json_response(final_response)
                                logger.info(f"✅ BigQuery metrics collected: {len(self.bigquery_metrics)} items")
                            elif event.author == "statista_agent":
                                self.statista_insights = self.parse_json_response(final_response)
                                logger.info(f"✅ Statista insights collected: {len(self.statista_insights)} items")
                            elif event.author == "fetch_website_agent":
                                self.final_summary = final_response
                                logger.info(f"✅ Website summary collected")
                            
                            logger.info(f"✅ {event.author} completed successfully")
                        except Exception as e:
                            error_msg = f"Error processing {event.author} response: {str(e)}"
                            logger.error(error_msg)
                            self.agent_errors[event.author] = error_msg
                            
                            # Set empty results for failed agents
                            if event.author == "bigquery_agent":
                                self.bigquery_metrics = []
                            elif event.author == "statista_agent":
                                self.statista_insights = []
                            elif event.author == "fetch_website_agent":
                                self.final_summary = "Error processing website content."
                    elif event.actions and event.actions.escalate:
                        error_msg = f"❌ {event.author} failed"
                        logger.error(error_msg)
                        self.agent_errors[event.author] = error_msg
                        
                        # Set empty results for failed agents
                        if event.author == "bigquery_agent":
                            self.bigquery_metrics = []
                        elif event.author == "statista_agent":
                            self.statista_insights = []
                        elif event.author == "fetch_website_agent":
                            self.final_summary = "Error processing website content."
                    
                    if event.author == "statista_agent":
                        break
            
            if not final_response:
                error_msg = "❌ No final response received"
                logger.error(error_msg)
                self.agent_errors["final"] = error_msg
                
        except Exception as e:
            error_msg = f"Fatal error in agent execution: {str(e)}"
            logger.error(error_msg)
            self.agent_errors["fatal"] = error_msg

    def get_structured_results(self) -> Dict[str, Any]:
        return {
            "summary": self.final_summary,
            "bigquery_metrics": self.bigquery_metrics,
            "statista_insights": self.statista_insights,
            "timestamp": asyncio.get_event_loop().time(),
            "errors": self.agent_errors if self.agent_errors else None
        }

    async def run(self):
        await self.initialize_agents()
        await self.call_agent_async()
        return self.get_structured_results()

if __name__ == "__main__":
    async def main():
        query = "House and assets tokenization"
        agent = GoogleAgent(query=query)
        await agent.run()

    asyncio.run(main())
    
    