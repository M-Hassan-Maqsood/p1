// Create a simple not-found page that doesn't depend on authentication
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-6">Page Not Found</h2>
      <p className="text-muted-foreground mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <a href="/" className="text-primary hover:underline">
        Go back home
      </a>
    </div>
  )
}

