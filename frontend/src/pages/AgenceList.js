import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode for decoding the token
import AgenceCard from './AgenceCard';

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found! Redirecting to login...');
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

    if (response.status === 403 || response.status === 401) {
      console.error('Unauthorized! Clearing token...');
      localStorage.removeItem('token');
      return null;
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error.message);
    throw error;
  }
};

const AgenceList = () => {
  const [agences, setAgences] = useState([]); // Stores all agences
  const [filteredAgences, setFilteredAgences] = useState([]); // Stores filtered agences
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // Track if user has ROLE_ADMIN
  const navigate = useNavigate();

  // Check if user has admin role
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken); // Debugging: Check token content
        if (decodedToken.roles && decodedToken.roles.includes("ROLE_ADMIN")) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error decoding token:', error.message);
      }
    }
  }, []);

  // Fetch all agences
  useEffect(() => {
    const fetchAgences = async () => {
      try {
        const response = await fetchWithAuth('/api/agences');
        if (!response || !response.ok) throw new Error('Failed to fetch agences.');

        const data = await response.json();
        setAgences(data);
        setFilteredAgences(data); // Initially show all agences
      } catch (error) {
        console.error('Error fetching agences:', error.message);
      }
    };

    fetchAgences();
  }, []);

  // Search logic for agences
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredAgences(agences); // Reset list if query is empty
    } else {
      try {
        const response = await fetchWithAuth(`/api/agences/search?mc=${query}`);
        if (!response || !response.ok) throw new Error('Search failed.');

        const data = await response.json();
        setFilteredAgences(data);
      } catch (error) {
        console.error('Error searching agences:', error.message);
      }
    }
  };

  const handleAddAgence = () => {
    navigate('/add-agence'); // Navigate to Add Agence page
  };

  return (
    <div className="p-6">
      {/* Search Bar and Add Button */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search agences..."
          className="w-1/3 border rounded px-3 py-2 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {/* Conditionally show Add Agence button if user is admin */}
        {isAdmin && (
          <button
            onClick={handleAddAgence}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            + Add Agence
          </button>
        )}
      </div>

      {/* Agence List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAgences.length > 0 ? (
          filteredAgences.map((agence) => (
            <AgenceCard key={agence.id} agence={agence} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No agences found.</p>
        )}
      </div>
    </div>
  );
};

export default AgenceList;
