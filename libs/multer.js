const multer = require('multer');
const path = require('path');


function filename(req, file, callback) { 
    const fileName = Date.now() + path.extname(file.originalname);
    callback(null, fileName);
}

const generatorStorage = (dest) => {

    return multer.diskStorage({
        destination: (req, res, cb)=>{
            cb(null,dest);
        },
        filename
    })
    
}

module.exports = {
    image: multer({
        storage: generatorStorage('./public/images'),
        fileFilter: (req, file, cb) => {
            const allowMimeTypes = ['image/jpeg', 'image/png', 'image/jpg']
            if (allowMimeTypes.includes(file.mimetype)) {
                cb(null,true);
            } else {
                const err = new Error(`only ${allowMimeTypes.join(',')} allowed to upload files`);
                cb(err, false)
            }
        },
        limits: {
            fileSize: 1048579
        },
        onError: (err, next) => {
            next(err)
        }
    }),
    video: multer({
        storage: generatorStorage('./public/videos'),
        fileFilter: (req, file, callback) => {
            const allowedMimeTypes = ['video/mp4', 'video/x-msvideo', 'video/quicktime'];

            if (allowedMimeTypes.includes(file.mimetype)) {
                callback(null, true);
            } else {
                const err = new Error(`Only ${allowedMimeTypes.join(', ')} allowed to upload!`);
                callback(err, false);
            }
        },
        onError: (err, next) => {
            next(err);
        }
    }),
    file: multer({
        storage: generatorStorage('./public/files'),
        fileFilter: (req, file, callback) => {
            const allowedMimeTypes = ['application/pdf'];

            if (allowedMimeTypes.includes(file.mimetype)) {
                callback(null, true);
            } else {
                const err = new Error(`Only ${allowedMimeTypes.join(', ')} allowed to upload!`);
                callback(err, false);
            }
        },
    
        onError: (err, next) => {
            next(err);
        }
    }),

}