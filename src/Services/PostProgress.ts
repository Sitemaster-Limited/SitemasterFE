import { ProgressReport } from "../Utility/GlobalTypes";

const PostProgress = async (
  clientId: string,
  siteId: string,
  images: File[] | null,
  newReport: ProgressReport,
): Promise<string | null> => {
  try {
    const formData = new FormData();

    if (images && images.length > 0) {
      images.forEach(image => {
        formData.append("images", image);
      });
    }

    formData.append('newReport', JSON.stringify(newReport));

    const response = await fetch(`${process.env.REACT_APP_BE_URL}/Report/addReport?siteId=${encodeURIComponent(siteId)}&clientId=${encodeURIComponent(clientId)}}`, {
      method: 'POST',
      body: formData,
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

export default PostProgress;