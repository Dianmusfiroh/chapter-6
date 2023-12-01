const imagekit = require('../libs/imagekit');
var qr = require('node-qr-image');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { verifyToken } = require('../middleware/auth.middleware');
const protectedRoute = (req, res) => {
    const userId = req.userId;
    console.log(userId);
    res.json({ message: `User ID: ${userId}` });
  };
  
async function MediaProcessing(req,res) {
    const { description, link,
        judul,id_user } = req.body;
    // const {  description ,bank_account_number, balance,user_Id } = req.body
    // const images ={
    //     description ,
    //     bank_account_number,
    //     balance,
    //     user_Id 
    // }
    console.log(description)
    const image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    const newUser = await prisma.image.create({
        data: {
            description :description,
            link : image,
            judul :judul,
            id_user : id_user
        },
      });
    // res.status(200).json({
    //     statusbar: true,
    //     message: 'success',
    //     data : newUser
    // });
    res.json(newUser);
}
function MediaProcessingImages(req,res) {
    let respArray = [];
    console.log(req.files);
    for (let index = 0; index < req.files.length; index++) {
        const filename = req.files[index].filename;
        console.log(filename);
        const image = `${req.protocol}://${req.get('host')}/images/${filename}`;
        respArray.push(image);
    }
    res.status(200).json({
        status: true,
        message: 'success',
        data : respArray,
        error: null
    });
    return
}
function storageVideo(req,res) {
    const video = `${req.protocol}://${req.get('host')}/videos/${req.file.filename}`;
    res.status(200).json({
        statusbar: true,
        message: 'success',
        data : {
            video: video

        }
    });
}
function storageFiles(req,res) {
    const file = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`;
    res.status(200).json({
        statusbar: true,
        message: 'success',
        data : {
            file: file

        }
    });
}

function qrcode(req,res) {
    const message = req.query.massage
    console.log(req.query)
    try {
        var pngString = qr.image(message, { type: 'png' });
        pngString.pipe(require('fs').createWriteStream(`${message.toLowerCase()}.png`));
        res.status(200).json({
            status: true,
            message: 'success',
            data : pngString
        });
    } catch (error) {
        res.status(500).json({
            status: true,
            message: 'internal error',
            data : null,
            error: error.message
        });
    }
}
// function imagekitUpload(req, res) {
   
// }
const imagekitUpload = async (req, res) => {
    try {
        const stringFile = req.file.buffer.toString('base64');

        const uploadFile = await imagekit.upload({
            fileName: req.file.originalname,
            file: stringFile
        });

        return res.json({
            status: true,
            message: 'success',
            data: {
                name: uploadFile.name,
                url: uploadFile.url,
                type: uploadFile.fileType
            }
        });
    } catch (err) {
        throw err;
    }
}
const register = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      console.log(username);
  
      // Validasi data menggunakan Joi
      const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
      });
  
      const { error } = schema.validate({ username, email, password });
  
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Simpan user ke database
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
  
      res.json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
module.exports = {
    MediaProcessing,
    storageVideo,
    storageFiles,
    qrcode,
    imagekitUpload,
    MediaProcessingImages,
    register,
    protectedRoute, verifyToken
}
