
const GetSite = async (siteId: string, clientId: string) => {

  try {

    console.log("Site Id from Get: " + clientId);
    // Do not encode clientId, it is already encoded
    const response = await fetch(`${process.env.REACT_APP_BE_URL}/Client/getSite?siteId=${encodeURIComponent(siteId)}&clientId=${encodeURIComponent(clientId)}`, {
      method: 'GET', // Change method to PUT
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw { status: response.status, message: `HTTP error! Status: ${response.status}` };
    }

    return await response.json();
  } catch (error: any) {
    // use FE Logger when set up ('Error posting profile data')
    return null;
  }

};

export default GetSite;
