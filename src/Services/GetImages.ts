const GetImages = async (siteId: string, clientId: string, type: string) => {
  try {
    const url = `${process.env.REACT_APP_BE_URL}/S3/${encodeURIComponent(clientId)}/${encodeURIComponent(type)}/${encodeURIComponent(siteId)}`;
    const response = await fetch(url, {
      method: 'GET', // Keeping as GET since the backend is expecting GET
      headers: {
        'Content-Type': 'application/json', // This header can actually be omitted for GET requests
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching images:', error);
    return null;
  }
};

export default GetImages;