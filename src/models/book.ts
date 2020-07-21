import { Comment } from './comments';

export class Book  {
   name:String;
   author:String;
   image:String;
   genre:String;
   rating:number;
   Comments:[Comment];
}