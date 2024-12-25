import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Function to perform authenticated fetch requests
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  console.log('Token being sent adddd:', token);

  if (!token) {
    console.error('No token found! Redirecting...');
    
    return null;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`, // Attach the JWT token
      },
    });

    if (response.status === 401 || response.status === 403) {
      console.error('Unauthorized! Redirecting...');
     
     
      return null;
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error.message);
    throw error;
  }
};

const AddEditAgence = () => {
  const [adresse, setAdresse] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [img, setImg] = useState(null); // To handle file input
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch agence data if editing
  useEffect(() => {
    if (id) {
      fetchWithAuth(`/api/agence/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setAdresse(data.adresse || '');
          setNom(data.nom || '');
          setTelephone(data.telephone || '');
        })
        .catch((err) => console.error('Error fetching agence:', err));
    }
  }, [id]);

  const handleFileChange = (e) => {
    setImg(e.target.files[0]); // Set the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      'agence',
      JSON.stringify({
        adresse,
        nom,
        telephone,
      })
    );
    if (img) {
      formData.append('mf', img); // Add the image file if provided
    }

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/agenceup/${id}` : '/api/saveagence';

    try {
      const response = await fetchWithAuth(url, {
        method,
        body: formData, // Use FormData for file uploads
      });

      if (!response || !response.ok) {
        throw new Error(`HTTP error! Status: ${response?.status}`);
      }

      console.log('Agence saved successfully!');
      navigate('/home'); // Navigate to home on success
    } catch (error) {
      console.error('Error saving agence:', error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{id ? 'Edit Agence' : 'Add Agence'}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Adresse Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Adresse</label>
          <input
            type="text"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Nom Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Nom</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Telephone Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Téléphone</label>
          <input
            type="text"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* File Input */}
        <div className="mb-4">
          <label className="block text-gray-700">Image File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default AddEditAgence;
