import {S3Upload} from "../Utility/GlobalTypes";

const PostImages = async (
  siteId: string | undefined,
  client: string | undefined,
  images: File[] | null,
  token: string,
  type: string,
): Promise<string | null> => {
  try {

    if (!images || images.length === 0) {
      return null; // No images to upload, return early
    }

    const formData = new FormData();
    formData.append("SiteId", siteId || "default");
    formData.append("Type", type);
    formData.append("Client", client || "default");
    console.log(images.length);
    for (let i = 0; i < images.length; i++) {
      formData.append("Images", images[i]);
    }

    const response = await fetch(`${process.env.REACT_APP_BE_URL}/S3`, {
      method: 'POST',
      headers: {
        //Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
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