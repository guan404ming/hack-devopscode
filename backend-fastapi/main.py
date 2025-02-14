from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.main import api_router
import os
from dotenv import load_dotenv
from google.cloud import aiplatform

# FastAPI app
app = FastAPI()

load_dotenv()

os.environ["LANGSMITH_API_KEY"] = os.getenv("LANGSMITH_API_KEY")
os.environ["LANGSMITH_TRACING"] = os.getenv("LANGSMITH_TRACING")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "serviceAccountKey.json"
aiplatform.init(project=os.getenv("PROJECT_ID"), location=os.getenv("LOCATION"))

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
