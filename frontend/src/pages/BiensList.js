import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode for decoding the token

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

const BiensList = () => {
  const { id: agenceId } = useParams();
  const [biens, setBiens] = useState([]);
  const [images, setImages] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        if (decodedToken.roles?.includes("ROLE_ADMIN")) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error decoding token:", error.message);
      }
    }
  }, []);

  useEffect(() => {
    const fetchBiens = async () => {
      const response = await fetchWithAuth(`/api/agences/${agenceId}/biens`);
      if (response && response.ok) {
        const data = await response.json();
        setBiens(data);
        data.forEach((bien) => fetchImage(bien.id));
      }
    };

    

    const fetchImage = async (bienId) => {
      const response = await fetchWithAuth(`/api/getimagebien/${bienId}`);
      if (response && response.ok) {
        const blob = await response.blob();
        setImages((prev) => ({ ...prev, [bienId]: URL.createObjectURL(blob) }));
      }
    };

    fetchBiens();
  }, [agenceId]);

  const handleInterested = async (bienId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      console.log("User ID:", userId, "Bien ID:", bienId);
      const response = await fetchWithAuth(
        `/api/clients/${userId}/interested/${bienId}`,
        { method: "POST" }
      );

      if (response && response.ok) {
        alert("You are now interested in this Bien!");
      } else {
        throw new Error("Failed to mark as interested.");
      }
    } catch (error) {
      console.error("Error marking as interested:", error.message);
      alert("An error occurred. Please try again.");
    }
  };

  const handleDownloadFile = async (dossierId) => {
    if (!dossierId) {
      alert('No file associated with this bien.');
      return;
    }
  
    try {
      const response = await fetchWithAuth(`/api/dossiers/download/${dossierId}`, { method: 'GET' });
  
      if (!response || !response.ok) {
        console.error(`Failed to download file. Status: ${response.status}`);
        throw new Error('Failed to download file');
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = `dossier-${dossierId}.pdf`;
      document.body.appendChild(a);
      a.click();
  
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error.message);
      alert('Error downloading file. Please try again.');
    }
  };

  const handleDeleteBien = async (bienId) => {
    if (window.confirm("Are you sure you want to delete this bien?")) {
      try {
        const response = await fetchWithAuth(`/api/bien/${bienId}`, {
          method: "DELETE",
        });
        if (response && response.ok) {
          setBiens(biens.filter((bien) => bien.id !== bienId));
        }
      } catch (error) {
        console.error("Error deleting bien:", error.message);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Biens for Agence {agenceId}</h2>

        {isAdmin && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => navigate(`/add-bien/${agenceId}`)}
          >
            Add Bien
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {biens.map((bien) => (
          <div key={bien.id} className="bg-white shadow rounded-lg p-4">
            {images[bien.id] ? (
              <img
                src={images[bien.id]}
                alt={bien.type}
                className="w-full h-40 object-cover rounded"
                onClick={() => handleDownloadFile(bien.dossier?.id)}
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded">
                <p>Loading image...</p>
              </div>
            )}
            <h3 className="text-lg font-semibold mt-2">{bien.type}</h3>
            <p className="text-gray-600">Adresse: {bien.adresse}</p>

            <div className="flex justify-between mt-4">
              {isAdmin ? (
                <>
                  <button
                    onClick={() => navigate(`/edit-bien/${agenceId}/${bien.id}`)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBien(bien.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleInterested(bien.id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Interested
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BiensList;
