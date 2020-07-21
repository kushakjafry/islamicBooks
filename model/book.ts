import * as mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{
    timestamps:true 
})

const bookSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:false
    },
    category:{
        type:String,
        required:false
    },
    download:{
        type:String,
        required:true
    },
    comments: [commentSchema]
},{
    timestamps:true
});

const BookModel = mongoose.model('Book', bookSchema)

export default BookModel;