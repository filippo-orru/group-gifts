import type { WsMessageS } from "./types";

let ws: WebSocket | null = null;

function onMessageReceived(event: MessageEvent<string>): void {
    const message: WsMessageS = JSON.parse(event.data);

    console.log('ws', message.id, message);

    switch (message.id) {
        case 'newChatMessage':
            const store = useMyAppStore();
            store.receivedChatMessage(message.message);
            break;
    }
}

export async function wsConnect({ force = false }: { force?: boolean } = {}) {
    if (ws && ws.readyState === WebSocket.OPEN && !force) {
        console.log("ws", "Already connected, skipping...");
        return;
    }
    const isSecure = location.protocol === "https:";
    const url = (isSecure ? "wss://" : "ws://") + location.host + "/api/chat/connect";
    if (ws) {
        console.log("ws", "Closing previous connection before reconnecting...");
        ws.close();
    }

    const websocket = new WebSocket(url);

    websocket.addEventListener("message", onMessageReceived);
    await new Promise((resolve) => websocket.addEventListener("open", resolve));

    ws = websocket;
}

export function wsSend(message: WsMessageC) {
    const data = JSON.stringify(message);
    console.log("sending message...", data);
    ws?.send(data);
}