export default function AboutPage() {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12 font-sans">
        <h1 className="text-4xl font-heading font-bold text-navy mb-4">About This Project</h1>
        <p className="mb-6 text-lg text-gray-700">
          JusticeBench is an initiative by the <a href="https://law.stanford.edu/legal-design-lab/"> Stanford Legal Design Lab</a> to help researchers,
          technologists, and public service leaders evaluate and build better AI systems for civil legal help.
        </p>
        <div className="mt-4 bg-peach-light text-navy text-sm font-medium px-4 py-2 rounded-md max-w-xl mx-auto">
    🚧 This platform is still under development. Please explore and send us feedback, contributions, and ideas to <a href="mailto:legaldesignlab@law.stanford.edu" className="underline">legaldesignlab@law.stanford.edu</a>.
  </div>
  <p></p>
        <p className="mb-6 text-gray-700">
          This site hosts projects, benchmarks, datasets, and community-contributed tools that aim to ensure AI
          can responsibly support access to justice — especially in domains like eviction, debt, custody,
          and government benefits.
        </p>
        <p className="mb-6 text-gray-700">
          It was created by a team at Stanford Legal Design Lab, supported by partners across the U.S. justice system,
          and is intended to grow as an open platform for knowledge sharing and testing.
        </p>
        <h2 className="text-2xl font-heading text-navy mt-10 mb-2">JusticeBench's goals:</h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Make AI projects in justice more transparent and measurable</li>
          <li>Help legal aid and court teams find and adapt existing AI projects</li>
          <li>Create shared benchmarks to improve quality and safety</li>
          <li>Foster responsible, inclusive innovation for legal help</li>
        </ul>
      </main>
    );
  }
  