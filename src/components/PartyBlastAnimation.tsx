import { motion } from 'motion/react';
import { useMemo } from 'react';

const BLAST_COLORS = ['#ff5b93', '#ffb4cc', '#ffd700', '#ff7ba3', '#ffffff', '#ff4757', '#ffa502', '#e84393', '#fd79a8'];

type Side = 'left' | 'right';

interface BlastPiece {
  id: number;
  color: string;
  w: number;
  h: number;
  xEnd: number;
  yPeak: number;
  yEnd: number;
  rotate: number;
  delay: number;
  round: boolean;
}

interface RainPiece {
  id: number;
  color: string;
  w: number;
  h: number;
  left: number;
  duration: number;
  delay: number;
  sway: number;
  rotate: number;
  round: boolean;
}

function createBlastPieces(side: Side, count: number): BlastPiece[] {
  const sign = side === 'left' ? 1 : -1;
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: BLAST_COLORS[i % BLAST_COLORS.length],
    w: 6 + Math.random() * 10,
    h: 4 + Math.random() * 14,
    xEnd: sign * (80 + Math.random() * 420),
    yPeak: -(180 + Math.random() * 320),
    yEnd: 60 + Math.random() * 280,
    rotate: (Math.random() - 0.5) * 720,
    delay: Math.random() * 0.12,
    round: Math.random() > 0.65,
  }));
}

function createRainPieces(count: number): RainPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: BLAST_COLORS[i % BLAST_COLORS.length],
    w: 5 + Math.random() * 9,
    h: 4 + Math.random() * 12,
    left: Math.random() * 100,
    duration: 5 + Math.random() * 5,
    delay: 1.8 + Math.random() * 4,
    sway: (Math.random() - 0.5) * 80,
    rotate: Math.random() * 360,
    round: Math.random() > 0.55,
  }));
}

const ConfettiShape = ({
  color,
  w,
  h,
  round,
}: {
  color: string;
  w: number;
  h: number;
  round: boolean;
}) => (
  <div
    style={{
      width: w,
      height: h,
      backgroundColor: color,
      borderRadius: round ? '50%' : 2,
      boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
    }}
  />
);

const PartyCannon = ({ side }: { side: Side }) => {
  const isLeft = side === 'left';
  const blastDelay = 0.55;
  const dropStart = 1.65;

  return (
    <motion.div
      className="party-cannon"
      style={{
        [isLeft ? 'left' : 'right']: 0,
        bottom: 0,
        transformOrigin: isLeft ? 'bottom left' : 'bottom right',
      }}
      initial={{ y: 0, opacity: 1, rotate: isLeft ? 28 : -28 }}
      animate={{
        y: [0, 0, 120],
        opacity: [1, 1, 0],
        rotate: isLeft ? [28, 24, 28] : [-28, -24, -28],
      }}
      transition={{
        y: { duration: 1.4, delay: dropStart, ease: [0.55, 0, 1, 0.45] },
        opacity: { duration: 0.5, delay: dropStart + 1.1 },
        rotate: {
          duration: 0.35,
          delay: blastDelay - 0.15,
          times: [0, 0.5, 1],
        },
      }}
    >
      <motion.div
        className="party-cannon__tube"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: [1, 0.82, 1.05, 1] }}
        transition={{ duration: 0.25, delay: blastDelay - 0.1 }}
      >
        <div className="party-cannon__rim" />
        <div className="party-cannon__body" />
        <div className="party-cannon__label" />
      </motion.div>
      <motion.div
        className="party-cannon__burst-flash"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: [0, 0.9, 0], scale: [0.3, 1.4, 1.8] }}
        transition={{ duration: 0.35, delay: blastDelay }}
      />
    </motion.div>
  );
};

const BlastConfetti = ({ side, pieces }: { side: Side; pieces: BlastPiece[] }) => {
  const originX = side === 'left' ? '8vw' : '92vw';
  const blastDelay = 0.55;

  return (
    <>
      {pieces.map((p) => (
        <motion.div
          key={`${side}-${p.id}`}
          className="absolute pointer-events-none"
          style={{ left: originX, bottom: '2vh' }}
          initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
          animate={{
            x: [0, p.xEnd * 0.45, p.xEnd],
            y: [0, p.yPeak, p.yEnd],
            opacity: [0, 1, 1, 0.85, 0],
            rotate: [0, p.rotate * 0.4, p.rotate],
          }}
          transition={{
            duration: 2.2 + Math.random() * 0.8,
            delay: blastDelay + p.delay,
            ease: [0.15, 0.85, 0.35, 1],
            times: [0, 0.25, 0.55, 0.85, 1],
          }}
        >
          <ConfettiShape color={p.color} w={p.w} h={p.h} round={p.round} />
        </motion.div>
      ))}
    </>
  );
};

const FallingRain = ({ pieces }: { pieces: RainPiece[] }) => (
  <>
    {pieces.map((p) => (
      <motion.div
        key={`rain-${p.id}`}
        className="absolute pointer-events-none"
        style={{ left: `${p.left}%`, top: '-5vh' }}
        initial={{ y: 0, x: 0, opacity: 0, rotate: p.rotate }}
        animate={{
          y: ['0vh', '110vh'],
          x: [0, p.sway * 0.5, p.sway, p.sway * 0.3, -p.sway * 0.2],
          opacity: [0, 0.95, 0.95, 0.7, 0],
          rotate: [p.rotate, p.rotate + 180, p.rotate + 360],
        }}
        transition={{
          duration: p.duration,
          delay: p.delay,
          repeat: Infinity,
          repeatDelay: 1 + Math.random() * 2,
          ease: 'linear',
          times: [0, 0.08, 0.7, 0.92, 1],
        }}
      >
        <ConfettiShape color={p.color} w={p.w} h={p.h} round={p.round} />
      </motion.div>
    ))}
  </>
);

export const PartyBlastAnimation = () => {
  const leftBlast = useMemo(() => createBlastPieces('left', 55), []);
  const rightBlast = useMemo(() => createBlastPieces('right', 55), []);
  const rain = useMemo(() => createRainPieces(45), []);

  return (
    <div className="party-blast-layer fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <PartyCannon side="left" />
      <PartyCannon side="right" />
      <BlastConfetti side="left" pieces={leftBlast} />
      <BlastConfetti side="right" pieces={rightBlast} />
      <FallingRain pieces={rain} />
    </div>
  );
};
