import React from "react";
import { Link } from "react-router-dom";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const VerifiedEmail = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <IoMdCheckmarkCircleOutline className="text-green-500 text-6xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Email Successfully Verified!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for verifying your email address. Your account is now fully
          activated.
        </p>
        <Link
          to="/account"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Go to Account Page
        </Link>
      </div>
    </div>
  );
};

export default VerifiedEmail;
