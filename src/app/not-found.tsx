// src/app/not-found.tsx
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-5xl font-heading font-bold text-navy mb-3">Page not found</h1>
        <p className="text-gray-700 mb-6">
          Sorry, the page you’re looking for doesn’t exist or was moved.
        </p>
        <a href="/" className="underline text-navy">Go home</a>
      </div>
    </div>
  )
}
