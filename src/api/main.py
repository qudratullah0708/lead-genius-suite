
from fastapi import FastAPI, Request, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import smtplib
from email.message import EmailMessage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import stripe
import http.client
import json
import logging
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI()

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Stripe with API key
stripe_key = os.getenv("STRIPE_SECRET_KEY")
if stripe_key:
    stripe.api_key = stripe_key
    
# Get Serper API key for Google Maps searches
serper_api_key = os.getenv("SERPER_API_KEY")

@app.post("/send-email")
async def send_email(data: dict = Body(...)):
    logger.info(f"Received email request: {data.get('to', 'unknown recipient')}")
    
    try:
        msg = MIMEMultipart()
        msg['Subject'] = data.get('subject', 'Your Data Report')
        msg['From'] = 'qudratullah0708@gmail.com'
        msg['To'] = data.get('to', data.get('recipient_email', 'user@example.com'))
        
        # Add HTML content
        html_content = data.get('template', data.get('message', 'Here is your data report.'))
        msg.attach(MIMEText(html_content, 'html'))
        
        # Add CSV attachment if provided
        if 'csvData' in data or 'csvContent' in data:
            csv_data = data.get('csvData', data.get('csvContent', ''))
            attachment = MIMEApplication(csv_data.encode('utf-8'))
            attachment['Content-Disposition'] = f'attachment; filename="leads_report.csv"'
            msg.attach(attachment)

        email_password = os.environ.get('EMAIL_APP_PASSWORD')
        if not email_password:
            logger.error("EMAIL_APP_PASSWORD environment variable is not set")
            raise HTTPException(status_code=500, detail="Email password not configured")

        logger.info(f"Attempting to send email to {msg['To']}")
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login('qudratullah0708@gmail.com', email_password)
            smtp.send_message(msg)
            
        logger.info(f"Email sent successfully to {msg['To']}")
        return {"message": "Email sent successfully"}
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

@app.post("/create-checkout-session")
async def create_checkout_session(data: dict = Body(...)):
    try:
        # Configure Stripe API key
        if not stripe.api_key:
            raise HTTPException(status_code=500, detail="Stripe API key not configured")
            
        price_id = data.get('priceId')
        tier_name = data.get('tierName')
        is_trial = data.get('isTrial', False)
        
        checkout_params = {
            'payment_method_types': ['card'],
            'line_items': [{
                'price': price_id,
                'quantity': 1,
            }],
            'mode': 'subscription' if not is_trial else 'payment',
            'success_url': data.get('successUrl', 'http://localhost:3000/dashboard?checkout=success'),
            'cancel_url': data.get('cancelUrl', 'http://localhost:3000/pricing?checkout=cancelled'),
            'metadata': {
                'tier': tier_name
            }
        }
        
        # Add trial_period_days for the starter tier only if it's marked as trial
        if is_trial:
            checkout_params['subscription_data'] = {
                'trial_period_days': 14
            }
        
        session = stripe.checkout.Session.create(**checkout_params)
        return {"id": session.id, "url": session.url}
    except Exception as e:
        logger.error(f"Failed to create checkout session: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search-places/")
async def search_places(data: dict = Body(...)):
    if not serper_api_key:
        logger.error("SERPER_API_KEY environment variable is not set")
        raise HTTPException(status_code=500, detail="Serper API key not configured")
    
    query = data.get("query", "")
    location = data.get("location", "")
    tbs = data.get("tbs", "qdr:y")  # Default to past year
    
    if not query or not location:
        raise HTTPException(status_code=400, detail="Query and location are required")
    
    query_combined = f"{query} {location}"
    logger.info(f"Searching places with query: {query_combined}, timeframe: {tbs}")

    payload = json.dumps({
        "q": query_combined,
        "tbs": tbs
    })

    headers = {
        'X-API-KEY': serper_api_key,
        'Content-Type': 'application/json'
    }

    try:
        conn = http.client.HTTPSConnection("google.serper.dev")
        conn.request("POST", "/maps", payload, headers)
        res = conn.getresponse()
        data = res.read()
        conn.close()
        
        result = json.loads(data)
        logger.info(f"Successfully retrieved {len(result.get('places', []))} places")
        return result
    except Exception as e:
        logger.error(f"Failed to search places: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Request failed: {str(e)}")

def main():
    logger.info("FastAPI server is running")

if __name__ == "__main__":
    main()
