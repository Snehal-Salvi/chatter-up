import { Schema, model } from 'mongoose';

const MessageSchema = new Schema({
    content: String,
    from: Object,
    socketid: String,
    time: String,
    date: String,
    to: String
},{ timestamps: true });  

const Message = model('Message', MessageSchema);

export default Message;
