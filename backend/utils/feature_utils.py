import torch
import torchaudio
import numpy as np
from speechbrain.inference import SpeakerRecognition

# Load model once at startup (NEW API - SpeechBrain 1.0+)
spkrec = SpeakerRecognition.from_hparams(
    source="speechbrain/spkrec-ecapa-voxceleb",
    savedir="backend/pretrained_model",
    run_opts={"device": "cpu"}
)

# -----------------------------------------------------
# Convert WAV file → PyTorch tensor
# -----------------------------------------------------
def load_audio_for_model(path):
    waveform, sr = torchaudio.load(path)

    # Model expects 16k sample rate
    if sr != 16000:
        resampler = torchaudio.transforms.Resample(orig_freq=sr, new_freq=16000)
        waveform = resampler(waveform)

    return waveform


# -----------------------------------------------------
# Extract speaker embedding
# -----------------------------------------------------
def extract_embedding(path):
    waveform = load_audio_for_model(path)

    # Extract speaker embedding (192-dim vector)
    with torch.no_grad():
        emb = spkrec.encode_batch(waveform).squeeze().cpu().numpy()

    return emb


# -----------------------------------------------------
# Cosine similarity using SpeechBrain utilities
# -----------------------------------------------------
def cosine_similarity(emb1, emb2):
    """
    Compute cosine similarity manually for SpeechBrain 1.0+ embeddings.
    """
    emb1 = torch.tensor(emb1, dtype=torch.float32)
    emb2 = torch.tensor(emb2, dtype=torch.float32)

    dot = torch.dot(emb1, emb2)
    norm = torch.norm(emb1) * torch.norm(emb2)

    if norm == 0:
        return 0.0

    return float(dot / norm)

