from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.main import api_router
import os
from dotenv import load_dotenv
import vertexai

# FastAPI app
app = FastAPI()

load_dotenv()

os.environ["LANGSMITH_API_KEY"] = os.getenv("LANGSMITH_API_KEY")
os.environ["LANGSMITH_TRACING"] = os.getenv("LANGSMITH_TRACING")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "serviceAccountKey.json"

vertexai.init(project="tsmccareerhack2025-tsid-grp1", location="us-central1")

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)