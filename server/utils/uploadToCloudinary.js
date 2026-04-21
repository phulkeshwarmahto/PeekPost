import { hasCloudinaryConfig, cloudinary } from "../config/cloudinary.js";

export const uploadToCloudinary = async (file, folder = "peekpost") => {
  if (!file) {
    throw new Error("File is required");
  }

  if (!hasCloudinaryConfig) {
    const mime = file.mimetype || "image/jpeg";
    const type = mime.startsWith("video") ? "video" : "image";

    return {
      url: `https://placehold.co/900x900?text=${encodeURIComponent("PeekPost " + type)}`,
      publicId: `mock/${Date.now()}`,
      type,
    };
  }

  const asDataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  const uploadResponse = await cloudinary.uploader.upload(asDataUri, {
    folder,
    resource_type: "auto",
  });

  return {
    url: uploadResponse.secure_url,
    publicId: uploadResponse.public_id,
    type: uploadResponse.resource_type === "video" ? "video" : "image",
  };
};