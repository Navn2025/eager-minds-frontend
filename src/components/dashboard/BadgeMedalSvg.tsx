import { useId } from "react";
import { cn } from "../../lib/utils";

type BadgeTone =
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "legendary"
  | "default";

interface BadgeMedalSvgProps {
  badgeName: string;
  unlocked?: boolean;
  size?: number;
  className?: string;
}

function getBadgeTone(badgeName: string): BadgeTone {
  const key = badgeName.toLowerCase();
  if (key.includes("bronze")) return "bronze";
  if (key.includes("silver")) return "silver";
  if (key.includes("gold")) return "gold";
  if (key.includes("platinum")) return "platinum";
  if (key.includes("legend")) return "legendary";
  return "default";
}

function getToneColors(tone: BadgeTone): {
  start: string;
  end: string;
  ribbon: string;
  stroke: string;
} {
  switch (tone) {
    case "bronze":
      return {
        start: "#d67f45",
        end: "#8d4420",
        ribbon: "#5a2f1c",
        stroke: "#f3b78d",
      };
    case "silver":
      return {
        start: "#dfe7f2",
        end: "#7f90aa",
        ribbon: "#50617a",
        stroke: "#f6fbff",
      };
    case "gold":
      return {
        start: "#ffd96b",
        end: "#ba7a0f",
        ribbon: "#8c5e0e",
        stroke: "#ffe8a8",
      };
    case "platinum":
      return {
        start: "#f5f7ff",
        end: "#8ea4ff",
        ribbon: "#5f72cc",
        stroke: "#ffffff",
      };
    case "legendary":
      return {
        start: "#ffc8f2",
        end: "#b41f8c",
        ribbon: "#75135a",
        stroke: "#ffdfff",
      };
    default:
      return {
        start: "#76d2ff",
        end: "#2663be",
        ribbon: "#21478b",
        stroke: "#d6f0ff",
      };
  }
}

export default function BadgeMedalSvg({
  badgeName,
  unlocked = true,
  size = 68,
  className,
}: BadgeMedalSvgProps) {
  const tone = getBadgeTone(badgeName);
  const colors = getToneColors(tone);
  const gradientId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      role="img"
      aria-label={badgeName}
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.start} />
          <stop offset="100%" stopColor={colors.end} />
        </linearGradient>
      </defs>

      <path
        d="M28 94L38 58H18L10 94Z"
        fill={colors.ribbon}
        opacity={unlocked ? 1 : 0.5}
      />
      <path
        d="M68 94L58 58H78L86 94Z"
        fill={colors.ribbon}
        opacity={unlocked ? 1 : 0.5}
      />

      <circle
        cx="48"
        cy="40"
        r="28"
        fill={`url(#${gradientId})`}
        stroke={colors.stroke}
        strokeWidth="3"
        opacity={unlocked ? 1 : 0.45}
      />
      <circle cx="48" cy="40" r="20" fill="#0b1020" opacity="0.25" />

      <path
        d="M48 24L52.3 33.1L62.3 34.5L54.9 41.5L56.7 51.5L48 46.9L39.3 51.5L41.1 41.5L33.7 34.5L43.7 33.1Z"
        fill="#fff7d1"
        opacity={unlocked ? 0.95 : 0.4}
      />

      {!unlocked && (
        <circle cx="48" cy="40" r="30" fill="#0b1020" opacity="0.35" />
      )}
    </svg>
  );
}
