export type GroupTab = "home" | "wishlist";

export type GroupInfo = {
    id: string;
    name: string;
    description: string;
    members: GroupMember[];
    myWishlist: string[];
    newMessages: number;
}

export type GroupMember = {
    id: string;
    name: string;
    myBudget: number | null;
    wishlist: MemberWishlistItem[];
    gifts: MemberGift[];
    totalBudget: number;
    chat: MemberChat;
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
    date: string;
    buyerId: string;
    price: number;
}

export type MemberChat = {
    messages: ChatMessage[];
}

export type ChatMessage = {
    id: string;
    authorId: string;
    content: string;
    date: string;
}