import { defineMongooseModel } from '#nuxt/mongoose'
import { Schema, Types } from 'mongoose';
import type { Group } from '~/utils/types';

interface WishlistItem {
    id: string;
    name: string;
    bought: boolean;
}

interface GiftItem {
    id: string;
    name: string;
    date: Date;
    buyerId: string;
    price: number;
}

interface BudgetForMember {
    userId: string;
    amount: number;
}

export interface DbGroupMember {
    id: string;
    name: string;
    wishlist: WishlistItem[];
    gifts: GiftItem[];
    budget: BudgetForMember[];
}

export interface DbGroup {
    name: string;
    date: Date;
    members: DbGroupMember[];
}

const wishlistSchema = new Schema<WishlistItem>({
    id: {
        type: 'string',
        required: true,
    },
    name: {
        type: 'string',
        required: true,
    },
    bought: {
        type: 'boolean',
        required: true,
    },
}, { _id: false });

const giftSchema = new Schema<GiftItem>({
    id: {
        type: 'string',
        required: true,
    },
    name: {
        type: 'string',
        required: true,
    },
    date: {
        type: 'date',
        required: true,
    },
    buyerId: {
        type: 'string',
        required: true,
    },
    price: {
        type: 'number',
        required: true,
    },
}, { _id: false });

const budgetForMemberSchema = new Schema({
    userId: {
        type: 'string',
        required: true,
    },
    amount: {
        type: 'number',
        required: true,
    },
}, { _id: false });

const groupMemberSchema = new Schema<DbGroupMember>({
    id: {
        type: 'string',
        required: true,
    },
    name: {
        type: 'string',
        required: true,
    },
    wishlist: [wishlistSchema],
    gifts: [giftSchema],
    budget: [budgetForMemberSchema]
}, { _id: false });


export const MongoGroups = defineMongooseModel<DbGroup>({
    name: 'groups',
    schema: {
        name: {
            type: 'string',
            required: true,
        },
        date: {
            type: 'date',
            required: true,
        },
        members: [groupMemberSchema],
    },
    options: {

    },
    hooks(schema) {

    },
})

export const toClientGroup = (id: Types.ObjectId, group: DbGroup, memberId: string): Group => {
    const me = group.members.find((m) => m.id === memberId);
    if (!me) {
        console.error("Member not found in group. This should not happen", memberId, group.members);
        throw new Error("Member not found in group");
    }

    return ({
        id: id.toHexString(),
        name: group.name,
        date: group.date.getTime(),
        me: {
            id: me.id,
            name: me.name,
            wishlist: me.wishlist.map((item) => ({
                id: item.id,
                name: item.name,
                bought: item.bought,
            })),
        },
        members: group.members
            .filter((member) => member.id !== memberId)
            .map((member) => ({
                id: member.id,
                name: member.name,
                wishlist: member.wishlist.map((item) => ({
                    id: item.id,
                    name: item.name,
                    bought: item.bought,
                })),
                gifts: member.gifts.map((gift) => ({
                    id: gift.id,
                    name: gift.name,
                    date: gift.date.getTime(),
                    buyerId: gift.buyerId,
                    price: gift.price,
                })),

                myBudget: member.budget.find((b) => b.userId === memberId)?.amount ?? null,
                totalBudget: member.budget.reduce((acc, b) => acc + b.amount, 0),
            })),
    });
};