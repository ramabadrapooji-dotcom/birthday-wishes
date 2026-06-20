import React from 'react';

export function StickerContainer({ children }: { children?: React.ReactNode }) {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-30">
      {/* 
        Empty by default.
        This StickerContainer is ready for future assets.
        Later you can insert:
        - cute reactions
        - GIF stickers
        - Lottie animations
        - character reactions
      */}
      {children}
    </div>
  );
}
