
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import Optional, List, Dict, Any
import json

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
tavily_client = None
groq_client = None

if tavily_api_key:
    tavily_client = TavilyClient(api_key=tavily_api_key)

if model_api_key:
    groq_client = Groq(api_key=model_api_key)

def Scrap_News(topic: str):
    """Fetch latest news on a topic using Tavily API"""
    if not tavily_client:
        raise ValueError("Tavily API key is missing. Set TAVILY_API_KEY in your .env file.")
    
    print(f"Fetching Latest News for: {topic}...")
    response = tavily_client.search(topic)
    
    if not response or "results" not in response:
        raise ValueError("Invalid response from Tavily API.")
    
    retrieved_content = "\n".join(
        [result["content"] for result in response.get("results", []) if "content" in result]
    )
    return retrieved_content

def ExtractContent(content):
    """Extract and structure content using Groq API"""
    if not groq_client:
        raise ValueError("Groq API key is missing. Set GROQ_API_KEY in your .env file.")
    
    prompt = f"""
You are an expert data extraction and formatting assistant. Your task is to process raw web-scraped content and transform it into a structured, readable format for further analysis or presentation.

**Input Content:**
{content}

**Instructions:**
1. Extract leads from the content, focusing on individuals in marketing, sales, or leadership roles at companies.
2. Structure the data into a JSON format with these fields: name, title, company, email (use a reasonable guess based on name+company if not available), phone (if available, otherwise empty), source (the source of this lead), and location (if available, otherwise empty).
3. Only include leads that have at least a name, title, and company.
4. Aim to provide at least 5 leads if possible, but focus on quality over quantity.
5. Format as a valid JSON array of lead objects.

Example output format:
[
  {{
    "name": "John Smith",
    "title": "Chief Marketing Officer",
    "company": "AI Solutions Inc",
    "email": "j.smith@aisolutions.com",
    "phone": "",
    "source": "LinkedIn",
    "location": "San Francisco, USA"
  }},
  // more leads...
]

Now, process the provided content according to the above instructions.
"""

    print("\n\n********Extracting Meaningful Insights******...")
    
    completion = groq_client.chat.completions.create(
        model="deepseek-r1-distill-llama-70b",
        messages=[{"role": "user", "content": prompt}]
    )

    response = completion.choices[0].message.content
    # Extract just the JSON part if there's explanatory text
    try:
        import re
        json_match = re.search(r'\[.*\]', response, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            leads = json.loads(json_str)
            return leads
        else:
            # Try parsing the entire response as JSON
            return json.loads(response)
    except json.JSONDecodeError:
        # If JSON parsing fails, return the raw response
        print("Failed to parse JSON from response")
        return {"error": "Failed to parse leads data", "raw_response": response}

@app.get("/")
async def root():
    return {"message": "LeadGen API is running"}

@app.get("/api/search")
async def search(query: str):
    if not query or query.strip() == "":
        raise HTTPException(status_code=400, detail="Search query cannot be empty")
    
    try:
        # Check if API keys are available
        if not tavily_api_key or not model_api_key:
            raise ValueError("API keys are missing. Make sure both TAVILY_API_KEY and GROQ_API_KEY are set in your .env file.")
        
        # Log the search query
        print(f"Processing search query: {query}")
        
        # Get raw content from Tavily
        retrieved_content = Scrap_News(query)
        
        # Extract and structure data using Groq
        results = ExtractContent(retrieved_content)
        
        if isinstance(results, list):
            # Add IDs to the results if they don't have them
            for i, lead in enumerate(results):
                if "id" not in lead:
                    lead["id"] = str(i + 1)
            
            return {
                "success": True,
                "query": query,
                "timestamp": "2025-05-09T00:00:00Z",
                "results": results
            }
        else:
            # If we got an error or non-list response
            raise HTTPException(status_code=500, detail=f"Failed to extract leads: {results}")
            
    except Exception as e:
        print(f"Error processing search query: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing search query: {str(e)}")

# For development:
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
