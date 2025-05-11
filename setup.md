# Lead Genius Suite

**Lead Genius Suite** is a modular platform for automating lead discovery and collection.
The project includes a frontend interface hosted on Vercel and a backend API that handles the business logic and data processing.

## Live Demo

- **Frontend (UI)**: [Lead Genius Suite](https://lead-genius-suite.vercel.app/)
- **Backend (API)**: [Lead Genius Suite Backend](https://vercel-test-phi-three.vercel.app/)

---

## Features

- **Lead Search**: Allows users to search for business leads based on specific queries.
- **News Scraping**: Retrieves the latest news on topics and extracts relevant leads using AI.
- **Lead Extraction**: AI-based extraction of business contact information from web content.
- **Modular Architecture**: Easily extendable with new lead generation modules and scraping utilities.

---

## Tech Stack

- **Frontend**:  
  - Built using React and Next.js
  - Hosted on Vercel
  - 
- **Backend**:  
  - Built using FastAPI with Python.
  - API calls to external services (e.g., Tavily API for news scraping, Groq API for lead extraction).
  - Hosted on [Vercel](https://vercel.com/).

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

    ```bash
   git clone https://github.com/qudratullah0708/vercel_test.git
    uv init .                 (using uv packange manager but pip or any other can also be used)
    uv venv 
    source .venv/Scripts/activate
    uv add - r requriements.txt
    uvicorn lead_api:app --reload
    

