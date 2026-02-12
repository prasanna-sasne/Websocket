# WebSocket Real-Time App
A real-time web application using React (frontend) and Node.js (backend) with WebSocket communication. The app demonstrates bidirectional communication between client and server, enabling instant data updates.

## Features
- Real-time messaging between client and server
- Simple React frontend
- Node.js WebSocket server using ws library
- Handles multiple concurrent connections
- Demonstrates 101 Switching Protocols response for WebSocket handshake

## Architecture
React Client <----WebSocket----> Node.js Server
- Client: Connects to the WebSocket server and listens for messages
- Server: Listens for WebSocket connections, handles events, and broadcasts messages to all connected clients

## WebSocket Handshake
When a client initiates a connection, the server responds with HTTP status 101 Switching Protocols, indicating the upgrade from HTTP to WebSocket.
Handshake Diagram
```
 Client                            Server
  |                                 |
  | -- HTTP GET /websocket ------>  |   (Request to upgrade)
  |   Upgrade: websocket            |
  |   Connection: Upgrade           |
  |                                 |
  | <------ 101 Switching Protocols-|   (Server agrees to switch)
  |   Upgrade: websocket            |
  |   Connection: Upgrade           |
  |                                 |
  |====== WebSocket Connection =====|
  |      Persistent TCP Link        |
  |      Real-time Messaging        |

```
  
Explanation:
101 Switching Protocols: Server acknowledges the request and switches the connection from HTTP to WebSocket
After this, the client and server communicate continuously over a single TCP connection without repeated HTTP requests
