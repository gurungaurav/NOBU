export const fetchAndCreateFile = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    // Extract filename from URL
    const filename = url.substring(url.lastIndexOf("/") + 1);
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};

export const fetchAndCreateFiles = async (urls) => {
  try {
    const filesPromises = urls.map(async (url) => {
      const response = await fetch(url);
      const blob = await response.blob();
      const filename = url.substring(url.lastIndexOf("/") + 1);
      return new File([blob], filename, { type: blob.type });
    });

    return Promise.all(filesPromises);
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
};
