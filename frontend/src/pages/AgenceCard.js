import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode for decoding JWT tokens

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
      console.error("Unauthorized or forbidden! Clearing token...");
      return null;
    }
    return response;
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error;
  }
};

const AgenceCard = ({ agence }) => {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(null); // Image URL state
  const [loading, setLoading] = useState(true); // Loading state
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is admin

  // Check if the user is admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        console.log("Decoded token:", decodedToken); // Log for debugging
        if (decodedToken.roles && decodedToken.roles.includes("ROLE_ADMIN")) {
          setIsAdmin(true); // Set isAdmin to true if ROLE_ADMIN exists
        }
      } catch (error) {
        console.error("Error decoding token:", error.message);
      }
    }
  }, []);
  
  // Fetch the image
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetchWithAuth(`/api/getimage/${agence.id}`);
        if (response && response.ok) {
          const blob = await response.blob();
          setImageSrc(URL.createObjectURL(blob));
        }
      } catch (error) {
        console.error("Error fetching image:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [agence.id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this agence?")) {
      try {
        const response = await fetchWithAuth(`/api/agencedel/${agence.id}`, {
          method: "DELETE",
        });
        if (!response || !response.ok) throw new Error("Failed to delete agence.");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting agence:", error.message);
      }
    }
  };

  const handleImageClick = () => {
    navigate(`/agences/${agence.id}/biens`);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      {/* Image Section */}
      {loading ? (
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded">
          <p className="text-gray-500">Loading image...</p>
        </div>
      ) : imageSrc ? (
        <img
          src={imageSrc}
          alt={`Image of ${agence.nom}`}
          className="w-full h-40 object-cover rounded cursor-pointer"
          onClick={handleImageClick}
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded">
          <p className="text-gray-500">Image not available</p>
        </div>
      )}

      {/* Agence Information */}
      <h3 className="text-lg font-semibold mt-2">{agence.nom}</h3>
      <p className="text-gray-600">{agence.telephone}</p>

      {/* Admin-Only Buttons */}
      {isAdmin && (
        <div className="flex justify-between mt-4">
          <button
            onClick={() => navigate(`/edit-agence/${agence.id}`)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default AgenceCard;
