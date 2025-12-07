🎤 VoiceLock – AI-Powered Voice Authentication System
Secure Login Using Your Unique Voice Signature

VoiceLock is a FastAPI-based speaker verification system that uses SpeechBrain’s ECAPA-TDNN neural model to create voiceprints and authenticate users with high accuracy.
Users can register with an audio sample and later verify using a new recording.

This project includes:

🔊 Voice embedding extraction using SpeechBrain

🧠 Neural similarity scoring (cosine similarity)

🔐 User registration + verification pipeline

🎨 A modern frontend UI (React/Vite)

⚡ FastAPI backend

💾 Persistent voiceprint storage

📂 Project Structure
VoiceLock/
│
├── backend/
│   ├── main.py
│   ├── auth_logic.py
│   ├── models/
│   ├── utils/
│   │   ├── audio_utils.py
│   │   ├── feature_utils.py
│   │   └── __init__.py
│   ├── temp_audio/
│   └── pretrained_model/   (ignored from Git)
│
├── frontend/
│   ├── index.html
│   ├── src/
│   ├── vite.config.js
│
└── README.md

🚀 Features

🎙 Real-time speaker embedding extraction

🔒 Strong voice verification using cosine similarity

📁 Local persistent storage (voiceprints.npy)

🌐 Documented REST API at /docs

🖥 Modern UI for recording + authentication

⚙️ Installation (Mac & Windows)
✅ 1. Clone the Repository
Mac / Windows:
git clone https://github.com/Nishant-codess/VoiceLock.git
cd VoiceLock

🐍 Backend Setup (FastAPI + SpeechBrain)
📌 Requirements

Python 3.9 – 3.11

FFmpeg (for audio processing)

🍏 macOS Setup
1. Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

2. Install FFmpeg
brew install ffmpeg

3. Create virtual environment
python3 -m venv venv
source venv/bin/activate

4. Install dependencies
pip install -r backend/requirements.txt


(or manually install)

pip install fastapi uvicorn librosa numpy pydub soundfile speechbrain torch torchaudio python-multipart

5. Run the backend
uvicorn backend.main:app --reload


Backend available at:

👉 http://127.0.0.1:8000

API docs at:

👉 http://127.0.0.1:8000/docs

🪟 Windows Setup
1. Install Python (3.9–3.11)

Download from: https://www.python.org/downloads/

✔ Check “Add to PATH” during installation.

2. Install FFmpeg

Option A (scoop):

scoop install ffmpeg


Option B (manual):
Download from https://ffmpeg.org/download.html
 and add to PATH.

3. Create Virtual Environment
python -m venv venv
venv\Scripts\activate

4. Install Dependencies
pip install -r backend/requirements.txt


Or manually:

pip install fastapi uvicorn librosa numpy pydub soundfile speechbrain torch torchaudio python-multipart

5. Launch Backend
uvicorn backend.main:app --reload

🖥 Frontend Setup (Vite + React)

From root folder:

cd frontend
npm install
npm run dev


Frontend will open at:

👉 http://localhost:5173

🔗 Connecting Frontend ↔ Backend

In frontend/src/config.js:

export const API_BASE = "http://127.0.0.1:8000";

📡 API Endpoints
POST /register

Register a new user with an audio file.

Body:

username: string

file: audio (.wav/.webm)

POST /verify

Verify voice authenticity.

Body:

username: string

file: audio

Response:

{
  "match": true,
  "similarity": 0.61
}

📁 VoicePrint Storage

A file voiceprints.npy is automatically created:

{
  "nishant": [embedding array],
  "abc": [...]
}

🎧 Recommended Audio Format

WAV PCM 16-bit

1–2 seconds recording

Clear, noise-free environment

🛡 Security Notes

No cloud services → completely offline

Embeddings are numeric arrays, not raw audio

Replaceable threshold → set your accuracy balance in auth_logic.py:

THRESHOLD = 0.45

🧪 Running Tests
uvicorn backend.main:app --reload
npm run dev


Then test via:

👉 http://127.0.0.1:8000/docs

📜 License

MIT License.

❤️  Acknowledgements

SpeechBrain ECAPA-TDNN Speaker Recognition Model

FastAPI

React + Vite
