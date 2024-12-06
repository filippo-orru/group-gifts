import type { ChatMessage, WsMessageC, WsMessageS } from "~/utils/types";
import { getTokenFromRequest } from "~/server/utils/auth";
import type { DbUserInGroup } from "~/server/models/userGroups.schema";
import type { DbChatMessage } from "~/server/models/messages.schema";
import { toClientMessage } from "~/server/models/messages.schema";
import { sendNotificationForToken } from "~/server/utils/notifications";
import { Types } from "mongoose";
import { toClientGroup } from "~/server/models/groups.schema";

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

    const usersInGroup: DbUserInGroup[] = await MongoUserGroups.find({
        groupId: message.groupId,
    }).exec();
    const tokens = usersInGroup
        .map((userInGroup) => userInGroup.token)
        .filter((token) => token !== message.memberId); // Don't send to the channel (= dont send to 'XYZ' of channel 'gift for XYZ')

    const group = (await MongoGroups.findOne({
        _id: message.groupId,
    }).exec())!;
    const authorName = group.members.find((member) => member.id === message.authorId)!.name;

    let content = "";
    if (message.content.length > 70) {
        content = message.content.slice(0, 70) + "...";
    } else {
        content = message.content;
    }
    const messageNotificationText = `${authorName}: ${content}`;

    for (const token of tokens) {
        // Send to active client
        const client = clients.get(token);
        if (client) {
            sendMessage(
                client.peer,
                {
                    id: "newChatMessage",
                    message: toClientMessage(dbMessage),
                }
            );
        }

        if (token !== from.token) { // Don't send push notification to the author
            // Send push notification. If the website is open, the message will not be shown
            const messagingToken = await MongoMessagingTokens.findOne({ _id: token }).exec();
            if (messagingToken) {
                sendNotificationForToken(token, { title: group.name, body: messageNotificationText });
            }
        }
    }
}

export async function onGroupUpdate(group: DbGroup & { _id: Types.ObjectId }) {
    const usersInGroup: DbUserInGroup[] = await MongoUserGroups.find({
        groupId: group._id,
    }).exec();

    for (const userInGroup of usersInGroup) {
        const client = clients.get(userInGroup.token);
        if (client) {
            sendMessage(client.peer, {
                id: "groupUpdate",
                group: await toClientGroup(group, userInGroup.memberId),
            });
        }
    }
}

function sendMessage(peer: WsPeer, message: WsMessageS) {
    peer.send(JSON.stringify(message));
}

export default defineWebSocketHandler({
    async upgrade(_) {
        // console.log("[ws] upgrade", request.url);
        // throw new Error("test");
    },
    async open(peer) {
        // console.log("[ws] open", peer);

        if (!peer.request?.headers) {
            throw new Error("Missing headers");
        }

        const token = getTokenFromRequest(peer.request as { headers: Headers; });

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