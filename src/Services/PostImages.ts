
const PostImages = async (
  siteId: string,
  client: string,
  blueprints: File[] | null,
  qrCode: File[] | null,
  token: string,
  type: string, // redundant for POST but needed for GET
): Promise<string | null> => {
  try {

    if ((!blueprints || blueprints.length === 0) && !qrCode) {
      console.log('No QR Code or blueprints to upload.');
      return null; // Nothing to upload, return early
    }

    const formData = new FormData();
    formData.append("SiteId", siteId);
    formData.append("Type", type);
    formData.append("Client", client);

    if (blueprints && blueprints.length > 0) {
      blueprints.forEach(blueprint => {
        formData.append("Blueprints", blueprint);
      });
    }

    if (qrCode && qrCode.length > 0) {
      qrCode.forEach(qrCode => {
        formData.append("QRCode", qrCode);
      });
    }

    const response = await fetch(`${process.env.REACT_APP_BE_URL}/S3`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw {status: response.status, message: `HTTP error! Status: ${response.status}`};
    }

    const data = await response.json();
    // use FE Logger when set up ('Profile Posted Successfully')
    return data.id;
  } catch (error: any) {
    // use FE Logger when set up ('Error posting profile data')
    return null;
  }
};

export default PostImages;