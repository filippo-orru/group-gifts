import { defineMongooseModel } from '#nuxt/mongoose';
import type { Types } from 'mongoose';

export interface DbChatMessage {
    groupId: string;
    memberId: string;
    authorId: string;
    content: string;
    date: Date;
}

export const MongoMessages = defineMongooseModel<DbChatMessage>({
    name: 'messages',
    schema: {
        groupId: {
            type: 'string',
            required: true,
        },
        memberId: {
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

export const toClientMessage = (dbMessage: DbChatMessage & { _id: Types.ObjectId }): ChatMessage => ({
    id: dbMessage._id.toHexString(),
    groupId: dbMessage.groupId,
    memberId: dbMessage.memberId,
    authorId: dbMessage.authorId,
    content: dbMessage.content,
    date: dbMessage.date.getTime(),
    isRead: false, // TODO
});