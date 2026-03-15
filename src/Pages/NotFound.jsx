import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl font-black text-blue-600 mb-4">404</div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page not found</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/home" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all">
        Back to Home
      </Link>
    </div>
  );
}