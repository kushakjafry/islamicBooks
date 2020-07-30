import * as express from 'express';
const fileUploadRouter = express.Router();
import * as authenticate from '../authenticate';
import {default as corsWithOptions} from '../cors1';
import * as cors from 'cors';
import * as multer from 'multer';

interface ErrorWithStatus{
    status?: number;
}

const storage = multer.diskStorage({
    destination:(req,file,callback) => {
        callback(null,'dist/islamicbooks/browser/assets/images')
    },
    filename: (req,file,callback) => {
        callback(null,file.originalname)
    }
})

var upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    }
  })

fileUploadRouter.route('/')
.post(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,upload.single('file'),(req,res,next) => {
    const file = req.file;
    console.log(file.filename);
    if(!file){
        var error = new Error('Please upload a file') as ErrorWithStatus;
        error.status = 400;
        return next(error);
    }
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json({success:true,file:file})
})

export default fileUploadRouter;