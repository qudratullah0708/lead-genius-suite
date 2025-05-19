
# Lead Genius Suite

**Lead Genius Suite** is a modular platform for automating lead discovery and collection.
The project includes a frontend interface hosted on Vercel and a backend API that handles the business logic and data processing.

## Live Demo

- **Frontend (UI)**:

  [Lead Genius Suite](https://lead-genius-suite.vercel.app/)
  
- **Backend
  Lead-Search-endpoint**: [Lead Genius Suite Backend](https://vercel-test-phi-three.vercel.app/)
 **Email-Service-endpoint**: [Lead Genius Suite Backend](https://email-service-bice.vercel.app/)
 **Google-maps-places-endpoint**: [Lead Genius Suite Backend](https://google-maps-api-hazel.vercel.app/)

---

## Features

- **Lead Search**: Allows users to search for business leads based on specific queries.
- **News Scraping**: Retrieves the latest news on topics and extracts relevant leads using AI.
-  **Google Maps Search**: Allows users to search for business leads using google's Map places api.
- **Lead Extraction**: AI-based extraction of business contact information from web content.
- **Email Delivery**: Deliver the results to the Email address using SMTP.
- **Export Results**: Download the leads generated csv to the local machine.
- **Modular Architecture**: Easily extendable with new lead generation modules and scraping utilities.

---

## Tech Stack

- **Frontend**:  
  - Built using React and Next.js
  - Hosted on Vercel
  - 
- **Backend**:  
  - Built using FastAPI with Python.
  - API calls to external services (e.g., Tavily API for news scraping, Groq API for lead extraction,
  - email-service python smtp for email delivery, google maps places api for extracting bussiness leads locations).
  - Authentication and Database : Supabase
  - Host Platform: Vercel

---

## Setup Instructions

### 1. Frontend (UI)

To run the frontend locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/qudratullah0708/lead-genius-suite.git
   npm install
   npm run dev

### 2. Backend 

To run the Backend locally:
1. Clone the Repo
2. TAVILY_API_KEY='your_tavily_api_key'
   GROQ_API_KEY='your_groq_api_key'
   SERPER_API_KEY='API-KEY'
   EMAIL_APP_PASSWORD=''
   

    ```bash
    Search Bar:
   git clone https://github.com/qudratullah0708/vercel_test.git
    uv init .                 (using uv packange manager but pip or any other can also be used)
    uv venv 
    source .venv/Scripts/activate
    uv add - r requriements.txt
    uvicorn lead_api:app --reload

    Google-maps
    git clone https://github.com/qudratullah0708/google-maps-api.git
   uv init .                 (using uv packange manager but pip or any other can also be used)
    uv venv 
    source .venv/Scripts/activate
    uv add - r requriements.txt
    uvicorn main:app --reload

    Email service
    git clone https://github.com/qudratullah0708/email-service.git
   uv init .                 (using uv packange manager but pip or any other can also be used)
    uv venv 
    source .venv/Scripts/activate
    uv add - r requriements.txt
    uvicorn main:app --reload

```
    


