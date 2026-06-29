/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import UniverseEngine from './components/UniverseEngine';
import UI from './components/UI';
import { ErrorBoundary } from './components/ErrorBoundary';
import { usePerformanceGuard } from './utils/PerformanceGuard';

interface Stage9Props {
  onBack?: () => void;
  onHome?: () => void;
}

function AppContent({ onBack, onHome }: Stage9Props) {
  usePerformanceGuard();
  
  return (
    <ErrorBoundary>
      <div className="w-full h-screen bg-[#020205] overflow-hidden relative">
        <UniverseEngine />
        <UI onBack={onBack} onHome={onHome} />
      </div>
    </ErrorBoundary>
  );
}

export default function App({ onBack, onHome }: Stage9Props) {
  return <AppContent onBack={onBack} onHome={onHome} />;
}
