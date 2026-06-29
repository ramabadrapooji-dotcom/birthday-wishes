import { QualityLevel } from '../store/useAppStore';

export const detectDeviceQuality = (): QualityLevel => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) return 'LOW'; // Always use LOW for mobile to prevent context loss
  
  // A rough estimate of power using hardware concurrency and device pixel ratio
  const cores = navigator.hardwareConcurrency || 4;
  
  if (cores >= 8) return 'HIGH';
  if (cores >= 4) return 'MEDIUM';
  
  return 'LOW';
};

export const getQualitySettings = (quality: QualityLevel) => {
  switch (quality) {
    case 'HIGH':
      return {
        particleCount: 10000, // Reduced from 15k
        asteroidCount: 60, // Reduced
        meteorChance: 0.5,
        shadows: true,
        postProcessing: true,
        textureRes: 2048,
        pixelRatio: Math.min(window.devicePixelRatio, 1.5), // Cap at 1.5 instead of 2 to save GPU
      };
    case 'MEDIUM':
      return {
        particleCount: 4000,
        asteroidCount: 30,
        meteorChance: 0.3,
        shadows: false,
        postProcessing: true,
        textureRes: 1024,
        pixelRatio: 1, // Cap at 1
      };
    case 'LOW':
    default:
      return {
        particleCount: 1000,
        asteroidCount: 10,
        meteorChance: 0.2,
        shadows: false,
        postProcessing: false,
        textureRes: 512,
        pixelRatio: 1, // Cap at 1
      };
  }
};
