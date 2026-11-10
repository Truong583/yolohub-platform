import { useCounterAnimation } from "@/hooks/use-counter-animation";

interface AnimatedCounterProps {
  value: string;
  duration?: number;
  startAnimation?: boolean;
}

export function AnimatedCounter({
  value,
  duration = 2000,
  startAnimation = true,
}: AnimatedCounterProps) {
  // Extract numeric value and suffix from the string
  const parseValue = (val: string) => {
    // Handle different formats: "50,000+", "1,200+", "4.9/5", "50K+", "1.2M+"
    const match = val.match(/^([\d,]+\.?\d*)([KMB]?)(.*)/i);
    if (!match) return { number: 0, suffix: val, decimals: 0 };

    const numberStr = match[1].replace(/,/g, ""); // Remove commas
    let number = parseFloat(numberStr);
    const multiplier = match[2]?.toUpperCase();
    const remainingSuffix = match[3]; // Everything after the multiplier

    // Apply multiplier
    if (multiplier === "K") number *= 1000;
    else if (multiplier === "M") number *= 1000000;
    else if (multiplier === "B") number *= 1000000000;

    const suffix = remainingSuffix; // Only the remaining suffix (like "+" or "/5")
    const decimals = numberStr.includes(".")
      ? numberStr.split(".")[1].length
      : 0;

    return { number, suffix, decimals, originalMultiplier: multiplier };
  };

  const { number, suffix, decimals, originalMultiplier } = parseValue(value);

  const { count } = useCounterAnimation({
    start: 0,
    end: number,
    duration,
    startAnimation,
    decimals,
  });

  // Format the number with commas for display
  const formatNumber = (num: number): string => {
    if (originalMultiplier) {
      // Convert back to the original format (e.g., 50000 -> "50K")
      let displayValue: number;
      const displayMultiplier = originalMultiplier;

      if (originalMultiplier === "K") displayValue = num / 1000;
      else if (originalMultiplier === "M") displayValue = num / 1000000;
      else if (originalMultiplier === "B") displayValue = num / 1000000000;
      else displayValue = num;

      if (decimals > 0) {
        return displayValue.toFixed(decimals) + displayMultiplier;
      }
      return Math.floor(displayValue).toLocaleString() + displayMultiplier;
    }

    if (decimals > 0) {
      return num.toFixed(decimals);
    }
    return Math.floor(num).toLocaleString();
  };

  return (
    <span>
      {formatNumber(count)}
      {suffix}
    </span>
  );
}
