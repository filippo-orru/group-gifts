import type { ChatMessage, WsMessageC, WsMessageS } from "~/utils/types";
import cookie from "cookie";
import { getTokenFromRequest } from "~/server/utils/auth";
import { getGroupDataByTokenAndGroupId } from "~/server/utils/groups";

type WsClient = {
    userId: string;
    peer: WsPeer;
};

type WsPeer = { send: (message: string) => void };

type WsErrorS = 'Unauthorized' | 'Bad token' | 'NotFound';

interface ChatInfo {
    members: WsClient[];
}

const peers: { [peerId: string]: WsPeer } = {};
const chats: { [chatId: string]: ChatInfo } = {};

export function onNewChatMessage(
    chatId: string, 
    from: WsClient, 
    groupId: string, 
    memberId: string, 
    message: ChatMessage
) {
    const chatInfo = chats[chatId];
    if (chatInfo) {
        for (const client of chatInfo.members) {
            if (client !== from) {
                sendMessage(
                    client.peer,
                    {
                        id: "newMessage",
                        groupId,
                        memberId,
                        message,
                    }
                );
            }
        }
    }
}

function sendMessage(peer: WsPeer, message: WsMessageS) {
    peer.send(JSON.stringify(message));
}

function sendError(peer: WsPeer, message?: WsErrorS) {
    console.log("error in websocket", message);
}

export default defineWebSocketHandler({
    async upgrade(request) {

    },

    async open(peer) {
        if (!peer.request?.headers) {
            throw new Error("Missing headers");
        }
        const token = getTokenFromRequest(peer.request as { headers: Headers; });
        console.log("token", token);
    },

    async message(peer, message) {
        // console.log("[ws] message", peer, message);
        const msg = JSON.parse(message.text()) as WsMessageC;

        switch (msg.id) {
            case 'sendMessage':
                
                break;
        }
    },

    close(peer, event) {
        // console.log("[ws] close", peer, event);
    },

    error(peer, error) {
        // console.log("[ws] error", peer, error);
    },
});