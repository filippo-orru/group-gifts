import { defineMongooseModel } from '#nuxt/mongoose';
import { Schema } from 'mongoose';

const messageSchema = new Schema({
    members: {
        type: String,
        required: true,
    },

    authorId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    // isRead: {
    //     type: 'boolean',
    //     required: true,
    // },
}, { _id: false });

export const MongoMessages = defineMongooseModel({
    name: 'messages',
    schema: messageSchema,
    options: {

    },
    hooks(schema) {

    },
})
