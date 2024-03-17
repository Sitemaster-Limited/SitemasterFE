const GetSite = async (siteId: string, clientId: string) => {

  try {

    const response = await fetch(`${process.env.REACT_APP_BE_URL}/Client/getSite?siteId=${encodeURIComponent(siteId)}&clientId=${encodeURIComponent(clientId)}`, {
      method: 'GET', // Change method to PUT
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw { status: response.status, message: `HTTP error! Status: ${response.status}` };
    }

    const site = await response.json();
    console.log(site);
    return site;
  } catch (error: any) {
    // use FE Logger when set up ('Error posting profile data')
    return null;
  }

};

export default GetSite;
