"use client";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center space-y-6 max-w-2xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold">
          <span 
            className="inline"
            style={{
              fontFamily: 'var(--font-ufc-heading)',
              fontWeight: 600,
              letterSpacing: '0.01em',
              textTransform: 'none',
              color: '#FFFFFF'
            }}
          >
            AI ENGINE FOR FIGHTERS
          </span>
        </h1>
      </div>
      
      <style jsx global>{`
        :root {
          --font-ufc-heading: "UFC Sans Condensed", "Arial Narrow", Arial, sans-serif;
        }
      `}</style>
    </div>
  );
}
