import WordOfTheDay from "../components/home/WordOfTheDay";

export default function WordOfTheDayPage() {
  return (
    <div className="min-h-screen bg-[#0b0b0b] pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-4">Word of the Day</h1>
          <p className="text-xl text-white/60">Expand your vocabulary every day with our highlighted words.</p>
        </div>
        <WordOfTheDay />
      </div>
    </div>
  );
}
