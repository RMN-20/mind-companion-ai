import { useState, useRef } from "react";
import { computeVoiceStress } from "@/utils/voiceStress";

export function useVoiceStress() {
  const [voiceStress, setVoiceStress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const startTime = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder.current = new MediaRecorder(stream);
    audioChunks.current = [];
    startTime.current = Date.now();
    setDuration(0);
    setIsRecording(true);

    mediaRecorder.current.ondataavailable = (e) => {
      audioChunks.current.push(e.data);
    };

    mediaRecorder.current.start();

    // Timer for UI feedback
    timerRef.current = window.setInterval(() => {
      setDuration(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);
  };

  const stopRecording = () => {
    if (!mediaRecorder.current) return;

    mediaRecorder.current.stop();
    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    mediaRecorder.current.onstop = () => {
      const durationSec = Math.max(
        (Date.now() - startTime.current) / 1000,
        1
      );

      // Speaking rate proxy
      const speakingRate = Math.min(
        (audioChunks.current.length / durationSec) * 60,
        200
      );

      // Energy proxy (audio size)
      const totalSize = audioChunks.current.reduce((a, b) => a + b.size, 0);
      const energy = Math.min(totalSize / 500000, 1);

      const stress = computeVoiceStress(energy, speakingRate);
      setVoiceStress(stress);
    };
  };

  return {
    voiceStress,
    isRecording,
    duration,
    startRecording,
    stopRecording,
  };
}
