import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "./image-upload.js";

const fileUpload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function(req, file, cb) {
            const fileName = `${Date.now()}-${file.originalname}`;
            cb(null, `messages/files/${fileName}`);
        },
    }),
    limits: {fileSize: 10 * 1024 * 1024},
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg|jpeg|pdf|docx|zip|txt)$/)) {
            return cb(new Error("Formato de arquivo não suportado."))
        }
        cb(undefined, true)
    }
})

export {
    fileUpload
}