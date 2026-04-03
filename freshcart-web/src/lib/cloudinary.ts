import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (
  file: Blob,
): Promise<Promise<string> | null> => {
  if (!file) {
    return null;
  }
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            reject(error);
          } else {
            resolve(result?.secure_url ?? null);
          }
        },
      );
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default uploadOnCloudinary;