import * as passport from 'passport';
import * as passportlocal from 'passport-local';
import * as passportjwt from 'passport-jwt';
import {default as User} from './model/user';
import * as jwt from 'jsonwebtoken';
require('dotenv').config();



const JwtStrategy = passportjwt.Strategy;
const ExtractJwt = passportjwt.ExtractJwt;
const LocalStrategy = passportlocal.Strategy;

  

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser);

export const getToken = function(user) {
    return jwt.sign(user,process.env.SECRET_KEY,
        {expiresIn: 3600});
}

var opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.SECRET_KEY
}

export const jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload,done) => {
        console.log('JWT Payload',jwt_payload);
        User.findOne({_id: jwt_payload._id},(err,user) => {
            if(err){
                return done(err,false);
            }else if(user){
                return done(null,user);
            }
            else{
                return done(null,false);
            }
        });
    }));
    interface ErrorWithStatus{
        status?: number;
    }
    

export const verifyUser = passport.authenticate('jwt',{session:false});
export const verifyAdmin = ((req,res,next) => {
    if (req.user.admin === true){
        return next();
    }else{
        var err = new Error('You are not authorized') as ErrorWithStatus;
        err.status = 404;
        return next(err);
    }
});