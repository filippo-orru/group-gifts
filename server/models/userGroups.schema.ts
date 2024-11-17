import { defineMongooseModel } from "#nuxt/mongoose";
import { Schema, Types } from "mongoose";

export interface DbUserInGroup {
    token: string;
    groupId: Types.ObjectId;
    memberId: string;
}

export const MongoUserGroups = defineMongooseModel<DbUserInGroup>({
    name: 'auth',
    schema: {
        token: {
            type: Schema.Types.String,
            required: true,
        },
        groupId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        memberId: {
            type: Schema.Types.String,
            required: true,
        },
    },
    options: {

    },
    hooks(schema) {

    },
})