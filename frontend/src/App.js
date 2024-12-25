import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AgenceList from "./pages/AgenceList";
import AddEditAgence from "./pages/AddEditAgence";
import AddDossierPage from './pages/AddDossierPage';
import BiensList from './pages/BiensList';
import AddEditBien from './pages/AddEditBien';

import Register from "./register/register"; // Import the Register component
import Login from "./register/login"; // Import the Login component
import ClientPage from "./register/Clients";
import InterestedBiensList from "./pages/InterestedBiensList"

// Helper Component to Condition Navbar Rendering
const ConditionalNavbar = ({ children }) => {
  const location = useLocation();
  const hideNavbarPaths = ["/", "/register"]; // Paths where the navbar is hidden

  // Check if the current path is in the hideNavbarPaths array
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <ConditionalNavbar>
          <div className="container mx-auto p-4">
            <Routes>
              {/* Home Page - List of Agences */}
              <Route path="/home" element={<AgenceList />} />
              
              {/* Add/Edit Agence */}
              <Route path="/add-agence" element={<AddEditAgence />} />
              <Route path="/edit-agence/:id" element={<AddEditAgence />} />
              <Route path="/agences/:id/biens" element={<BiensList />} />
              <Route path="/add-bien/:agenceId" element={<AddEditBien />} />
              <Route path="/edit-bien/:agenceId/:bienId" element={<AddEditBien />} />
              <Route path="/add-dossier" element={<AddDossierPage />} />
              {/* User Authentication */}
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Login />} />
              <Route path="/Clients" element={<ClientPage />} />
              <Route path="/interested" element={<InterestedBiensList />} />

            </Routes>
          </div>
        </ConditionalNavbar>
      </div>
    </Router>
  );
}

export default App;
