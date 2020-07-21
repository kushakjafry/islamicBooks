import {Comment} from './Comment';

export class Book {
    _id:string;
    name:string;
    author:string;
    image:string;
    description:string;
    category:string;
    rating:number;
    download:string;
    comments:[Comment];
}