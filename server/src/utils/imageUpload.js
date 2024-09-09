const cloudinary = require("cloudinary").v2;

async function uploadToCloudinary(imageBuffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "reviews" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(imageBuffer);
  });
}
function base64ToBuffer(base64Data) {
  const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  const buffer = Buffer.from(matches[2], "base64");
  return buffer;
}

async function uploadImage(imageData) {
  if (!imageData) return null;

  try {
    const imageBuffer = base64ToBuffer(imageData);
    const uploadResult = await uploadToCloudinary(imageBuffer);
    return {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}

module.exports = { uploadToCloudinary, base64ToBuffer, uploadImage };
