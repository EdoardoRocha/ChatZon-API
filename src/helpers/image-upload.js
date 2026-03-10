import multer from "multer";
import path from "path";


const imageStore = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/users')
    }
})