import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// This file is a standalone dev entry (not used by the main app).
// The actual Stage9Universe export is in ./index.tsx
import Stage9Universe from './index';

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <Stage9Universe />
    </StrictMode>,
  );
}
