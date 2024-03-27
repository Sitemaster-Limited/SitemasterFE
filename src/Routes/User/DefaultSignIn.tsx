import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DefaultSignIn = () => {
  const [siteId, setSiteId] = useState('');
  const [clientId, setClientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use useNavigate hook

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior
    setLoading(true);
    setError('');
    try {
      // Navigate to the site page with siteId and clientId as query parameters
      navigate(`/login/site?siteId=${encodeURIComponent(siteId)}&clientId=${encodeURIComponent(clientId)}`);
    } catch (error) {
      setError('Failed to fetch site details. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center h-screen"> {/* Change div to form */}
      <input
        type="text"
        value={siteId}
        onChange={(e) => setSiteId(e.target.value)}
        placeholder="Site ID"
        className="mb-4 p-2 border"
        required // Ensure the input is required
      />
      <input
        type="text" // Change to email type for better validation
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        placeholder="Client ID"
        className="mb-4 p-2 border"
        required // Ensure the input is required
      />
      <button
        type="submit" // Ensure button is of type submit
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Go to Site'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default DefaultSignIn;

