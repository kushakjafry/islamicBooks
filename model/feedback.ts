import * as mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    firstname:{
        type:String,
        minlength:2
    },
    lastname:{
        type:String,
        minlength:2
    },
    telnum:{
        type:Number
    },
    email:{
        type:String
    },
    contacttype:{
        type:String
    },
    message:{
        type:String
    }
},{
    timestamps:true
});

const FeedbackModel = mongoose.model('Feedback',feedbackSchema);

export default FeedbackModel;