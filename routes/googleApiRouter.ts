'use strict'
import * as express from 'express';
const router = express.Router();
import {default as User} from '../model/user';
import * as authenticate from '../authenticate';
import {default as corsWithOptions} from '../cors1';
import * as cors from 'cors';
import * as passport from 'passport';
import * as nodemailer from 'nodemailer';
import * as jwt1 from 'jsonwebtoken';
import { baseURL } from '../src/app/shared/baseurl';
import { verify } from 'crypto';
import { userError } from '@angular/compiler-cli/src/transformers/util';
require('dotenv').config();


import {google} from 'googleapis';

const googleApiRouter = express.Router();

const scopes = 'https://www.googleapis.com/auth/analytics.readonly'
const jwt = new google.auth.JWT(
process.env.CLIENT_EMAIL,
null,
process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
scopes
)


jwt.authorize((err, response) =>{
  googleApiRouter.route('/user')
    .get(cors(),authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    google.analytics('v3').data.ga.get(
    {
      auth: jwt,
      ids: 'ga:' + process.env.VIEW_ID,
      'start-date': '10daysAgo',
      'end-date': 'today',
      metrics: 'ga:users',
      dimensions:'ga:date'
    },
    (err, result) => {
      console.log(err, result)
      var user = [];
      for(var i =0;i<11;i++){
        user.push(result.data.rows[i][1])
      }
      var date = [];
      for(var j=0;j<11;j++){
        date.push(result.data.rows[j][0])
      }
      var data = {
        user: user,
        date:date
      }
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(data);
      console.log(data);
    }
  )
})
  googleApiRouter.route('/events/search')
  .get(cors(),authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    google.analytics('v3').data.ga.get(
      {
        auth: jwt,
        ids: 'ga:' + process.env.VIEW_ID,
        "start-date":'20daysAgo',
        "end-date":'today',
        metrics:'ga:TotalEvents',
        dimensions:'ga:EventAction,ga:EventLabel,ga:EventCategory',
        sort:'-ga:TotalEvents'
      },
      (err,result) => {
        if(result){
          var SearchData = [];
          result.data.rows.forEach(el => {
            if(el[1]==='search_term'){
              SearchData.push(el);
            }
          });
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json({search:SearchData});
        }else{
          res.statusCode = 500;
          res.setHeader('Content-Type','application/json');
          res.json(err);
        }
      }
    )
  });
  googleApiRouter.route('/events/bookOpened')
  .get(cors(),authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    google.analytics('v3').data.ga.get(
      {
        auth: jwt,
        ids: 'ga:' + process.env.VIEW_ID,
        "start-date":'20daysAgo',
        "end-date":'today',
        metrics:'ga:TotalEvents',
        dimensions:'ga:EventAction,ga:EventLabel,ga:EventCategory',
        sort:'-ga:TotalEvents'
      },
      (err,result) => {
        if(result){
          var BookData = [];
          var SearchData = [];
          result.data.rows.forEach(el => {
            if(el[1]==='books_opened'){
              BookData.push(el[0])
              SearchData.push(el[3]);
            }
          });
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json({book:BookData,search:SearchData});
        }else{
          res.statusCode = 500;
          res.setHeader('Content-Type','application/json');
          res.json(err);
        }
      }
    )
  })
})

export default googleApiRouter;