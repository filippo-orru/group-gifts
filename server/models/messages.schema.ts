import { defineMongooseModel } from '#nuxt/mongoose';

export interface DbMessage {
    groupId: string;
    authorId: string;
    content: string;
    date: Date;
}

export const MongoMessages = defineMongooseModel<DbMessage>({
    name: 'messages',
    schema: {
        groupId: {
            type: 'string',
            required: true,
        },

        authorId: {
            type: 'string',
            required: true,
        },
        content: {
            type: 'string',
            required: true,
        },
        date: {
            type: 'date',
            required: true,
        },
    },
    options: {

    },
    hooks(schema) {

    },
})
