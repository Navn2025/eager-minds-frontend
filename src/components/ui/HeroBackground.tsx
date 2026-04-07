export default function HeroBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#07050F]">
      {/* Home-style static aurora used by every page */}
      <div
        className="absolute top-[-10%] right-[-5%] w-[55%] h-[65%]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(236,72,153,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-[15%] left-[30%] w-[50%] h-[55%]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(168,85,247,0.14) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[50%]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(56,189,248,0.12) 0%, transparent 65%)",
        }}
      />

      <div className="absolute inset-0 noise-overlay opacity-[0.03]" />
    </div>
  );
}
