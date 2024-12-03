// MARK: - Api payloads

export type CreateGroup = {
    name: string;
    date: number;
    memberNames: string[];
    maxBudget: number | null;
    secretMode: boolean;
}

export type UpdateGroup = {
    name?: string;
    maxBudget?: number | null;
    secretMode?: boolean;
}

export type PutBudget = {
    amount: number | null;
    flexible: boolean;
};

export interface PutTransaction {
    completed: boolean;
}

export type PutGifts = {
    gifts: MemberGift[];
}

export type PutMyWishlist = {
    items: MemberWishlistItem[];
}

export type PutOtherWishlist = { id: string; bought: boolean; }[];

export interface AcceptInviteBody {
    memberId: string; // Selected 'me' member id
}

// MARK: - Types

export interface Group {
    id: string;
    name: string;
    maxBudget: number | null;
    secretMode: boolean;
    date: number;
    me: GroupMemberMe;
    members: GroupMember[];
    inviteId: string;
}

export interface GroupMemberMe {
    id: string;
    name: string;
    wishlist: MemberWishlistItem[];
}

export interface GroupMember {
    id: string;
    name: string;
    wishlist: OtherMemberWishlistItem[];
    joined: boolean;
    myBudget: MyBudget | null;
    memberIdsWithFlexibleBudget: string[];
    otherBudgetSum: number;
    responsibleMemberId: string;
    gifts: MemberGift[];
}

export interface MemberWishlistItem {
    id: string;
    name: string;
    // description: string;
    // link: string | null;
    // price: number | null;
}

export interface MyBudget {
    amount: number;
    flexible: boolean;
}

export interface OtherMemberWishlistItem extends MemberWishlistItem {
    bought: boolean;
}

export interface MemberGift {
    id: string;
    name: string;
    date: number;
    buyerId: string;
    price: number;
}

export interface ChatMessage {
    id: string;
    groupId: string;
    memberId: string;
    authorId: string;

    content: string;
    date: number;
    isRead: boolean;
}

/** Always from the perspective of a member ("me") */
export interface GroupBudgetForMe {
    budgetSum: number;
    expensesSum: number;

    /** If the budget for any member is exceeded, this is covered by members with a flexible budget, 
     * or the one responsible member if noone has a flexible budget. */
    overspend: AmountForMembers;

    /** If the budget for any member is not fully spent, 
     * the remaining amount is split between all members, with respect to their budgets */
    underspend: AmountForMembers;

    /** If positive, the member should receive this sum via [myTransactions] - or pay this sum, if negative. */
    remainder: number;

    /** Transactions that need to be made FROM OR TO ME to balance the budget */
    myTransactions: MyBudgetTransaction[];
}

export interface AmountForMembers {
    amount: number;
    forMemberIds: string[];
}

export interface MyBudgetTransaction extends BudgetTransaction {
    completed: boolean;
}

export type GroupForInvite = {
    state: 'can-join' | 'already-joined';
    group: {
        id: string;
        name: string;
        date: number;
        members: { id: string; name: string; }[];
    };
};

// MARK: - Websocket messages

// Messages sent by the client
export type WsMessageC = {
    id: 'sendChatMessage';
    message: ChatMessage;
};

// Messages sent by the server
export type WsMessageS = {
    id: 'newChatMessage';
    message: ChatMessage;
} | {
    id: 'groupUpdate';
    group: Group;
};