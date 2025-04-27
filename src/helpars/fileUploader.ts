import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ICloudinaryResponse, IFile } from "../app/interfaces/file";
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

const uploadToCloudinary = async (file: IFile):Promise<ICloudinaryResponse | undefined> => {
  // console.log("cloudinary",file);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error:Error, result:ICloudinaryResponse) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const fileUplader = {
  upload,
  uploadToCloudinary,
};
