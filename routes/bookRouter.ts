import * as express from 'express';
const bookRouter = express.Router();
import {default as BookModel} from '../model/book';
import * as authenticate from '../authenticate';
import {default as corsWithOptions} from '../cors1';
import * as cors from 'cors'; 
declare global {
namespace Express {
    interface User {
        _id:any;
        username:any;
        confirmed:boolean;
        resetTime:Date;
    }
}
}

interface ErrorWithStatus{
    status?: number;
}

bookRouter.route('/')
.options(corsWithOptions,(req,res) => { res.sendStatus(200);})
.get(cors(),(req,res,next) => {
    console.log(req.user);
    BookModel.find(req.query)
    .populate('comments.user')
    .then((books) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(books);
    },(err) => next(err))
    .catch((err) => next(err));
})
.post(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    BookModel.create(req.body)
    .then((book) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(book);
    },(err) => next(err))
    .catch((err) => next(err));
})
.put(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on books');
})

.delete(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    BookModel.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err) => next(err))
        .catch((err) => next(err));
});

bookRouter.route('/:bookName')
.options(corsWithOptions,(req,res) => {
    res.sendStatus(200);
})
.get(cors(),(req,res,next) => {
    BookModel.findOne({name:req.params.bookName})
    .populate('cooments.user')
    .then((book) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(book);
    },(err) => next(err));
})
.post(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('Post Operation not supported');
})
.put(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    BookModel.findOneAndUpdate({name:req.params.bookName},{
        $set:req.body
    },{new:true})
    .then((book) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(book);
    },(err) => next(err))
    .catch((err) => next(err));
})
.delete(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    BookModel.findOneAndRemove({name:req.params.bookName})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err) => next(err));
});

bookRouter.route('/:bookName/comments')
.options(corsWithOptions,(req,res) => {
    res.sendStatus(200);
})
.get(cors(),(req,res,next) => {
    BookModel.findOne({name:req.params.bookName})
    .populate('comments.user')
    .then((book:any) => {
        if(book != null){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(book.comments);
        }else{
            var err=new Error('Book' + req.params.bookName + 'not found') as ErrorWithStatus;
            err.status = 404;
            return next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err));
})
.post(corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    BookModel.findOne({name:req.params.bookName})
        .then((book:any) => {
            if(book != null){
                req.body.user = req.user._id;
                book.comments.push(req.body);
                book.save()
                .then((book) => {
                    BookModel.findById(book)
                    .populate('comments.user')
                    .then((book) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(book);
                    })
                   
                },(err) => next(err))
            }else{
                var err = new Error('Book ' + req.params.bookName + ' not found') as ErrorWithStatus;
                err.status = 404;
                return next(err);
            }
        },(err) => next(err))
        .catch((err) => next(err));
})
.put(corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    res.statusCode=403;
    res.end('Put operation not supported on books '+req.params.bookName);
})
.delete(corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    BookModel.findOne({name:req.params.bookName})
        .then((book:any) => {
            if(book != null){
                    for(var i = (book.comments.length - 1); i>=0 ; i--){
                        book.comments.id(book.comments[i]._id).remove()
                    }
                    book.save()
                    .then((book) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(book);
                    },(err) => next(err))
        }else{
                var err = new Error('Book ' + req.params.bookName + ' not found') as ErrorWithStatus;
                err.status = 404;
                return next(err);
            }
        },(err) => next(err))
            .catch((err) => next(err));
});

bookRouter.route('/:bookName/comments/:commentId')
.options(corsWithOptions,(req,res) => { res.sendStatus(200); })
.get(cors(),(req,res,next) => {
    BookModel.findOne({name:req.params.bookName})
    .populate('comments.user')
    .then((book:any) => {
        if(book != null && book.comments.id(req.params.commentId) != null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(book.comments.id(req.params.commentId));
        }else if(book == null){
            var err = new Error('book ' + req.params.bookName + ' not found') as ErrorWithStatus;
            err.status = 404;
            return next(err);
        }else{
            var err = new Error('Comment ' + req.params.commentId+ ' not exists. ') as ErrorWithStatus;
            err.status= 404;
            return next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err));   
})
.post(corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /books/'+ req.params.bookName+'/comments'+req.params.commentId);
})
.put(corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    BookModel.findOne({name:req.params.bookName})
    .then((book:any) => {
        if(book != null && book.comments.id(req.params.commentId) != null){
            if((book.comments.id(req.params.commentId).user).equals(req.user._id)){
                if(req.body.rating){
                    book.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if(req.body.comment){
                    book.comments.id(req.params.commentId).comment = req.body.comment;
                }
                book.save()
                    .then((book) => {
                        BookModel.findById(book._id)
                        .populate('comments.user')
                        .then((book)=>{
                            res.statusCode=200;
                            res.setHeader('Content-Type','application/json');
                            res.json(book);
                        })
                    },(err) => next(err))
            }else{
                var err = new Error('You are not authorized to update this comment') as ErrorWithStatus;
                err.status = 403;
                next(err);
            }
        }else if(book == null){
            var err = new Error('Book ' + req.params.bookName + ' not found') as ErrorWithStatus;
            err.status = 404;
            return next(err);
        }else{
            var err = new Error('Comment ' + req.params.commentId+ ' not exists. ') as ErrorWithStatus;
            err.status= 404;
            return next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err));
})
.delete(corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    BookModel.findOne({name:req.params.bookName})
        .then((book:any) => {
            if(book != null && book.comments.id(req.params.commentId) != null){
                if((book.comments.id(req.params.commentId).user).equals(req.user._id)){
                    book.comments.id(req.params.commentId).remove();
                    book.save()
                    .then((book:any) => {
                        BookModel.findById(book._id)
                        .populate('comments.user')
                        .then((book)=>{
                            res.statusCode=200;
                            res.setHeader('Content-Type','application/json');
                            res.json(book);
                        })
                    },(err) => next(err))
                }else{
                    var err = new Error('You are not authorized to delete this comment') as ErrorWithStatus;
                    err.status = 403;
                    next(err);
                }
            }else if(book == null){
                var err = new Error('Book ' + req.params.bookName + ' not found') as ErrorWithStatus;
                err.status = 404;
                return next(err);
            }else{
                var err = new Error('Comment ' + req.params.commentId+ ' not exists. ') as ErrorWithStatus;
                err.status= 404;
                return next(err);
            }
        },(err) => next(err))
            .catch((err) => next(err));
});

export default bookRouter;