declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number;
    spread?: number;
    origin?: { x: number; y: number };
  }

  function confetti(options?: ConfettiOptions): Promise<void>;
  export = confetti;
} 