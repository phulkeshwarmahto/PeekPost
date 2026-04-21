export const useMediaUpload = () => {
  const fakeUpload = async (file) => {
    const url = URL.createObjectURL(file);
    return {
      url,
      type: file.type.startsWith("video/") ? "video" : "image",
      publicId: `local-${Date.now()}`,
    };
  };

  return { uploadMedia: fakeUpload };
};