import logo from "../../assets/logo.png";

interface BrandLoaderProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function BrandLoader({
  fullScreen = true,
  className = "",
}: BrandLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "relative flex w-full flex-col items-center justify-center overflow-hidden bg-black text-white",
        fullScreen ? "min-h-screen" : "min-h-[60vh]",
        className,
      ].join(" ")}
    >
      <div className="relative z-10 flex items-center justify-center">
        <div className="relative flex h-44 w-44 sm:h-52 sm:w-52 items-center justify-center rounded-full border-2 border-purple-300/40 bg-black shadow-[0_0_50px_rgba(168,85,247,0.22)]">
          <span className="absolute inset-0 rounded-full border border-purple-300/25 animate-ping [animation-duration:1.8s]" />
          <img
            src={logo}
            alt="Eager Minds Club"
            className="relative z-10 h-32 w-32 sm:h-36 sm:w-36 object-contain animate-pulse drop-shadow-[0_0_22px_rgba(168,85,247,0.55)]"
          />
        </div>
      </div>
    </div>
  );
}
