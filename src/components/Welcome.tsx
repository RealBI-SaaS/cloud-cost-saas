import React from "react";
import logo_and_text from "../../public/text-and-logo.png";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  text-center px-4">
      <img
        src={logo_and_text} // Replace with your actual image path
        alt="App Icon"
        className="object-contain w-1/2 mb-4"
      />
      <h1 className="text-3xl font-bold mb-2">Welcome to the App!</h1>
      <p className="text-gray-600 max-w-md">
        We’re glad to have you here. Start exploring or choose an option from
        the menu to get started.
      </p>
    </div>
  );
}
