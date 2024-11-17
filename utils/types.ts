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

export interface AcceptInviteBody {
    memberId: string; // Selected 'me' member id
}

// MARK: - Types

export type Group = {
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
    totalBudget: number;
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

export type ChatMessage = {
    id: string;
    authorId: string;
    content: string;
    date: number;
    isRead: boolean;
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