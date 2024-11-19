// MARK: - Api payloads

export type CreateGroup = {
    name: string;
    date: number;
    memberNames: string[];
}

export type PutBudget = {
    budget: number | null;
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
    myBudget: number | null;
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
export interface GroupBudgeting {
    budgetSum: number;
    expensesSum: number;

    /** If the group overspent for the member I'm responsible for, this overspend is covered by me by adjusting my budget. */
    responsibleMemberOverspend: number;

    /** 1 means the budget was consumed exactly. 0.5 means half of the budget was consumed. */
    groupUnderspendFactor: number;

    /** Transactions that need to be made FROM OR TO ME to balance the budget */
    myTransactions: BudgetTransaction[];
}

export interface BudgetTransaction {
    fromId: string;
    toId: string;
    amountCents: number;
    completed: boolean;
}

export type GroupForInvite
    = {
        state: 'can-join';
        group: {
            id: string;
            name: string;
            date: number;
            members: { id: string; name: string; }[];
        };
    }
    | {
        state: 'already-joined',
        groupId: string;
    };

// MARK: - Websocket messages

// Messages sent by the client
export type WsMessageC = {
    id: 'sendChatMessage';
    message: ChatMessage;
}

// Messages sent by the server
export type WsMessageS = {
    id: 'newChatMessage';
    message: ChatMessage;
}