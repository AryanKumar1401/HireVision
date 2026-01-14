"""Audio analysis service for enthusiasm detection."""
import subprocess
import librosa
import numpy as np


def detect_enthusiasm(
    audio_file: str,
    sr: int = 22050,
    energy_threshold: float = 0.6
) -> list:
    """
    Given an audio file, return a list of timestamps (in seconds) where the energy peaks.
    This is a simplistic approach; you can adapt it to use pitch or a pretrained model.
    
    Args:
        audio_file: Path to the audio file
        sr: Sample rate for audio loading
        energy_threshold: Threshold for detecting high energy (0-1)
        
    Returns:
        List of timestamps where enthusiasm was detected
    """
    # Load the audio file
    y, sr = librosa.load(audio_file, sr=sr)

    # Compute RMS energy for short frames
    hop_length = 512
    frame_length = 1024
    rms = librosa.feature.rms(y=y, frame_length=frame_length, hop_length=hop_length)[0]

    # Normalize energy to 0-1 range
    rms_norm = (rms - np.min(rms)) / (np.max(rms) - np.min(rms) + 1e-6)

    # Identify frames where normalized energy exceeds the threshold
    enthusiastic_frames = np.where(rms_norm > energy_threshold)[0]

    # Convert frame indices to timestamps
    timestamps = librosa.frames_to_time(enthusiastic_frames, sr=sr, hop_length=hop_length)
    
    # Filter out timestamps that are close together
    filtered_timestamps = []
    prev = -999
    for t in timestamps:
        if t - prev > 1.0:  # at least 1 second apart
            filtered_timestamps.append(round(t, 2))
            prev = t
    return filtered_timestamps


def extract_audio_from_video(video_url: str, output_audio: str) -> None:
    """
    Extract audio from a video URL and save it to output_audio.
    
    Args:
        video_url: URL or path of the video
        output_audio: Path to save the extracted audio
        
    Note: Uses ffmpeg subprocess - ensure video_url is validated before calling
    """
    # Use list format to avoid shell injection
    command = ["ffmpeg", "-y", "-i", video_url, "-q:a", "0", "-map", "a", output_audio]
    subprocess.run(command, check=True)

