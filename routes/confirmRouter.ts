import * as express from 'express';
const confirmRouter = express.Router();
import {default as User} from '../model/user';
import * as authenticate from '../authenticate';
import * as jwt from 'jsonwebtoken';
require('dotenv').config();

confirmRouter.get('/',(req,res,next) => {
    var token = req.query.q;
    console.log(token);
    let decoded:any = jwt.verify(<string>token,process.env.SECRET_KEY);
    let id = decoded.id;
    console.log(id);
    User.findById(id)
    .then((user:any) => {
        user.confirmed = true;
        user.save()
        .then((user:any) => {
            var jwtToken = authenticate.getToken({_id: user._id});
            res.setHeader('Content-Type','application/json');
            res.json({success:true,username:user.username,token:jwtToken});
        },err => next(err))
    },err => next(err))
    .catch((err) => next(err));
})


export default confirmRouter;