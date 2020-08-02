import * as express from 'express';
const fileUploadRouter = express.Router();
import * as authenticate from '../authenticate';
import {default as corsWithOptions} from '../cors1';
import * as cors from 'cors';
import {google} from 'googleapis';
import * as stream from 'stream';
import * as fileUpload from 'express-fileupload';
require('dotenv').config();
fileUploadRouter.use(fileUpload());


interface ErrorWithStatus{
    status?: number;
}

const scopes = 'https://www.googleapis.com/auth/drive'
const jwt = new google.auth.JWT(
process.env.CLIENT_EMAIL,
null,
process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
scopes
)


jwt.authorize((err,response)=>{
  fileUploadRouter.route('/bookImage')
  .options(corsWithOptions,(req,res) => { res.sendStatus(200);})
  .post(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req:any,res,next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    let sampleFile = req.files.file;
    console.log(req.files.file);
    const readStream = stream.Readable.from(sampleFile.data);
    console.log(readStream);

    const drive = google.drive({version:'v3',auth:jwt});
    drive.files.create({
      media:{
        mimeType: sampleFile.mimetype,
        body: readStream
      },
      requestBody:{
        "name":sampleFile.name,
        "parents":[
          "14uVu-8mi7CUpC6KEbc1HYNitTrdAkNa6"
        ]
      }
    }, (err, file:any) => {
      if (err) {
        next(err);
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({file:{name:file.data.name,id:file.data.id}});
      }
    });
  })

fileUploadRouter.route('/book')
  .options(corsWithOptions,(req,res) => { res.sendStatus(200);})
  .post(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req:any,res,next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    let Book = req.files.file;
    console.log(req.files.file);
    const readStream = stream.Readable.from(Book.data);
    console.log(readStream);

    const drive = google.drive({version:'v3',auth:jwt});
    drive.files.create({
      media:{
        mimeType: Book.mimetype,
        body: readStream
      },
      requestBody:{
        "name":Book.name,
        "parents":[
          "1Il_82bVEYQ5t_CzF46QFNwaSVUilG5GW"
        ]
      }
    }, (err, file:any) => {
      if (err) {
        next(err);
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({file:{name:file.data.name,id:file.data.id}});
      }
    });
  });
  fileUploadRouter.route('/category')
  .options(corsWithOptions,(req,res) => { res.sendStatus(200);})
  .post(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req:any,res,next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    let Category = req.files.file;
    console.log(req.files.file);
    const readStream = stream.Readable.from(Category.data);
    console.log(readStream);

    const drive = google.drive({version:'v3',auth:jwt});
    drive.files.create({
      media:{
        mimeType: Category.mimetype,
        body: readStream
      },
      requestBody:{
        "name":Category.name,
        "parents":[
          "1pSmKeGzJMbz3g4YBwvksTQPcCFhaPfvQ"
        ]
      }
    }, (err, file:any) => {
      if (err) {
        next(err);
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({file:{name:file.data.name,id:file.data.id}});
      }
    });
  });
  fileUploadRouter.route('/deleteBookImage')
  .options(corsWithOptions,(req,res) => { res.sendStatus(200);})
  .delete(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req:any,res,next) => {
    console.log('came to delete image');
    const drive = google.drive({version:'v3',auth:jwt});
    drive.files.delete({
      fileId:req.query.id
    },(err,file:any) => {
      if(err){
        console.log('err to delete image');
        next(err);
      }else{
        console.log('deleted image');
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({file:'deleted'})
      }
    })
  })
  fileUploadRouter.route('/deleteBook')
  .options(corsWithOptions,(req,res) => { res.sendStatus(200);})
  .delete(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req:any,res,next) => {
    console.log('came to delete book');
    const drive = google.drive({version:'v3',auth:jwt});
    drive.files.delete({
      fileId:req.query.id
    },(err,file:any) => {
      if(err){
        console.log('err to delete book');
        next(err);
      }else{
        console.log('deleted book');
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({file:'deleted'})
      }
    })
  })
fileUploadRouter.route('/deleteCategory')
  .options(corsWithOptions,(req,res) => { res.sendStatus(200);})
  .delete(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req:any,res,next) => {
    const drive = google.drive({version:'v3',auth:jwt});
    drive.files.delete({
      fileId:req.query.id
    },(err,file:any) => {
      if(err){
        next(err);
      }else{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({file:'deleted'})
      }
    })
  })
});


export default fileUploadRouter