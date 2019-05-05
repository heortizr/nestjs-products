import { Schema } from 'mongoose';

export const userSchema = new Schema({
    username: String,
    password: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
