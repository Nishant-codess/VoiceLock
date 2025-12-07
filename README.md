# 🎤 VoiceLock – AI-Powered Voice Authentication System  

### Secure Login Using Your Unique Voice Signature



VoiceLock is a **FastAPI-based speaker verification system** that uses **SpeechBrain's ECAPA-TDNN neural model** to create voiceprints and authenticate users with high accuracy.  

Users can **register** with an audio sample and later **verify** using a new recording.



This project includes:



- 🔊 Voice embedding extraction using **SpeechBrain**

- 🧠 Neural similarity scoring (cosine similarity)

- 🔐 User registration + verification pipeline

- 🎨 A modern frontend UI (React/Vite)

- ⚡ FastAPI backend  

- 💾 Persistent voiceprint storage



---



## 📂 Project Structure



```

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

```



---



## 🚀 Features



- 🎙 Real-time speaker embedding extraction  

- 🔒 Strong voice verification using cosine similarity  

- 📁 Local persistent storage (`voiceprints.npy`)  

- 🌐 Documented REST API at `/docs`  

- 🖥 Modern UI for recording + authentication  



---



# ⚙️ Installation (Mac & Windows)



## ✅ 1. Clone the Repository



```bash

git clone https://github.com/Nishant-codess/VoiceLock.git

cd VoiceLock

```



---



# 🐍 Backend Setup (FastAPI + SpeechBrain)



## 📌 Requirements



* Python **3.9 – 3.11**

* FFmpeg (for audio processing)



---



# 🍏 macOS Setup



### **1. Install Homebrew (if not installed)**



```bash

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

```



### **2. Install FFmpeg**



```bash

brew install ffmpeg

```



### **3. Create virtual environment**



```bash

python3 -m venv venv

source venv/bin/activate

```



### **4. Install dependencies**



```bash

pip install -r backend/requirements.txt

```



Or manually:



```bash

pip install fastapi uvicorn librosa numpy pydub soundfile speechbrain torch torchaudio python-multipart

```



### **5. Run the backend**



```bash

uvicorn backend.main:app --reload

```



Backend available at:



👉 **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

API docs:



👉 **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**



---



# 🪟 Windows Setup



### **1. Install Python (3.9–3.11)**



Download from: [https://www.python.org/downloads/](https://www.python.org/downloads/)



✔ Check "Add to PATH" during installation.



---



### **2. Install FFmpeg**



**Option A (Recommended - Using winget - Windows 11/10):**



```powershell

winget install ffmpeg

```

If `winget` is not available, use Option B or C below.



---



**Option B (Using Scoop - requires Scoop first):**



**First, install Scoop (if not already installed):**



```powershell

# Run PowerShell as Administrator, then:
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```



**Then install FFmpeg:**



```powershell

scoop install ffmpeg

```



---



**Option C (Manual Installation - Easiest for beginners):**



1. **Download FFmpeg:**

   - Go to: [https://www.gyan.dev/ffmpeg/builds/](https://www.gyan.dev/ffmpeg/builds/)

   - Download the **ffmpeg-release-essentials.zip** file

   - Extract the zip file to a folder (e.g., `C:\ffmpeg`)

2. **Add to PATH:**

   - Press `Win + X` and select **"System"**

   - Click **"Advanced system settings"**

   - Click **"Environment Variables"**

   - Under **"System variables"**, find and select **"Path"**, then click **"Edit"**

   - Click **"New"** and add the path to the `bin` folder (e.g., `C:\ffmpeg\bin`)

   - Click **"OK"** on all windows

3. **Verify installation:**

   Open a **new** PowerShell window and run:

   ```powershell

   ffmpeg -version

   ```

   If you see version information, FFmpeg is installed correctly!



---



### **3. Create Virtual Environment**



```powershell

python -m venv venv

venv\Scripts\activate

```



### **4. Install Dependencies**



```powershell

pip install -r backend/requirements.txt

```



Or manually:



```powershell

pip install fastapi uvicorn librosa numpy pydub soundfile speechbrain torch torchaudio python-multipart

```



---



### **5. Launch Backend**



```powershell

uvicorn backend.main:app --reload

```



---



# 🖥 Frontend Setup (Vite + React)



From root folder:



```bash

cd frontend

npm install

npm run dev

```



Frontend will open at:



👉 **[http://localhost:5173](http://localhost:5173)**



---



## 🔗 Connecting Frontend ↔ Backend



In `frontend/src/config.js`:



```js

export const API_BASE = "http://127.0.0.1:8000";

```



---



# 📡 API Endpoints



### **POST /register**



Register a new user with an audio file.



**Body:**



* `username`: string

* `file`: audio (.wav/.webm)



---



### **POST /verify**



Verify voice authenticity.



**Body:**



* `username`: string

* `file`: audio file



**Response Example:**



```json

{

  "match": true,

  "similarity": 0.61

}

```



---



# 📁 VoicePrint Storage



`voiceprints.npy` is generated automatically:



```

{

  "nishant": [embedding array],

  "abc": [...],

}

```



---



# 🎧 Recommended Audio Format



* WAV PCM 16-bit

* 1–2 seconds of audio

* Clean and noise-free



---



# 🛡 Security Notes



* Fully **offline**—no cloud processing

* Embeddings are numeric vectors (safe)

* Threshold adjustable in `auth_logic.py`:



```python

THRESHOLD = 0.45

```



---



# 🧪 Running Tests



```

uvicorn backend.main:app --reload

npm run dev

```



Then visit:



👉 [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)



---



# 📜 License



MIT License.



---



# ❤️ Acknowledgements



* **SpeechBrain — ECAPA-TDNN model**

* **FastAPI**

* **React + Vite**



---
