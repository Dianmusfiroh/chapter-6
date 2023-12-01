const router = require('express').Router();
const { verifyToken, protectedRoute, MediaProcessing, storageVideo, storageFiles, qrcode,imagekitUpload, MediaProcessingImages } = require(
'../controller/user.controller'
    )

const storage = require('../libs/multer');
router.post('/image',storage.image.single('image'), MediaProcessing );
router.post('/videos', storage.video.single('video'), storageVideo);
router.post('/files', storage.file.single('file'), storageFiles);
router.get('/qr', qrcode)

const multer = require('multer')();
router.post('/imagekit', multer.single('image'), imagekitUpload);
router.post('/images', storage.image.array('images',3), MediaProcessingImages)
router.get('/ping',(req, res, next) => {
    console.log(req)
    res.json({
        "data": null,
        "message": "PONG",
        "status": 200
    })
})
router.get('/protected-route', verifyToken, protectedRoute);

module.exports = router;