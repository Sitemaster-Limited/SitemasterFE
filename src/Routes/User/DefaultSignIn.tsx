import React, {useState} from 'react';
import GetSite from "../../Services/GetSite";

const DefaultSignIn = () => {
  const [siteId, setSiteId] = useState('');
  const [clientId, setClientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetSiteClick = async () => {
    setLoading(true);
    setError('');
    try {
      const siteData = await GetSite(siteId, clientId);
    } catch (error) {
      setError('Failed to fetch site details. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <input
          type="text"
          value={siteId}
          onChange={(e) => setSiteId(e.target.value)}
          placeholder="Site ID"
          className="mb-4 p-2 border"
        />
        <input
          type="text"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          placeholder="Client ID"
          className="mb-4 p-2 border"
        />
        <button
          onClick={handleGetSiteClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Get Site'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </>
  );
};

export default DefaultSignIn;
