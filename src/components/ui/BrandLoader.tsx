import logo from "../../assets/logo.png";

interface BrandLoaderProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function BrandLoader({
  message = "Loading...",
  fullScreen = true,
  className = "",
}: BrandLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "relative flex w-full flex-col items-center justify-center overflow-hidden bg-background text-white",
        fullScreen ? "min-h-screen" : "min-h-[60vh]",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.09),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.07),transparent_40%)]" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-purple-400/30 bg-gradient-to-br from-pink-500/15 via-purple-500/20 to-sky-500/15 shadow-[0_0_40px_rgba(168,85,247,0.25)]">
          <span className="absolute inset-0 rounded-full border border-purple-300/35 animate-ping [animation-duration:2.2s]" />
          <img
            src={logo}
            alt="Eager Minds Club"
            className="relative z-10 h-20 w-20 object-contain drop-shadow-[0_0_16px_rgba(168,85,247,0.5)]"
          />
        </div>

        <div className="mt-6 h-9 w-9 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-white/65">
          {message}
        </p>
      </div>
    </div>
  );
}
