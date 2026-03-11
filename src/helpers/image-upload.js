import multer from "multer";
import path from "path";


const imageStore = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/images/users')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStore,
    limits: {
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error("Por favor, envie apenas jpg ou png"))
        }

        cb(undefined, true)
    }
})

export { imageUpload };