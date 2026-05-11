export default function Home() {
  return (
    <div id="scroll-container" className="w-full">
      <section className="h-screen flex items-center justify-start p-12">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-4">Hero Introduction</h1>
          <p className="text-gray-400">The 3D model sits perfectly framed to the right.</p>
        </div>
      </section>

      <section className="h-screen flex items-center justify-end p-12">
        <div className="max-w-md text-right">
          <h2 className="text-4xl font-bold mb-4">Feature Transformation</h2>
          <p className="text-gray-400">As you scroll, GSAP smoothly shifts the model's position and rotation to match this context.</p>
        </div>
      </section>
    </div>
  );
}