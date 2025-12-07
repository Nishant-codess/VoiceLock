import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.abspath(os.getcwd()))
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from backend.utils.audio_utils import save_uploaded_audio
from backend.auth_logic import register_user, verify_user

# Create FastAPI app
app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # You can later restrict to your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory to store temporary uploaded audio files
TEMP_DIR = "backend/temp_audio"
os.makedirs(TEMP_DIR, exist_ok=True)

@app.get("/")
def home():
    return {"message": "VoiceLock2 Backend Running!"}


# ---------------------------------------------------------
# REGISTER USER ENDPOINT
# ---------------------------------------------------------

@app.post("/register")
async def register(
    username: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Registers a new user by storing their voiceprint.
    """

    temp_path = f"{TEMP_DIR}/{username}_register.wav"

    # Save uploaded audio
    save_uploaded_audio(file, temp_path)

    # Create user voiceprint
    register_user(username, temp_path)

    return {"status": "success", "message": f"User {username} registered."}


# ---------------------------------------------------------
# VERIFY USER ENDPOINT
# ---------------------------------------------------------

@app.post("/verify")
async def verify(
    username: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Verifies a user's voice.
    """

    temp_path = f"{TEMP_DIR}/{username}_verify.wav"

    # Save new audio sample
    save_uploaded_audio(file, temp_path)

    # Compare with stored voiceprint
    match, similarity = verify_user(username, temp_path)

    return {
    "match": bool(match),
    "similarity": float(similarity)
    }

