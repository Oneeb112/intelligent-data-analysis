import heroBg from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <header className="relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
      
      <div className="relative container mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
          Intelligent Data Analysis Platform
        </h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto animate-fade-in">
          Upload Excel or CSV files and get instant insights with automated cleaning, 
          ERD generation, and interactive dashboards
        </p>
        
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/80">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span>Auto Type Detection</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span>Smart Cleaning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span>ERD Generation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span>Interactive Dashboards</span>
          </div>
        </div>
      </div>
    </header>
  );
};
