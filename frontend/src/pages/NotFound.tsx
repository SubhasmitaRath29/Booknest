import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero">
      <div className="text-center text-white">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl">Oops! Page not found</p>
        <a href="/" className="inline-flex items-center bg-white text-primary px-6 py-3 rounded-lg hover:bg-white/90 transition-smooth font-medium">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
