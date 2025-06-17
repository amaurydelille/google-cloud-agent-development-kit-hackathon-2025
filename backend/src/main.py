from fastapi import FastAPI, Request, Response
import uvicorn
from agents.google.google_agent import GoogleAgent
from fastapi.responses import StreamingResponse
import json
import logging

app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

async def event_generator(google_agent):
    try:
        logger.info("Starting event generator")
        await google_agent.initialize_agents()
        async for event in google_agent.call_agent_async():
            logger.info(f"Event received: {event.author}")
            if event.content and event.content.parts:
                data = {
                    "author": event.author,
                    "content": event.content.parts[0].text if event.content.parts[0].text else "",
                    "is_final": event.is_final_response()
                }
                yield f"data: {json.dumps(data)}\n\n"
        
        structured_results = google_agent.get_structured_results()
        final_data = {
            "author": "final_results",
            "content": json.dumps(structured_results),
            "is_final": True,
            "structured_data": structured_results
        }
        yield f"data: {json.dumps(final_data)}\n\n"
        
    except Exception as e:
        error_data = {"error": str(e)}
        yield f"data: {json.dumps(error_data)}\n\n"

@app.post("/search")
async def search(request: Request):
    try:
        data = await request.json()
        google_agent = GoogleAgent(query=data['query'])
        return StreamingResponse(
            event_generator(google_agent),
            media_type="text/event-stream"
        )
    except Exception as e:
        return {"message": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

