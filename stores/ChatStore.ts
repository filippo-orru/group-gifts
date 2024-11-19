import type { WsMessageS } from "~/utils/types";


export type WebsocketState = "CONNECTING" | "OPEN" | "CLOSED";

let connectInProgress = false;

export const useChatStore = defineStore({
    id: 'chatStore',
    state: () => ({
        ws: null as WebSocket | null,
        connectionState: 'CLOSED' as WebsocketState,
        retryCount: 0,

        chatMessages: {} as { [messageId: string]: ChatMessage },
    }),
    actions: {
        async connect() {
            if (connectInProgress) {
                console.log("ws", "Already connecting, skipping...");
                return;
            }
            connectInProgress = true;

            const onMessageReceived = (event: MessageEvent<string>) => {
                const message: WsMessageS = JSON.parse(event.data);

                console.log('ws', message.id, message);

                switch (message.id) {
                    case 'newChatMessage':
                        this.chatMessages[message.message.id] = message.message;
                        break;
                }
            }

            const onWebsocketUpdate = () => {
                this.connectionState = wsStateMap[this.ws?.readyState ?? 3];
                // console.log("ws", "State updated to", this.connectionState);
            }

            const retryConnection = () => {
                setTimeout(
                    async () => {
                        this.retryCount += 1;
                        await this.connect();
                    },
                    1000
                );
            }

            if (this.ws) {
                if (this.connectionState === 'OPEN') {
                    console.log("ws", "Already connected, skipping...");
                    return;
                } else {
                    console.log("ws", "Closing previous connection");
                    this.ws.close();
                }
            }

            const isSecure = location.protocol === "https:";
            const url = (isSecure ? "wss://" : "ws://") + location.host + "/api/chat/connect";

            // await new Promise((resolve) => setTimeout(resolve, 1000));

            console.log("ws", "Connecting...");
            this.ws = new WebSocket(url);

            this.ws.addEventListener("message", onMessageReceived);

            this.ws.addEventListener("open", () => {
                console.log("ws", "Opened");
                onWebsocketUpdate();
                this.retryCount = 0;
            });
            this.ws.addEventListener("close", () => {
                console.log("ws", "Closed");
                onWebsocketUpdate();
                retryConnection();
            });
            this.ws.addEventListener("error", () => {
                console.log("ws", "Error");
                onWebsocketUpdate();
            });

            try {
                await Promise.race([
                    new Promise((resolve) => this.ws!.addEventListener("open", resolve)),
                    new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), 5000))
                ]);
            } catch (e) {
                console.error("ws", "Timeout while connecting");
                this.ws.close();
                retryConnection();
            }

            connectInProgress = false;
        },
        async getChatMessages(groupId: string, memberId: string): Promise<ComputedRef<ChatMessage[]>> {
            const messages = await $fetch<ChatMessage[]>(`/api/groups/${groupId}/members/${memberId}/messages`);
            messages.forEach((m) => {
                this.chatMessages[m.id] = m;
            });
            return computed(() =>
                Object.values(this.chatMessages).filter((m) => m.groupId === groupId && m.memberId === memberId)
            );
        },
        sendChatMessage(message: ChatMessage) {
            this.wsSend({ id: 'sendChatMessage', message });
        },
        wsSend(message: WsMessageC) {
            const data = JSON.stringify(message);
            console.log('ws', 'sending message', data);
            this.ws?.send(data);
        }
    },
});

const wsStateMap: { [key: number]: WebsocketState } = {
    0: "CONNECTING",
    1: "OPEN",
    2: "CLOSED",
    3: "CLOSED",
};
