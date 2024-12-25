import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode for decoding the token
import { useNavigate } from "react-router-dom";

// Secure Fetch Function
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
        ...(options.headers || {}),
      },
    });

    if (response.status === 401 || response.status === 403) {
      console.error("Unauthorized or forbidden! Clearing token...");
      alert("Unauthorized! Please log in again.");
      return null;
    }

    return response;
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error;
  }
};

const InterestedBiensList = () => {
  const [biens, setBiens] = useState([]); // List of biens the user is interested in
  const [images, setImages] = useState({}); // Images of the biens
  const navigate = useNavigate();

  // Fetch the interested biens for the logged-in user
  useEffect(() => {
    const fetchInterestedBiens = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must log in first.");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        // Fetch the biens the user is interested in
        const response = await fetchWithAuth(`/api/clients/${userId}/interested-biens`);
        if (response && response.ok) {
          const data = await response.json();
          setBiens(data);

          // Fetch images for each bien
          data.forEach((bien) => fetchImage(bien.id));
        } else {
          throw new Error("Failed to fetch interested biens.");
        }
      } catch (error) {
        console.error("Error fetching interested biens:", error.message);
      }
    };

    const fetchImage = async (bienId) => {
      try {
        const response = await fetchWithAuth(`/api/getimagebien/${bienId}`);
        if (response && response.ok) {
          const blob = await response.blob();
          setImages((prev) => ({
            ...prev,
            [bienId]: URL.createObjectURL(blob),
          }));
        }
      } catch (error) {
        console.error(`Error fetching image for bien ${bienId}:`, error.message);
      }
    };

    fetchInterestedBiens();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Biens You're Interested In</h2>

      {biens.length === 0 ? (
        <p className="text-gray-500">No interested biens found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {biens.map((bien) => (
            <div key={bien.id} className="bg-white shadow rounded-lg p-4">
              {/* Image */}
              {images[bien.id] ? (
                <img
                  src={images[bien.id]}
                  alt={bien.type}
                  className="w-full h-40 object-cover rounded cursor-pointer"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded">
                  <p className="text-gray-500">Loading image...</p>
                </div>
              )}

              {/* Bien Details */}
              <h3 className="text-lg font-semibold mt-2">{bien.type}</h3>
              <p className="text-gray-600">Adresse: {bien.adresse}</p>
              <p className="text-gray-600">Prix: {bien.prix} TND</p>
              <p className="text-gray-600">Statut: {bien.statut}</p>
              <p className="text-gray-500 text-sm mt-1">{bien.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterestedBiensList;
