import * as express from 'express';
const feedbackRouter = express.Router();
import {default as FeedbackModel} from '../model/feedback';
import * as authenticate from '../authenticate';
import {default as corsWithOptions} from '../cors1';
import * as cors from 'cors'; 



feedbackRouter.route('/')
.options(corsWithOptions,(req,res) => { res.sendStatus(200);})
.get(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    FeedbackModel.find(req.query)
    .then((feedbacks) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(feedbacks);
    },(err) => next(err))
    .catch((err) => next(err));
})
.post(corsWithOptions,(req,res,next) => {
    FeedbackModel.create(req.body)
    .then((feedback) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(feedback);
    },(err) => next(err))
    .catch((err) => next(err));
})
.put(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on books');
})

.delete(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    FeedbackModel.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err) => next(err))
        .catch((err) => next(err));
});

feedbackRouter.route('/:feedbackId')
.options(corsWithOptions,(req,res) => {res.sendStatus(200);})
.get(cors(),authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    FeedbackModel.findById(req.params.feedbackId)
    .then((feedback) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(feedback);
    },(err) => next(err));
})
.post(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('Post Operation not supported');
})
.put(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('Put Operation not supported');
})
.delete(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    FeedbackModel.findByIdAndRemove(req.params.feedbackId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err) => next(err));
});

export default feedbackRouter;