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
import { verify } from 'crypto';
import { userError } from '@angular/compiler-cli/src/transformers/util';
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
            var url = 'http://localhost:4200/confirm?q='+token;
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
            res.json({success: true, status: 'Login Successful',token:token,admin:user.admin});
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
  });

  router.route('/forgot')
  .options(corsWithOptions,(req,res) => { res.sendStatus(200);})
  .get(corsWithOptions,(req,res,next) => {
    res.statusCode = 404;
    res.end('no such operation available');
  })
  .post(corsWithOptions,(req,res,next) => {
    User.findOne({username:req.body.email})
    .then((user:any) => {
      if(!user){
        var err = new Error('Email not found') as ErrorWithStatus;
        err.status = 404;
        return next(err);
      }
      user.resetTime = Date.now() + 3600000 ;
      user.save()
      .then((user:any) => {
        let id = {id: user._id};
        var token = jwt.sign(id,process.env.SECRET_KEY);
        var url = 'http://localhost:4200/reset?q='+token;
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
          }
        });
        var mailOptions = {
          from: process.env.EMAIL,
          to: req.body.email,
          subject: 'Password Reset IlmOFikr',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          url + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
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
        res.json({success: true, status: 'Check Your Email to change password'});
      },(err) => next(err))
      .catch(err => next(err))
    },(err) => next(err))
    .catch((err) => next(err))
  })
  .put(corsWithOptions,(req,res,next) => {
    res.statusCode = 404;
    res.send('no such operation available');
  })
  .delete(corsWithOptions,(req,res,next) => {
    res.statusCode = 404;
    res.send('no such operation available');
  })

  router.route('/reset')
  .options(corsWithOptions,(req,res) => { res.sendStatus(200);})
  .get(corsWithOptions,(req,res,next) => {
    res.statusCode = 404;
    res.send('no such operation available');
  })
  .post(corsWithOptions,(req,res,next) => {
    var token = req.query.q;
    console.log(token);
    let decoded:any = jwt.verify(<string>token,process.env.SECRET_KEY)
    console.log(decoded);
    let id = decoded.id;
    console.log(id);
    User.findOne({_id:id,resetTime:{ $gt: Date.now() } })
    .then((user) => {
      if(!user){
        res.statusCode = 404;
        res.end('Reset token expired');
      }
      user.setPassword(req.body.password)
      .then((user:any) => {
        user.resetTime = null;
        user.save()
        .then((user) => {
          var jwtToken = authenticate.getToken({_id: user._id});
          res.setHeader('Content-Type','application/json');
          res.json({success:true,username:user.username,token:jwtToken});
        },(err) => next(err))
      },(err) => next(err))
    },((err) => next(err)))
    .catch((err) => next(err));  
  })
  
  
  router.route('/:email')
  .options(corsWithOptions,(req,res) => { res.sendStatus(200);})
  .get(corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    if(req.body.email === req.user.username){
    User.findOne({username:req.params.email})
    .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(user);
    },(err) => next(err))
    .catch((err) => next(err));
  }else{
    res.statusCode = 401;
      res.end('Unauthorised');
    }
  })
  .post(corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    res.end('Post operation not available')
  })
  .put(corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    if(<string>(req.user.username)===(<string>(req.params.email))){
      if(req.body.oldpassword && req.body.newpassword && req.body.fullname){
        User.findOneAndUpdate({username:req.params.email},{
          $set:{fullname:req.body.fullname}
        },{new:true})
        .then((user) => {
          user.changePassword(req.body.oldpassword,req.body.newpassword)
          .then((user) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(user);
          },err => next(err))
        },(err) => next(err))
      }else if(req.body.oldpassword && req.body.newpassword){
        User.findOne({username:req.params.email})
        .then((user) => {
          user.changePassword(req.body.oldpassword,req.body.newpassword)
          .then((user) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(user);
          },err => next(err))
        },(err) => next(err))
        .catch((err) => next(err));
      }else if(req.body.fullname){
        User.findOneAndUpdate({username:req.params.email},{
          $set:{fullname:req.body.fullname}
        },{new:true})
        .then((user) => {
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json(user);
        },(err) => next(err))
        .catch((err) => next(err));
      }else{
        res.statusCode = 401;
        res.end('Only password and name change is allowed')
      }
    }else{
      res.statusCode = 401;
      res.end('Unauthorised');
    }
  })
  .delete(corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    if(req.user.username === req.params.email){
      User.findOneAndRemove({username:req.params.email})
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
      },(err) => next(err))
      .catch((err) => next(err))
    }else{
      res.statusCode = 401;
      res.send('Unauthorised');
    }
  });
  
  export default router;
