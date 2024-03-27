const GetEmployee = async (clientId: string): Promise<string | null> => {
  try {

    const response = await fetch(`${process.env.REACT_APP_BE_URL}/Client/getEmployees?clientId=${encodeURIComponent(clientId)}`, {
      method: 'GET', // Change method to PUT
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    // use FE Logger when set up ('Error posting profile data')
    return null;
  }
};

export default GetEmployee;