import { ProgressReport } from "../Utility/GlobalTypes";

const PutProgress = async (
  clientId: string,
  siteId: string,
  reportId: string,
  page: string,
  images: File[] | null,
  updateReport: ProgressReport,
): Promise<string | null> => {
  try {
    const formData = new FormData();

    if (images && images.length > 0) {
      images.forEach(image => {
        formData.append("images", image);
      });
    }

    formData.append('updatedReport', JSON.stringify(updateReport));

    const response = await fetch(`${process.env.REACT_APP_BE_URL}/Report/updateReport?clientId=${encodeURIComponent(clientId)}&siteId=${encodeURIComponent(siteId)}&reportId=${encodeURIComponent(reportId)}&page=${encodeURIComponent(page)}`, {
      method: 'PUT',
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

export default PutProgress;