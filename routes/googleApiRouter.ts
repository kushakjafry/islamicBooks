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
import { GridRowStyleBuilder } from '@angular/flex-layout/grid/typings/row/row';

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
        sort:'-ga:TotalEvents',
        filters:'ga:eventLabel==search_term',
        "max-results":6
      },
      (err,result) => {
        if(result){
          var SearchData = [];
          var searchKeyData = [];
          result.data.rows.forEach(el => {
              SearchData.push(el[0]);
              searchKeyData.push(el[3]);
          });
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json({search:SearchData,Key:searchKeyData});
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
        sort:'-ga:TotalEvents',
        filters:'ga:eventLabel==books_opened',
        "max-results":6
      },
      (err,result) => {
        if(result){
          var BookData = [];
          var SearchData = [];
          result.data.rows.forEach(el => {
              BookData.push(el[0])
              SearchData.push(el[3]);
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
  googleApiRouter.route('/pages')
  .get(cors(),authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    google.analytics('v3').data.ga.get(
      {
        auth: jwt,
        ids: 'ga:' + process.env.VIEW_ID,
        "start-date":'20daysAgo',
        "end-date":'today',
        metrics:'ga:pageviews',
        dimensions:'ga:pagePath',
        sort:'-ga:pageviews',
        filters:'ga:pagePathLevel1!=/admin/',
        "max-results":6
      },
      (err,result) => {
        if(result){
          var pageData = [];
          var percentageOfVisits = [];
          var count:number = 0;
          result.data.rows.forEach(el => {
            count = count+parseInt(el[1]);
          })
          result.data.rows.forEach(el => {
            pageData.push(el[0]);
            console.log(el[1]);
            console.log(count+'count');
            var percent = (parseInt(el[1])*100)/count;
            percentageOfVisits.push(percent);
          })
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json({page:pageData,percent:percentageOfVisits});
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