import * as cors from 'cors';
import * as express from 'express';
const app = express();

const whiteList = ['https://islamic-books.herokuapp.com/'];
export var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    console.log(req.header('Origin'));
    if(whiteList.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};
// exports = cors();
export default cors(corsOptionsDelegate);


