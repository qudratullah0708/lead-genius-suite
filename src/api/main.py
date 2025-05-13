
from fastapi import FastAPI, Request, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import smtplib
from email.message import EmailMessage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import stripe
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Stripe with API key
stripe.api_key = os.getenv("GROQ_API_KEY")  # Using secret from .env

@app.post("/send-email")
async def send_email(data: dict = Body(...)):
    msg = MIMEMultipart()
    msg['Subject'] = data.get('subject', 'Your Data Report')
    msg['From'] = 'qudratullah0708@gmail.com'
    msg['To'] = data.get('to', 'user@example.com')
    
    # Add HTML content
    html_content = data.get('template', 'Here is your data report.')
    msg.attach(MIMEText(html_content, 'html'))
    
    # Add CSV attachment if provided
    if 'csvData' in data:
        attachment = MIMEApplication(data['csvData'].encode('utf-8'))
        attachment['Content-Disposition'] = f'attachment; filename="leads_report.csv"'
        msg.attach(attachment)

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login('qudratullah0708@gmail.com', os.environ.get('EMAIL_APP_PASSWORD'))
            smtp.send_message(msg)
        return {"message": "Email sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

@app.post("/create-checkout-session")
async def create_checkout_session(data: dict = Body(...)):
    try:
        # Configure Stripe API key
        stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
        
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
        raise HTTPException(status_code=500, detail=str(e))

def main():
    print("FastAPI server is running")

if __name__ == "__main__":
    main()
