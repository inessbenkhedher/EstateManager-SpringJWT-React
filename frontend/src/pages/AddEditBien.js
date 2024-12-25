import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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

const AddEditBien = () => {
  const { agenceId, bienId } = useParams(); // Get agenceId and bienId from URL
  const [type, setType] = useState('');
  const [adresse, setAdresse] = useState('');
  const [prix, setPrix] = useState('');
  const [statut, setStatut] = useState('');
  const [description, setDescription] = useState('');
  const [dossierId, setDossierId] = useState('');
  const [dossiers, setDossiers] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch dossiers and bien details
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch unassigned dossiers
        const dossierResponse = await fetchWithAuth('/api/dossiers/unassigned');
        if (dossierResponse && dossierResponse.ok) {
          const dossierData = await dossierResponse.json();
          setDossiers(dossierData || []);
        }

        // Fetch bien details if editing
        if (bienId) {
          const bienResponse = await fetchWithAuth(`/api/biens/${bienId}`);
          if (bienResponse && bienResponse.ok) {
            const bienData = await bienResponse.json();
            setType(bienData.type || '');
            setAdresse(bienData.adresse || '');
            setPrix(bienData.prix || '');
            setStatut(bienData.statut || '');
            setDescription(bienData.description || '');
            setDossierId(bienData.dossier?.id || '');
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bienId]);

  // Handle file selection
  const handleImageChange = (e) => setImage(e.target.files[0]);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type || !adresse || !prix || !statut || !description) {
      alert('Please fill in all required fields.');
      return;
    }

    const bien = {
      type,
      adresse,
      prix,
      statut,
      description,
      agence: { id: agenceId },
      dossier: dossierId ? { id: dossierId } : null,
    };

    const formData = new FormData();
    formData.append('bien', JSON.stringify(bien));
    if (image) formData.append('mf', image);

    try {
      const response = await fetchWithAuth(
        bienId ? `/api/uppbien/${bienId}` : '/api/savebien',
        {
          method: bienId ? 'PUT' : 'POST',
          body: formData,
        }
      );

      if (response && response.ok) {
        alert('Bien saved successfully!');
        navigate(`/agences/${agenceId}/biens`);
      } else {
        throw new Error('Failed to save bien.');
      }
    } catch (err) {
      console.error('Error saving bien:', err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{bienId ? 'Edit Bien' : 'Add Bien'}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block text-gray-700">Type</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
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
        <div className="mb-4">
          <label className="block text-gray-700">Prix</label>
          <input
            type="number"
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Statut</label>
          <input
            type="text"
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Dossier</label>
          <select
            value={dossierId}
            onChange={(e) => setDossierId(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">None</option>
            {dossiers.map((dossier) => (
              <option key={dossier.id} value={dossier.id}>
                {dossier.details}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full border rounded px-3 py-2"
          />
        </div>
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

export default AddEditBien;
