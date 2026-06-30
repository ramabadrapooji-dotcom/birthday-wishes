import { EffectComposer, Bloom, Vignette, DepthOfField, Noise } from '@react-three/postprocessing';
import { QualityLevel, useAppStore } from '../../store/useAppStore';
import { BlendFunction } from 'postprocessing';

export default function PostProcessingSystem({ quality }: { quality: QualityLevel }) {
  const { appState } = useAppStore();
  
  const isHighQuality = quality === 'HIGH';
  const isFocus = appState === 'MEMORY_FOCUS';
  const isFinale = appState === 'FINAL_BANG';
  const isHyperspace = appState === 'WARP';

  return (
    <EffectComposer multisampling={0}>
      <Bloom 
        intensity={isFinale ? 3.0 : isHyperspace ? 2.5 : 1.5} 
        luminanceThreshold={isHyperspace ? 0.1 : 0.2} 
        luminanceSmoothing={0.9} 
        // Removed mipmapBlur as it causes NaN cyan-screen crashes on many mobile GPUs
      />
      
      {isHighQuality && (
        <Noise opacity={0.02} blendFunction={BlendFunction.OVERLAY} />
      )}
      
      {isFocus && (
        <DepthOfField 
          focusDistance={0.01} 
          focalLength={0.02} 
          bokehScale={isHighQuality ? 5 : 2} 
        />
      )}
      
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
}
