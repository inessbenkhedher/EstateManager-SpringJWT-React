import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState(""); // État pour l'email
  const [password, setPassword] = useState(""); // État pour le mot de passe
  const [error, setError] = useState(""); // État pour les erreurs
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Réinitialise les erreurs

    try {
      // Requête POST vers le backend
      const response = await axios.post("/api/login", {
        email,
        password,
      });

      // Stocke le token JWT dans localStorage
      const token = response.data.token;
      console.log("Token reçu :", token); // Debug : affiche le token dans la console
      localStorage.setItem("token", token);

      // Redirection vers la page protégée après succès
      navigate("/home");
    } catch (err) {
      console.error("Erreur lors du login :", err);
      setError("Échec de la connexion. Vérifiez vos identifiants.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Connexion</h2>
        <form onSubmit={handleLogin}>
          {/* Champ Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez votre email"
              required
            />
          </div>
          {/* Champ Mot de passe */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>
          {/* Bouton de connexion */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
          >
            Se connecter
          </button>
        </form>
        {/* Affichage des erreurs */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <div className="text-center mt-4">
          <p className="text-gray-700">
            Vous n'avez pas un compte?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Créez un compte
            </Link>
          </p>
        </div>


      </div>
    </div>
  );
};

export default Login;
