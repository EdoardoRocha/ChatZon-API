import multer from "multer";
import path from "path";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

//S3 Cliente config
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

const imageUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            const fileName = `${Date.now() + String(Math.floor(Math.random() * 1000))}${path.extname(file.originalname)}`
            cb(null, `users/${fileName}`)
        },
    }),
    limits: {
        fileSize: 2000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error("Por favor, envie apenas arquivos png ou jpg!"))
        }
        cb(undefined, true);
    }
})

export { imageUpload, s3 };