from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import Optional, List, Dict, Any, Union
import json
import smtplib
from email.message import EmailMessage

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
email_password = os.getenv("EMAIL_APP_PASSWORD")  # Add this to your .env file

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
You are an expert lead generation AI that extracts business contact information from web content. Your task is to extract relevant leads from the provided content based on the search query: "{query}".

**Input Content:**
{content}

**Instructions:**

1. **Extract Leads**: Identify individuals in marketing, sales, or leadership roles at companies. Only focus on individuals who are directly relevant to the specified domains.
   
2. **Required Fields**: Each lead should contain the following fields:
   - `name`: Full name of the individual (first and last name).
   - `title`: The individual's title (e.g., CEO, Marketing Manager).
   - `company`: The company or organization the individual is associated with.
   - `email`: Provide an email if available. If not, you may attempt to infer a professional email (using a standard format like `firstname.lastname@company.com`) only when the company is known and the individual's name is available. **Do not invent email addresses if not available**.
   - `phone`: Include phone number if available. If not, leave it empty.
   - `source`: The source where this lead was found (e.g., LinkedIn, company website).
   - `location`: Provide the location if available. If not, leave it empty.

3. **Inclusion Criteria**: Only include leads with **at least two of ** the following:
   - Name
   - Title
   - Company
   Any lead with having two these these key pieces of information should be included.

4. **Quality over Quantity**: Focus on providing accurate, valid leads rather than filling the list with numerous, low-quality leads. Aim to provide **at least 5 quality leads** if possible.

5. **Avoid Hallucination**: Do not generate any information that is not explicitly found or reasonably inferable from the content. **Do not fabricate or guess any details about the leads**. If any information is missing, leave the field empty.

6. **Output Format**: Return the results in the following format:

Example output format:


[
  {{
    "name": "John Smith",
    "title": "Chief Marketing Officer",
    "company": "AI Solutions Inc",
    "email": "john.smith@aisolutions.com",
    "phone": "",
    "source": "LinkedIn",
    "location": "San Francisco, USA"  // Leave empty if unavailable
  }},
  // more leads...
]
```


Ensure the output is a valid JSON array of lead objects.

"""

    print("\n\n********Extracting Leads From Content******...")
    
    completion = groq_client.chat.completions.create(
        model="deepseek-r1-distill-llama-70b",
        messages=[{"role": "user", "content": prompt}]
    )

    response = completion.choices[0].message.content
    
    try:
        # Extract just the JSON part if there's explanatory text
        import re
        json_match = re.search(r'\[[\s\S]*\]', response, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            leads = json.loads(json_str)
        else:
            # Try parsing the entire response as JSON
            leads = json.loads(response)
            
        # Ensure we have at least some leads
        if not leads or len(leads) < 1:
            raise ValueError("No leads extracted from content")
            
        return leads
    except json.JSONDecodeError:
        print("Failed to parse JSON from response")
        print(f"Raw response: {response}")
        # Fall back to generating dummy data if JSON parsing fails
        return generate_fallback_leads(query, 5)
    except Exception as e:
        print(f"Error extracting leads: {str(e)}")
        print(f"Raw response: {response}")
 

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
        
        # Get raw content from Tavily
        retrieved_content = Scrap_News(query)
        
        # Extract and structure data using Groq
        results = ExtractContent(retrieved_content, query)

        print (f"results:{results}")
        
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

@app.post("/send-email")
async def send_email(data: Dict[str, Any] = Body(...)):
    try:
        recipient_email = data.get("recipient_email")
        subject = data.get("subject")
        message = data.get("message")
        user_email = data.get("user_email")
        leads = data.get("leads", [])
        query = data.get("query", "")
        attach_csv = data.get("attachCsv", False)
        csv_content = data.get("csvContent", "")
        
        if not recipient_email or not subject:
            raise HTTPException(status_code=400, detail="Recipient email and subject are required")
        
        if not email_password:
            raise HTTPException(status_code=500, detail="Email password not configured")
        
        # Create the email
        email = EmailMessage()
        email["Subject"] = subject
        email["From"] = "qudratullah0708@gmail.com"  # Updated sender email
        email["To"] = recipient_email
        
        # Create HTML content
        html_content = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                .header {{ background-color: #f8f9fa; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; }}
                table {{ border-collapse: collapse; width: 100%; }}
                th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                th {{ background-color: #f2f2f2; }}
                tr:nth-child(even) {{ background-color: #f9f9f9; }}
                .footer {{ margin-top: 20px; font-size: 0.9em; color: #666; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h2>LeadGen Report</h2>
                <p>Search query: "{query}"</p>
            </div>
            <div class="content">
                <p>{message}</p>
                
                <h3>Leads ({len(leads)})</h3>
        """
        
        # Add table of leads if we have any
        if leads:
            html_content += """
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Title</th>
                        <th>Company</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Location</th>
                        <th>Source</th>
                    </tr>
            """
            
            for lead in leads:
                html_content += f"""
                    <tr>
                        <td>{lead.get('name', '')}</td>
                        <td>{lead.get('title', '')}</td>
                        <td>{lead.get('company', '')}</td>
                        <td>{lead.get('email', '')}</td>
                        <td>{lead.get('phone', '')}</td>
                        <td>{lead.get('location', '')}</td>
                        <td>{lead.get('source', '')}</td>
                    </tr>
                """
            
            html_content += "</table>"
        else:
            html_content += "<p>No leads to display.</p>"
        
        # Close the HTML
        html_content += """
                <div class="footer">
                    <p>This report was generated by LeadGen Agent. For any questions, please contact support.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Set the email content
        email.set_content(message)
        email.add_alternative(html_content, subtype="html")
        
        # Attach CSV if requested
        if attach_csv and csv_content:
            csv_attachment = csv_content.encode()
            email.add_attachment(
                csv_attachment,
                maintype="text",
                subtype="csv",
                filename=f"leads_{query.replace(' ', '_')}_{len(leads)}_results.csv"
            )
        
        # Send the email
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login("qudratullah0708@gmail.com", email_password)  # Updated login email
            smtp.send_message(email)
        
        return {"message": "Email sent successfully"}
        
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error sending email: {str(e)}")

# For development:
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
