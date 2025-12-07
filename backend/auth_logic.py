import os
import numpy as np

from backend.utils.audio_utils import load_audio   # still used for duration check
from backend.utils.feature_utils import extract_embedding, cosine_similarity

VOICEPRINTS_FILE = "backend/models/user_voiceprints.npy"


# -----------------------------------------------------
# Load existing voiceprints
# -----------------------------------------------------
def load_voiceprints():
    """
    Loads the dictionary {username: embedding} from .npy file.
    """
    if os.path.exists(VOICEPRINTS_FILE):
        return np.load(VOICEPRINTS_FILE, allow_pickle=True).item()
    return {}


# -----------------------------------------------------
# Save voiceprints back to file
# -----------------------------------------------------
def save_voiceprints(data):
    np.save(VOICEPRINTS_FILE, data, allow_pickle=True)


# -----------------------------------------------------
# Register a new user
# -----------------------------------------------------
def register_user(username, file_path):
    """
    Extract speaker embedding for this user and store it.
    """

    # Load audio with librosa to validate that the file is readable
    audio_data, sr = load_audio(file_path)

    if len(audio_data) < sr * 0.5:
        raise ValueError("Audio too short. Speak at least 0.5 sec.")

    # Extract SpeechBrain embedding
    embedding = extract_embedding(file_path)

    # Load database
    db = load_voiceprints()

    # Store embedding
    db[username] = embedding

    # Save database
    save_voiceprints(db)


# -----------------------------------------------------
# Verify user voice sample
# -----------------------------------------------------
def verify_user(username, file_path):
    """
    Compare uploaded voice sample against stored embedding.
    Returns (match: bool, similarity: float)
    """

    # Load database
    db = load_voiceprints()

    if username not in db:
        raise ValueError("User not found.")

    saved_emb = db[username]

    # Extract embedding of input sample
    test_emb = extract_embedding(file_path)

    # Compute similarity using SpeechBrain logic
    sim = cosine_similarity(test_emb, saved_emb)

    # Recommended ECAPA-TDNN threshold:
    # > 0.65 = same speaker
    match = sim > 0.45

    return bool(match), float(sim)
