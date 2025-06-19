// NotFound.jsx
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="mt-4 text-xl text-gray-800">Page Not Found</p>

      <Link
        to="/home"
        className="mt-6 inline-block px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-full transition duration-200"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
