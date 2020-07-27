import 'zone.js/dist/zone-node';
import 'localstorage-polyfill'

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import {default as bookRouter} from './routes/bookRouter';
import {default as userRouter} from './routes/userRouter';
import {default as feedbackRouter } from './routes/feedbackRouter';
import {default as confirmRouter} from './routes/confirmRouter';
import {default as categoryRouter} from './routes/categoryRouter';
import { join } from 'path';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as authenticate from './authenticate';
global['localStorage'] = localStorage;
require('dotenv').config();


import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const router = express.Router();
  const url = process.env.MONGOURL;
  const connect = mongoose.connect(url,{useNewUrlParser:true});
  connect.then((db) => {
    console.log('connected correctly to server');
  },(err) => console.log(err));

  const distFolder = join(process.cwd(), 'dist/islamicbooks/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
  const adminFolder = join(process.cwd(), 'dist/islamicbooka/browser/admin');
  const adminHtml = existsSync(join(adminFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  server.use(bodyParser.json());
  server.use(passport.initialize());

  // Example Express Rest API endpoints
  server.use('/api/users',userRouter);
  server.use('/api/books',bookRouter);
  server.use('/api/feedback',feedbackRouter);
  server.use('/api/confirm',confirmRouter);
  server.use('/api/category',categoryRouter);
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));
  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
