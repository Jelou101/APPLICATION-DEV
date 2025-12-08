import { useState, useEffect, useCallback } from 'react';
import { pointsManager } from '../utils/pointsManager';

export function usePoints() {
  // Get initial points from localStorage immediately
  const getInitialPoints = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return {
      total_points: user.total_points || 1000,
      riddle_points: user.riddle_points || 0,
      logic_points: user.logic_points || 0,
      endurance_points: user.endurance_points || 0
    };
  };

  const [points, setPoints] = useState(getInitialPoints());
  const [loading, setLoading] = useState(false);

  // Function to update points from localStorage
  const updateFromLocalStorage = useCallback(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const newPoints = {
      total_points: user.total_points || 1000,
      riddle_points: user.riddle_points || 0,
      logic_points: user.logic_points || 0,
      endurance_points: user.endurance_points || 0
    };
    setPoints(newPoints);
    return newPoints;
  }, []);

  useEffect(() => {
    // Update from localStorage immediately
    updateFromLocalStorage();

    // Subscribe to pointsManager updates
    const unsubscribe = pointsManager.subscribe((newPointsData) => {
      console.log('📢 usePoints: Received update from pointsManager', newPointsData);
      setPoints(newPointsData);
      setLoading(false);
    });

    // Listen for localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        console.log('📢 usePoints: localStorage user changed');
        updateFromLocalStorage();
      }
    };

    // Add event listener
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [updateFromLocalStorage]);

  // KEEP THESE METHODS - THEY ARE CORRECT!
  const addGamePoints = async (gameMode, pointsToAdd) => {
    try {
      setLoading(true);
      const newTotal = await pointsManager.addGamePoints(gameMode, pointsToAdd);
      return newTotal;
    } catch (error) {
      console.error('Failed to add points:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deductPoints = async (pointsToDeduct) => {
    try {
      setLoading(true);
      const newTotal = await pointsManager.deductPoints(pointsToDeduct);
      return newTotal;
    } catch (error) {
      console.error('Failed to deduct points:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { 
    points, 
    loading, 
    addGamePoints,
    deductPoints,
    refreshPoints: updateFromLocalStorage
  };
}