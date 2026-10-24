import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Exercise } from '../types';
import { getExerciseById } from '../utils/exercises';
import { usePlanSession } from '../hooks/usePlanSession';

const GuidedSessionPage = () => {
  const { planSessionId } = useParams();
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [durationLabel, setDurationLabel] = useState('00:00');
  const [showControls, setShowControls] = useState(false);

  // Load exercise data from plan session
  useEffect(() => {
    if (planSessionId) {
      const loadSession = async () => {
        const session = await usePlanSession(planSessionId);
        if (session && session.exercises.length > 0) {
          setCurrentExercise(session.exercises[0]);
          startTimer(session.exercises[0].duration);
        }
      };
      loadSession();
    }
  }, [planSessionId]);

  // Start timer based on exercise duration
  const startTimer = useCallback((duration: string) => {
    let totalSeconds = 0;
    switch (duration) {
      case 'corta': totalSeconds = 30; break;
      case 'media': totalSeconds = 60; break;
      case 'larga': totalSeconds = 120; break;
      default: totalSeconds = 30;
    }

    setTimer(totalSeconds);
    setIsRunning(true);
    setDurationLabel(formatTime(totalSeconds));
    setShowControls(true);

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  // Pause timer
  const pauseTimer = () => {
    setIsRunning(false);
    setShowControls(false);
  };

  // Resume timer
  const resumeTimer = () => {
    setIsRunning(true);
    setShowControls(false);

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIs
