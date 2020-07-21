import * as express from 'express';
const categoryRouter = express.Router();
import {default as BookModel} from '../model/book';
import CategoryModel, {default as category} from '../model/category';
import * as authenticate from '../authenticate';
import {default as corsWithOptions} from '../cors1';
import * as cors from 'cors'; 

categoryRouter.route('/')
.options(corsWithOptions,(req,res) => { res.sendStatus(200);})
.get(cors(),(req,res,next) => {
    CategoryModel.find()
    .then((category) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(category);
    },(err) => next(err))
})
.post(cors(),(req,res,next) => {
    CategoryModel.create(req.body)
    .then((category) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(category);
    },(err) => next(err))
    .catch((err) => next(err));
})
.put(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on category');
})

.delete(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    CategoryModel.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err) => next(err))
        .catch((err) => next(err));
});

categoryRouter.route('/:category')
.options(corsWithOptions,(req,res) => { res.sendStatus(200);})
.get(cors(),(req,res,next) => {
    CategoryModel.find({category:req.params.category})
    .then((category) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(category);
    },(err) => next(err))
    .catch((err) => next(err));
})
.post(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('Post Operation not supported');
})
.put(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    CategoryModel.findByIdAndUpdate(req.params.category,{
        $set:req.body
    },{new:true})
    .then((category) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(category);
    },(err) => next(err))
    .catch((err) => next(err));
})
.delete(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    CategoryModel.findByIdAndRemove(req.params.category)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err) => next(err));
});

categoryRouter.route('/:category/books')
.options(corsWithOptions,(req,res) => { res.sendStatus(200);})
.get(cors(),(req,res,next) => {
    BookModel.find({category:req.params.category})
    .populate('comments.user')
    .then((books) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(books);
    },(err) => next(err))
    .catch((err) => next(err));
});

export default categoryRouter;