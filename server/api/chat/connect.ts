import type { WsMessageC, WsMessageS } from "~/utils/types";

type WsClient = {
    userId: string;
    peer: WsPeer;
};

type WsPeer = { send: (message: string) => void };

type WsErrorS = 'Unauthorized' | 'Bad token' | 'NotFound';

const clients: {
    [meetingId: string]:
    { [peerId: string]: WsClient }
} = {};

export function sendMeetingUpdate(meetingId: string, fromUserId: string, meeting: MeetingSerialized) {
    let clientList = clients[meetingId];
    if (clientList) {
        for (let peerId of Object.keys(clientList)) {
            let client = clientList[peerId];
            if (client.userId !== fromUserId) {
                // sendMessage(
                //     client.peer,
                //     {
                //         id: "update",
                //         data: meeting
                //     }
                // );
            }
        }
    }
}

function sendMessage(peer: WsPeer, message: WsMessageS) {
    peer.send(JSON.stringify(message));
}

function sendError(peer: WsPeer, message?: WsErrorS) {
    sendMessage(peer,
        {
            type: "error",
            message: message
        }
    );
}


export default defineWebSocketHandler({
    async upgrade(request) {
        // Get auth token from request
        let token = request.headers.get("Authorization");
        if (!token) {
            return;
        }

    },
    async open(peer) {
    },

    async message(peer, message) {
        // console.log("[ws] message", peer, message);
        let msg = JSON.parse(message.text()) as WsMessageC;

        let user;
        switch (msg.id) {
            case 'sendMessage':
                user = await getUserByToken(msg.userId, msg.token);
                if (!user) {
                    sendMessage(peer, { type: "authResponse", response: "unauthorized" });
                } else {
                    let clientList = clients[msg.meetingId] || (clients[msg.meetingId] = {});
                    clientList[peer.id] = { userId: user.id, peer: peer };
                    sendMessage(peer, { type: "authResponse", response: "ok" });
                }
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