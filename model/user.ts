import * as mongoose from 'mongoose';
import { PassportLocalSchema} from 'mongoose';
import * as passportLocalMongoose from 'passport-local-mongoose';


const UserSchema = new mongoose.Schema({
    fullname:{
        type:String,
        default:'',
    },
    admin:{
        type:Boolean,
        default:false
    },
    confirmed:{
        type:Boolean,
        default:false
    }
});


UserSchema.plugin(passportLocalMongoose);

const User: mongoose.PassportLocalModel<mongoose.PassportLocalDocument> = mongoose.model('User',UserSchema as PassportLocalSchema);

export default User;