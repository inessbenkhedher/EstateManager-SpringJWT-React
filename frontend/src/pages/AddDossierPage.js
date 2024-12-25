import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found! Redirecting...");
    return null;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      console.error("Unauthorized! Please log in again.");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error;
  }
};

const AddDossierPage = () => {
  const [details, setDetails] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file || !details) {
      setError("Please fill in all fields and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("mf", file); // File input field
    formData.append(
      "dossier",
      JSON.stringify({ details }) // JSON data for dossier details
    );

    try {
      const response = await fetchWithAuth("/api/dossiers", {
        method: "POST",
        body: formData,
      });

      if (!response || !response.ok) {
        throw new Error("Failed to create dossier.");
      }

      alert("Dossier created successfully!");
      navigate("/home"); // Redirect to Dossier list page
    } catch (error) {
      console.error("Error creating dossier:", error.message);
      setError("Failed to create dossier. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Create New Dossier</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block text-gray-700">Details</label>
          <input
            type="text"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Enter dossier details"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Upload PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Create Dossier
        </button>
      </form>
    </div>
  );
};

export default AddDossierPage;
