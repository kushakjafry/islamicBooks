import * as express from 'express';
const router = express.Router();
import {default as User} from '../model/user';
import * as authenticate from '../authenticate';
import {default as corsWithOptions} from '../cors1';
import * as cors from 'cors';
import * as passport from 'passport';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';
import { baseURL } from 'src/app/shared/baseurl';
require('dotenv').config();

interface ErrorWithStatus{
    status?: number;
}

router.options('*',corsWithOptions,(req,res) => {
    res.statusCode = 200;
  })
  router.get('/',corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    var users =[];
    User.find({})
    .then((user) => {
      console.log(user.length);
        for(var i=0;i<user.length;i++){
        users.push(user[i]);
        }
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(users);
    },(err) => next(err));
  });
  
  router.post('/signup',corsWithOptions, (req, res, next) => {
    User.register(new User({username: req.body.username}), 
      req.body.password, (err, user) => {
      if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      }
      else {
        if(req.body.fullname)
        user.fullname = req.body.fullname;
        user.save((err,user)=>{
          if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type','applicaion/json');
            res.json({err:err});
            return;
          }
          passport.authenticate('local')(req, res, () => {
            let id = {id: req.user._id};
            var token = jwt.sign(id,process.env.SECRET_KEY);
            var url = 'https://islamic-books.herokuapp.com/confirm?q='+token;
            console.log(url);
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
              }
            });
            var mailOptions = {
              from: process.env.EMAIL,
              to: req.user.username,
              subject: 'Confirmation Email Ilm-O-Fikr',
              html:'<h1>Confirm your email</h1><p> Please click the below link to confirm your email</p><p><a href='+url+'>'+url+'</a>'
            };
            
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Confirm your Email!'});
          });
        });
      }
    });
  });
  
  router.post('/login',corsWithOptions, (req, res,next) => {
  
    passport.authenticate('local',(err,user,info) => {
      if(err)
        return next(err);
      
        if(!user){
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: 'Login Unsuccessful',err: info});
        }
        req.logIn(user, (err) => {
          if(err){
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, status: 'Login Unsuccessful',err: 'Could not login user'});
          }
          if(req.user.confirmed){
            var token = authenticate.getToken({_id: req.user._id});
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Login Successful',token:token});
          }
          else{
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, status: 'Login Unsuccessful',err: 'Email not confirmed'});
          }
        })
    })(req,res,next);
   
  });
  
  router.get('/checkJWTToken',corsWithOptions,(req,res,next) => {
    passport.authenticate('jwt',{session: false},(err,user,info) => {
      if(err)
      return next(err);
  
      if(!user){
        res.statusCode = 401;
        res.setHeader('Content-Type','application/json');
        return res.json({status: 'JWT invalid',success:false,err:info})
      }
      else{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        return res.json({status: 'JWT valid',success:true,user:user})
      }
    })(req,res);
  })
  
  export default router;
