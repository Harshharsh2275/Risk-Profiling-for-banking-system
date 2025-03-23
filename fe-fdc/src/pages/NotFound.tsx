import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="text-center p-10 rounded-2xl shadow-xl bg-white/10 backdrop-blur-lg border border-gray-700">
        <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-4">
          404
        </h1>
        <p className="text-lg text-gray-300 mb-6">Oops! The page you’re looking for doesn’t exist.</p>
        <a
          href="/"
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
  
  
};

export default NotFound;
