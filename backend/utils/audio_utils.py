import librosa
import io
import numpy as np
import soundfile as sf
from pydub import AudioSegment

# -----------------------------------------
# Load and prepare audio for feature extraction
# -----------------------------------------

def load_audio(file_path, target_sr=16000):
    """
    Load audio file, convert to mono, resample to 16kHz.
    Returns numpy array audio_data and sampling_rate.
    """
    audio_data, sr = librosa.load(file_path, sr=target_sr, mono=True)
    return audio_data, sr


# -----------------------------------------
# Save uploaded audio bytes as WAV file
# -----------------------------------------

def save_uploaded_audio(uploaded_file, save_path):
    """
    Save uploaded audio file (bytes) into WAV format.
    Ensures proper format by using pydub for conversion.
    """
    audio_bytes = uploaded_file.file.read()
    audio = AudioSegment.from_file(
        io.BytesIO(audio_bytes),
        format=uploaded_file.filename.split(".")[-1]
    )
    audio = audio.set_frame_rate(16000).set_channels(1)
    audio.export(save_path, format="wav")
