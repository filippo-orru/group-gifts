import { defineMongooseModel } from '#nuxt/mongoose'
import { Schema, Types } from 'mongoose';
import type { Group, GroupMember, OtherMemberWishlistItem } from '~/utils/types';

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
    responsibleMemberId: string;
    wishlist: WishlistItem[];
    budget: BudgetForMember[];
    gifts: GiftItem[];
}

export interface DbGroup {
    name: string;
    inviteId: string;
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
    responsibleMemberId: {
        type: 'string',
        required: true,
    },
    wishlist: [wishlistSchema],
    budget: [budgetForMemberSchema],
    gifts: [giftSchema],
}, { _id: false });


export const MongoGroups = defineMongooseModel<DbGroup>({
    name: 'groups',
    schema: {
        name: {
            type: 'string',
            required: true,
        },
        inviteId: {
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

export const toClientGroup = async (id: Types.ObjectId, group: DbGroup, memberIdMe: string): Promise<Group> => {
    const usersForGroup: UserInGroup[] = await MongoUserGroups.find({ groupId: id }).exec();

    const me = group.members.find((m) => m.id === memberIdMe);
    if (!me) {
        console.error("Member not found in group. This should not happen", memberIdMe, group.members);
        throw new Error("Member not found in group");
    }

    const groupMemberMe = {
        id: me.id,
        name: me.name,
        wishlist: me.wishlist.map((item) => ({
            id: item.id,
            name: item.name,
        })),
    };
    const clientGroup: Group = {
        id: id.toHexString(),
        inviteId: group.inviteId,
        name: group.name,
        date: group.date.getTime(),
        me: groupMemberMe,
        members: group.members
            .filter((member) => member.id !== memberIdMe)
            .map((member): GroupMember => ({
                id: member.id,
                name: member.name,
                wishlist: member.wishlist.map((item): OtherMemberWishlistItem => ({
                    id: item.id,
                    name: item.name,
                    bought: item.bought,
                })),
                joined: usersForGroup.some((u) => u.memberId === member.id),
                myBudget: member.budget.find((b) => b.userId === memberIdMe)?.amount ?? null,
                totalBudget: member.budget.reduce((acc, b) => acc + b.amount, 0),
                responsibleMemberId: member.responsibleMemberId,
                gifts: member.gifts.map((gift) => ({
                    id: gift.id,
                    name: gift.name,
                    date: gift.date.getTime(),
                    buyerId: gift.buyerId,
                    price: gift.price,
                })),
            })),
    };

    return clientGroup;
};