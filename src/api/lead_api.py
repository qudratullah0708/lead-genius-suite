from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import Optional, List, Dict, Any
import json
import re
from tavily import TavilyClient
from groq import Groq
from dotenv import load_dotenv

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables
load_dotenv()

# Get API keys
model_api_key = os.getenv("GROQ_API_KEY")
tavily_api_key = os.getenv("TAVILY_API_KEY")

# Initialize clients if API keys are available
tavily_client = TavilyClient(api_key=tavily_api_key) if tavily_api_key else None
groq_client = Groq(api_key=model_api_key) if model_api_key else None

def Scrap_News(topic: str):
    """Fetch latest news on a topic using Tavily API"""
    if not tavily_client:
        raise ValueError("Tavily API key is missing. Set TAVILY_API_KEY in your .env file.")
    
    print(f"Fetching Latest News for: {topic}...")
    response = tavily_client.search(topic, search_depth="advanced")
    
    if not response or "results" not in response:
        raise ValueError("Invalid response from Tavily API.")
    
    retrieved_content = "\n".join(
        [f"Source: {result.get('url', 'Unknown')}\nTitle: {result.get('title', 'Unknown')}\nContent: {result.get('content', 'No content')}\n---" 
         for result in response.get("results", []) if "content" in result]
    )
    print(f"Raw Content : {retrieved_content}")
    return retrieved_content

def ExtractContent(content, query):
    """Extract and structure content using Groq API"""
    if not groq_client:
        raise ValueError("Groq API key is missing. Set GROQ_API_KEY in your .env file.")
    
    prompt = f"""
You are an expert data extraction and formatting assistant. Your task is to process raw web-scraped content and transform it into a structured, readable format for further analysis or presentation.

**Input Content:**
{content}

**Instructions:**
1. **Extract Key Entities:** Identify and list all significant entities such as company names, product names, technologies, and individuals mentioned in the content.
2. **Categorize Information:** Organize the extracted entities into relevant categories (e.g., Companies, Technologies, Individuals, Events, Financial Data).
3. **Summarize Key Points:** Provide concise summaries or bullet points highlighting the most important information from the content.
4. **Maintain Contextual Integrity:** Ensure that the extracted information accurately reflects the context of the original content.
5. **Format Output Clearly:** Present the extracted and summarized information in a well-structured format, such as JSON, CSV, or Markdown, as appropriate.



Now, process the provided content according to the above instructions.
"""
    print("\n\n********Extracting Leads From Content*********")
    
    completion = groq_client.chat.completions.create(
        model="deepseek-r1-distill-llama-70b",
        messages=[{"role": "user", "content": prompt}]
    )

    response = completion.choices[0].message.content.split("</think>")
    return response[1] if len(response) > 1 else response[0]
    
    try:
        json_match = re.search(r'\[[\s\S]*\]', response, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            leads = json.loads(json_str)
        else:
            leads = json.loads(response)
            
        if not leads:
            print("No leads extracted from content.")
            return []
            
        return leads
    except json.JSONDecodeError:
        print("Failed to parse JSON from response")
        print(f"Raw response: {response}")
        return []
    except Exception as e:
        print(f"Error extracting leads: {str(e)}")
        print(f"Raw response: {response}")
        return []

@app.get("/")
async def root():
    return {"message": "LeadGen API is running"}

@app.get("/api/search")
async def search(query: str):
    if not query or query.strip() == "":
        raise HTTPException(status_code=400, detail="Search query cannot be empty")
    
    try:
        if not tavily_api_key or not model_api_key:
            raise ValueError("API keys are missing. Make sure both TAVILY_API_KEY and GROQ_API_KEY are set in your .env file.")
        
        retrieved_content = Scrap_News(query)
        results = ExtractContent(retrieved_content, query)

        print(type(results), results)

        
        for i, lead in enumerate(results):
         if isinstance(lead, dict) and "id" not in lead:
          lead["id"] = str(i + 1)

        
        return {
            "success": True,
            "query": query,
            "timestamp": "2025-05-09T00:00:00Z",
            "results": results
        }
            
    except Exception as e:
        print(f"Error processing search query: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing search query: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
