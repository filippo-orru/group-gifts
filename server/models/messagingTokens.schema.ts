import { defineMongooseModel } from "#nuxt/mongoose";
import { Schema, Types } from "mongoose";

export interface DbMessagingToken {
    _id: string; // token
    messagingToken: string;
}

export const MongoMessagingTokens = defineMongooseModel<DbMessagingToken>({
    name: 'messagingTokens',
    schema: {
        _id: {
            type: 'string',
            required: true,
        },
        messagingToken: {
            type: 'string',
            required: true,
        },
    },
    options: {

    },
    hooks(schema) {

    },
})