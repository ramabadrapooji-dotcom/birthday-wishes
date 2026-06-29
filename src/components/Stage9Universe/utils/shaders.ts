export const SHADER_CHUNKS = {
  noise2D: `
    // Simple pseudo-random for noise
    float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
  `,
  particleBaseVertex: `
    attribute float size;
    attribute float random;
    varying vec3 vColor;
    varying float vAlpha;
    uniform float time;
  `,
  volumetricFalloff: `
    // Smooth volumetric falloff circle
    float getVolumetricAlpha(vec2 uv, float softness) {
        float dist = length(uv - vec2(0.5));
        if (dist > 0.5) return 0.0;
        return pow(smoothstep(0.5, 0.0, dist), softness);
    }
    
    float getHardCircleAlpha(vec2 uv) {
        float dist = length(uv - vec2(0.5));
        if (dist > 0.5) return 0.0;
        return smoothstep(0.5, 0.45, dist);
    }
  `
};
