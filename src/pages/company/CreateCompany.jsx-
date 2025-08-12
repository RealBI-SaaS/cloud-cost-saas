import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios/axiosInstance";

const CreateCompany = () => {
  const [companyName, setCompanyName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access_token");
      const response = await axiosInstance.post(
        "/organizations/organization/",
        { name: companyName },
      );

      if (!response.ok) {
        throw new Error("Failed to create company");
      }

      const data = await response.json();
      navigate("/account");
    } catch (error) {
      console.error("Error creating company:", error);
      // TODO: Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="flex flex-col items-start justify-center gap-4 bg-white rounded-sm p-5">
      <h1>Create Company</h1>
      <form onSubmit={handleSubmit} className="mt-0 pt-0">
        <input
          type="text"
          id="companyName"
          name="companyName"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="border p-2 rounded-md"
        />
      </form>
      <div className="mt-3 flex gap-4 w-full">
        <button
          onClick={handleSubmit}
          className="text-white bg-blue-100 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
        >
          Finish
        </button>
        <button
          onClick={() => navigate("/account")}
          className="text-white bg-red-100 px-4 py-2 rounded-md hover:bg-red-200 transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default CreateCompany;
