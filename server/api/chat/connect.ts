import type { ChatMessage, WsMessageC, WsMessageS } from "~/utils/types";
import { getTokenFromRequest } from "~/server/utils/auth";
import type { DbUserInGroup } from "~/server/models/userGroups.schema";
import type { DbChatMessage } from "~/server/models/messages.schema";
import { toClientMessage } from "~/server/models/messages.schema";

type WsClient = {
    token: string;
    peer: WsPeer;
};

type WsPeer = { send: (message: string) => void; token?: string };

const clients: Map<string, WsClient> = new Map();

export async function onNewChatMessage(
    from: WsClient,
    message: ChatMessage
) {
    // Store in db
    const createDbMessage: DbChatMessage = {
        groupId: message.groupId,
        memberId: message.memberId,
        authorId: message.authorId,
        content: message.content,
        date: new Date(message.date),
    };
    const dbMessage = await MongoMessages.create(createDbMessage);

    // Send to active clients
    const usersInGroup: DbUserInGroup[] = await MongoUserGroups.find({
        groupId: message.groupId,
    }).exec();
    const tokens = usersInGroup.map((userInGroup) => userInGroup.token);

    for (const token of tokens) {
        const client = clients.get(token);
        if (client) {
            // if (client === from) {
            //     console.log("Skipping sending message to sender");
            //     continue;
            // }
            sendMessage(
                client.peer,
                {
                    id: "newChatMessage",
                    message: toClientMessage(dbMessage),
                }
            );
        }
    }
}

function sendMessage(peer: WsPeer, message: WsMessageS) {
    peer.send(JSON.stringify(message));
}

export default defineWebSocketHandler({
    async upgrade(request) {
        // console.log("[ws] upgrade", request.url);
        // throw new Error("test");
    },
    async open(peer) {
        // console.log("[ws] open", peer);

        if (!peer.request?.headers) {
            throw new Error("Missing headers");
        }

        const token = getTokenFromRequest(peer.request as { headers: Headers; });
        console.log("token", token);

        clients.set(token, { token, peer });
    },

    async message(peer, message) {
        // console.log("[ws] message", peer, message);
        const msg = JSON.parse(message.text()) as WsMessageC;

        const token = getTokenFromRequest(peer.request as { headers: Headers; });
        const client = clients.get(token);
        
        if (!client) {
            throw new Error("Client not found, closing connection");
        }

        switch (msg.id) {
            case 'sendChatMessage':
                onNewChatMessage(client, msg.message);
                break;
        }
    },

    close(peer, event) {
        // console.log("[ws] close", peer, event);
        Object.values(clients).forEach((client) => {
            if (client.peer === peer) {
                clients.delete(client.token);
            }
        });
    },

    error(peer, error) {
        console.log("[ws] error", peer, error);
    },
});