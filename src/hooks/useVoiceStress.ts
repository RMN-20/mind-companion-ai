import { useState, useRef } from "react";
import { computeVoiceStress } from "@/utils/voiceStress";

export function useVoiceStress() {
  const [voiceStress, setVoiceStress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      startTimeRef.current = Date.now();

      setDuration(0);
      setIsRecording(true);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.start();

      timerRef.current = window.setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    recorder.stop();
    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    recorder.onstop = () => {
      const durationSec = Math.max(
        (Date.now() - startTimeRef.current) / 1000,
        1
      );

      // 🔊 Energy proxy (based on total audio size)
      const totalSize = audioChunksRef.current.reduce(
        (sum, blob) => sum + blob.size,
        0
      );
      const energy = Math.min(totalSize / 400000, 1);

      // 🗣 Speaking rate proxy (chunks per second)
      const speakingRate = Math.min(
        (audioChunksRef.current.length / durationSec) * 60,
        180
      );

      const stress = computeVoiceStress(energy, speakingRate);

      // 🔥 THIS is the missing piece
      setVoiceStress(Number(stress.toFixed(2)));
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
