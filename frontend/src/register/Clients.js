import React, { useEffect, useState } from "react";
import axios from "axios";

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found! Redirecting...");
    return null;
  }

  try {
    const response = await axios(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error;
  }
};

const ClientPage = () => {
  const [clients, setClients] = useState([]); // Store clients

  // Fetch clients when the page loads
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetchWithAuth("/api/clients", { method: "GET" });
        if (response && response.status === 200) {
          setClients(response.data);
        }
      } catch (error) {
        console.error("Error fetching clients:", error.message);
      }
    };

    fetchClients();
  }, []);

  // Handle client deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        const response = await fetchWithAuth(`/api/clients/${id}`, {
          method: "DELETE",
        });

        if (response && response.status === 200) {
          setClients(clients.filter((client) => client.id !== id)); // Update state
          alert("Client deleted successfully.");
        }
      } catch (error) {
        console.error("Error deleting client:", error.message);
        alert("Failed to delete client.");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Clients</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Telephone</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50">
              <td className="border p-2 text-center">{client.nom}</td>
              <td className="border p-2 text-center">{client.email}</td>
              <td className="border p-2 text-center">{client.telephone}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleDelete(client.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {clients.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No clients available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClientPage;
