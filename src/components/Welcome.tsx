import React from "react";
import logo_and_text from "/text-and-logo.png";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  text-center px-4">
      <img
        src={logo_and_text} // Replace with your actual image path
        alt="App Icon"
        className="object-contain w-1/2 mb-4"
      />
    </div>
  );
}
