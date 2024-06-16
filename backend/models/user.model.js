// models/user.model.js

import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    picture: {
        type: String
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    newMessages: {
        type: Number,
        default: 0
    }
}, { timestamps: true });  

const User = model('User', userSchema);

export default User;
