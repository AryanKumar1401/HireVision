"use client";
import { useEffect, useState } from "react";

interface DeviceSelectorProps {
  onVideoDeviceChange: (deviceId: string) => void;
  onAudioDeviceChange: (deviceId: string) => void;
  selectedVideoDeviceId?: string;
  selectedAudioDeviceId?: string;
}

export const DeviceSelector = ({
  onVideoDeviceChange,
  onAudioDeviceChange,
  selectedVideoDeviceId,
  selectedAudioDeviceId,
}: DeviceSelectorProps) => {
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        // Request permission to access media devices
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        // Get all media devices
        const devices = await navigator.mediaDevices.enumerateDevices();

        const videoInputs = devices.filter(
          (device) => device.kind === "videoinput"
        );
        const audioInputs = devices.filter(
          (device) => device.kind === "audioinput"
        );

        setVideoDevices(videoInputs);
        setAudioDevices(audioInputs);
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    loadDevices();

    // Listen for device changes
    navigator.mediaDevices.addEventListener("devicechange", loadDevices);

    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", loadDevices);
    };
  }, []);

  return (
    <div className="mt-4 space-y-4">
      <div>
        <label htmlFor="camera-select" className="text-white/90 mb-2 block">
          Camera
        </label>
        <select
          id="camera-select"
          value={selectedVideoDeviceId || ""}
          onChange={(e) => onVideoDeviceChange(e.target.value)}
          className="w-full bg-gray-800 text-white/90 py-2 px-3 rounded-md border border-gray-700 focus:border-blue-500 focus:outline-none"
        >
          {videoDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${videoDevices.indexOf(device) + 1}`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="mic-select" className="text-white/90 mb-2 block">
          Microphone
        </label>
        <select
          id="mic-select"
          value={selectedAudioDeviceId || ""}
          onChange={(e) => onAudioDeviceChange(e.target.value)}
          className="w-full bg-gray-800 text-white/90 py-2 px-3 rounded-md border border-gray-700 focus:border-blue-500 focus:outline-none"
        >
          {audioDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Microphone ${audioDevices.indexOf(device) + 1}`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
