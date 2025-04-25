import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: "dn7oeugls",
  api_key: "314765475565271",
  api_secret: "7zgbBLnBRpKa2mIgAb8yxEPpidE", // Click 'View API Keys' above to copy your API secret
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Configuration
// const filePath = path.resolve(__dirname, "../../../../uploads/code-snapshot.png");

const uploadToCloudinary = async (file:any) => {
  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload("e:/Mission-7/Module-60/uploads/code-snapshot.png", {
      public_id: "shoes",
    })
    .catch((error) => {
      console.log(error);
    });

  console.log(uploadResult);
};

export const fileUplader = {
  upload,
  uploadToCloudinary
};
