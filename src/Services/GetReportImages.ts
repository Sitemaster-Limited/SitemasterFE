const GetReportImages = async (imagePaths: string[]) => {
  try {
    // Join the image paths into a single string separated by commas
    const pathsString = imagePaths.map(path => encodeURIComponent(path)).join(',');

    const url = `${process.env.REACT_APP_BE_URL}/Report/getReportImages?imagePaths=${pathsString}`;

    const response = await fetch(url, {
      method: 'GET',
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

export default GetReportImages;
