import { defineMongooseModel } from '#nuxt/mongoose'
import { Schema, Types } from 'mongoose';
import type { Group, GroupBudgetForMe, GroupMember, OtherMemberWishlistItem } from '~/utils/types';

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
    flexible: boolean;
}

export interface DbGroupMember {
    id: string;
    name: string;
    /** id of other member who is responsible for this member */
    responsibleMemberId: string;
    wishlist: WishlistItem[];
    budget: BudgetForMember[];
    gifts: GiftItem[];
}

export interface DbGroup {
    name: string;
    inviteId: string;
    date: Date;
    createdDate: Date;
    members: DbGroupMember[];
    transactions: DbTransaction[];
}

export interface DbTransaction {
    id: string;
    completed: boolean;
}

const transactionSchema = new Schema<DbTransaction>({
    id: {
        type: 'string',
        required: true,
    },
    completed: {
        type: 'boolean',
        required: true,
    },
}, { _id: false });

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
    flexible: {
        type: 'boolean',
        required: false,
        default: false,
    }
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
        createdDate: {
            type: 'date',
            required: true,
        },
        members: [groupMemberSchema],
        transactions: {
            type: [transactionSchema],
            default: [],
        },
    },
    options: {

    },
    hooks(schema) {

    },
})


export const toClientGroup = async (group: DbGroup & { _id: Types.ObjectId }, memberIdMe: string): Promise<Group> => {
    const usersForGroup: DbUserInGroup[] = await MongoUserGroups.find({ groupId: group._id }).exec();
    const chatMessages: ChatMessage[] = (await MongoMessages.find({ groupId: group._id }).exec()).map(m => toClientMessage(m));

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
        id: group._id.toHexString(),
        inviteId: group.inviteId,
        name: group.name,
        date: group.date.getTime(),
        me: groupMemberMe,
        members: group.members
            .filter((member) => member.id !== memberIdMe)
            .map((member): GroupMember => {
                // If noone has a flexible budget for this member, the responsible member is the default
                const memberIdsWithFlexibleBudget = member.budget
                    .filter(b => b.flexible)
                    .map(m => m.userId);
                if (memberIdsWithFlexibleBudget.length === 0) {
                    memberIdsWithFlexibleBudget.push(member.responsibleMemberId);
                }

                const myBudget = member.budget.find((b) => b.userId === memberIdMe);

                return {
                    id: member.id,
                    name: member.name,
                    wishlist: member.wishlist.map((item): OtherMemberWishlistItem => ({
                        id: item.id,
                        name: item.name,
                        bought: item.bought,
                    })),
                    joined: usersForGroup.some((u) => u.memberId === member.id),
                    myBudget: myBudget ? {
                        amount: myBudget.amount,
                        flexible: myBudget.flexible,
                    } : null,
                    memberIdsWithFlexibleBudget,
                    otherBudgetSum: member.budget
                        .filter((m) => m.userId !== memberIdMe)
                        .reduce((acc, b) => acc + b.amount, 0),
                    responsibleMemberId: member.responsibleMemberId,
                    gifts: member.gifts.map((gift) => ({
                        id: gift.id,
                        name: gift.name,
                        date: gift.date.getTime(),
                        buyerId: gift.buyerId,
                        price: gift.price,
                    })),
                };
            }),
    };

    return clientGroup;
};