import { useEffect, useState, useRef, useCallback } from "react";

interface UseCounterAnimationOptions {
  start?: number;
  end: number;
  duration?: number;
  startAnimation?: boolean;
  decimals?: number;
}

export function useCounterAnimation({
  start = 0,
  end,
  duration = 2000,
  startAnimation = true,
  decimals = 0,
}: UseCounterAnimationOptions) {
  const [count, setCount] = useState(start);
  const countRef = useRef(start);
  const startTimeRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);

  // Easing function for smooth animation
  const easeOutQuart = (t: number): number => {
    return 1 - Math.pow(1 - t, 4);
  };

  const updateCount = useCallback(
    (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Apply easing
      const easedProgress = easeOutQuart(progress);

      // Calculate current value
      const currentValue = start + (end - start) * easedProgress;

      // Round to specified decimal places
      const roundedValue = parseFloat(currentValue.toFixed(decimals));

      countRef.current = roundedValue;
      setCount(roundedValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(updateCount);
      }
    },
    [start, end, duration, decimals]
  );

  const startCounter = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    startTimeRef.current = null;
    countRef.current = start;
    setCount(start);
    animationRef.current = requestAnimationFrame(updateCount);
  }, [start, updateCount]);

  const resetCounter = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    startTimeRef.current = null;
    countRef.current = start;
    setCount(start);
  }, [start]);

  useEffect(() => {
    if (startAnimation) {
      startCounter();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [startAnimation, startCounter]);

  return {
    count,
    startCounter,
    resetCounter,
    isAnimating: animationRef.current !== null,
  };
}
