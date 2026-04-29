import { HeartData } from '../types';

export const generateHeartsData = (key: number): HeartData[] => {
  const list: HeartData[] = [];
  
  // 1. Optimized Canopy
  for (let i = 0; i < 250; i++) {
    const angle = (i / 250) * 2 * Math.PI;
    const t = angle;
    const hX = 16 * Math.pow(Math.sin(t), 3);
    const hY = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    const jitter = Math.random() * 8;
    const scale = 5.5 + Math.random() * 7;
    
    list.push({
      id: i,
      x: 200 + hX * scale + (Math.random() - 0.5) * jitter * 10,
      y: 170 + hY * scale + (Math.random() - 0.5) * jitter * 10,
      size: 0.2 + Math.random() * 0.4,
      color: `hsl(${330 + Math.random() * 60}, 80%, ${50 + Math.random() * 20}%)`,
      delay: 2 + Math.random() * 2,
      rotate: (Math.random() - 0.5) * 60
    });
  }

  // 1.5 Middle Filler Hearts (Redistributed to sides)
  for (let i = 0; i < 60; i++) {
    const angle = Math.random() * Math.PI * 2;
    // Push hearts away from the very center (min distance 30)
    const dist = 30 + Math.random() * 90; 
    list.push({
      id: i + 500,
      x: 200 + Math.cos(angle) * dist,
      y: 160 + Math.sin(angle) * dist,
      size: 0.15 + Math.random() * 0.3,
      color: `hsl(${340 + Math.random() * 40}, 90%, 65%)`,
      delay: 2.2 + Math.random() * 2,
      rotate: (Math.random() - 0.5) * 120
    });
  }

  // 1.7 Shoulder Edge Clusters
  for (let i = 0; i < 80; i++) {
    let t;
    if (i % 2 === 0) {
      t = 0.4 + Math.random() * 0.8; 
    } else {
      t = (2 * Math.PI - 1.2) + Math.random() * 0.8;
    }
    
    const hX = 16 * Math.pow(Math.sin(t), 3);
    const hY = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    const scale = 7.5 + Math.random() * 2.5; 
    
    list.push({
      id: i + 3000,
      x: 200 + hX * scale + (Math.random() - 0.5) * 15,
      y: 170 + hY * scale + (Math.random() - 0.5) * 15,
      size: 0.15 + Math.random() * 0.3,
      color: `hsl(${340 + Math.random() * 40}, 95%, 65%)`,
      delay: 2.8 + Math.random() * 2,
      rotate: (Math.random() - 0.5) * 140
    });
  }

  // 1.8 Side Middle Clusters
  for (let i = 0; i < 100; i++) {
    let t;
    if (i % 2 === 0) {
      t = 1.2 + Math.random() * 0.8; 
    } else {
      t = (2 * Math.PI - 2.0) + Math.random() * 0.8;
    }
    
    const hX = 16 * Math.pow(Math.sin(t), 3);
    const hY = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    const scale = 6.5 + Math.random() * 3; 
    
    list.push({
      id: i + 4000,
      x: 200 + hX * scale,
      y: 170 + hY * scale,
      size: 0.15 + Math.random() * 0.3,
      color: `hsl(${335 + Math.random() * 45}, 90%, 65%)`,
      delay: 2.5 + Math.random() * 2,
      rotate: (Math.random() - 0.5) * 100
    });
  }

  // 1.9 Top Diagonal Fillers
  for (let i = 0; i < 80; i++) {
    let t;
    if (i % 2 === 0) {
      t = 0.2 + Math.random() * 0.6; 
    } else {
      t = (2 * Math.PI - 0.8) + Math.random() * 0.6;
    }
    
    const hX = 16 * Math.pow(Math.sin(t), 3);
    const hY = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    const scale = 5.0 + Math.random() * 4.0;
    
    list.push({
      id: i + 5000,
      x: 200 + hX * scale,
      y: 170 + hY * scale,
      size: 0.15 + Math.random() * 0.35,
      color: `hsl(${335 + Math.random() * 45}, 90%, 60%)`,
      delay: 2.3 + Math.random() * 1.5,
      rotate: (Math.random() - 0.5) * 80
    });
  }

  // 1.95 Extra Dense Romantic Fillers (Pushed more to the sides)
  for (let i = 0; i < 40; i++) {
    const angle = Math.random() * Math.PI * 2;
    // Minimum distance from center
    const dist = 40 + Math.random() * 100;
    const x = 200 + Math.cos(angle) * dist;
    const y = 160 + Math.sin(angle) * (dist * 0.9);
    
    list.push({
      id: i + 6000,
      x,
      y,
      size: 0.08 + Math.random() * 0.15,
      color: `hsl(${340 + Math.random() * 50}, 95%, ${60 + Math.random() * 15}%)`,
      delay: 2.0 + Math.random() * 3,
      rotate: Math.random() * 360
    });
  }

  // 1.96 Bottom Base Fillers (Near the stem start)
  for (let i = 0; i < 60; i++) {
    list.push({
      id: i + 7000,
      x: 200 + (Math.random() - 0.5) * 80,
      y: 340 + (Math.random() - 0.5) * 40,
      size: 0.1 + Math.random() * 0.15,
      color: `hsl(${330 + Math.random() * 30}, 80%, 40%)`,
      delay: 1.5 + Math.random() * 2,
      rotate: Math.random() * 360
    });
  }

  // 2.0 Top "Crown" Hearts (Bright and small - spreading them more)
  for (let i = 0; i < 80; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 60;
    list.push({
      id: i + 8000,
      x: 200 + Math.cos(angle) * dist,
      y: 150 + Math.sin(angle) * (dist * 0.85),
      size: 0.06 + Math.random() * 0.1,
      color: "#f472b6", // light pink crown
      delay: 3.5 + Math.random() * 3,
      rotate: Math.random() * 360
    });
  }

  // 2.1 Main Volume Fillers (Reduced core density, moved outwards)
  for (let i = 0; i < 60; i++) {
    const angle = Math.random() * Math.PI * 2;
    // Pushing away from center to create 'besides' effect
    const dist = 50 + Math.random() * 100;
    list.push({
      id: i + 9000,
      x: 200 + Math.cos(angle) * dist,
      y: 180 + Math.sin(angle) * (dist * 0.8),
      size: 0.05 + Math.random() * 0.14,
      color: i % 3 === 0 ? "#ec4899" : i % 3 === 1 ? "#db2777" : "#be185d",
      delay: 0.5 + Math.random() * 5,
      rotate: Math.random() * 360
    });
  }

  // Stem & Main Branch Hearts
  const branchStructures = [
    { start: {x: 200, y: 400}, end: {x: 200, y: 240} }, 
    { start: {x: 200, y: 300}, end: {x: 340, y: 160} }, 
    { start: {x: 200, y: 300}, end: {x: 60, y: 160} },  
    { start: {x: 270, y: 240}, end: {x: 350, y: 180} }, 
    { start: {x: 130, y: 240}, end: {x: 50, y: 180} },  
    { start: {x: 200, y: 260}, end: {x: 200, y: 100} }, 
    // Small Romatic Twigs
    { start: {x: 240, y: 280}, end: {x: 280, y: 250} }, 
    { start: {x: 160, y: 280}, end: {x: 120, y: 250} }, 
    { start: {x: 200, y: 200}, end: {x: 260, y: 160} }, 
    { start: {x: 200, y: 200}, end: {x: 140, y: 160} }, 
    // Even smaller romantic twigs
    { start: {x: 230, y: 180}, end: {x: 250, y: 140} }, 
    { start: {x: 170, y: 180}, end: {x: 150, y: 140} }, 
    { start: {x: 200, y: 150}, end: {x: 220, y: 110} }, 
    { start: {x: 200, y: 150}, end: {x: 180, y: 110} }, 
  ];

  branchStructures.forEach((stem, idx) => {
    let count = 15 + idx * 5;
    for (let i = 0; i < count; i++) {
      const t = Math.random();
      const px = stem.start.x + (stem.end.x - stem.start.x) * t;
      const py = stem.start.y + (stem.end.y - stem.start.y) * t;
      list.push({
        id: 10000 + idx * 200 + i,
        x: px + (Math.random() - 0.5) * 30,
        y: py + (Math.random() - 0.5) * 30,
        size: 0.12 + Math.random() * 0.28,
        color: i % 2 === 0 ? "#be185d" : "#db2777",
        delay: 1.0 + idx * 0.1 + t * 1.5,
        rotate: (Math.random() - 0.5) * 120
      });
    }
  });

  return list;
};
