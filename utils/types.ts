// MARK: - Api payloads

export type CreateGroup = {
    name: string;
    date: number;
    memberNames: string[];
}

export type PutBudget = {
    budget: number;
}

// MARK: - Types

export type Group = {
    id: string;
    name: string;
    date: number;
    me: GroupMemberMe;
    members: GroupMember[];
}

export type GroupMemberMe = {
    id: string;
    name: string;
    wishlist: MemberWishlistItem[];
}

export type GroupMember = {
    id: string;
    name: string;
    myBudget: number | null;
    wishlist: MemberWishlistItem[];
    gifts: MemberGift[];
    totalBudget: number;
}

export type MemberWishlistItem = {
    id: string;
    name: string;
    bought: boolean;
    // description: string;
    // link: string | null;
    // price: number | null;
}

export type MemberGift = {
    id: string;
    name: string;
    date: number;
    buyerId: string;
    price: number;
}

export type ChatMessage = {
    id: string;
    authorId: string;
    content: string;
    date: number;
    isRead: boolean;
}

// Messages sent by the client
export type WsMessageC = {
    id: 'sendMessage';
    groupId: string;
    memberId: string;
    content: string;
}

// Messages sent by the server
export type WsMessageS = {
    id: 'newMessage';
    groupId: string;
    memberId: string;
    message: ChatMessage;
}