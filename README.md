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

## Running MongoDB with Docker
#### Pull Mongo Image
docker pull mongo

#### Create network
docker create network mongo_network

#### Run MongoDB Container
docker run -d \
-p 27017:27017 \
--name mongo \
--network mongo_network \
-e MONGO_INITDB_ROOT_USERNAME=admin \
-e MONGO_INITDB_ROOT_PASSWORD=qwerty \
mongo

This will:
Start MongoDB in a container
Expose it on localhost:27017
Create a root user (admin/qwerty)

#### Check Collection from mongo-express
docker run -d \
-p 8081:8081 \
--name mongo_express \
--network mongo_network \
-e ME_CONFIG_MONGODB_ADMINUSERNAME=admin \
-e ME_CONFIG_MONGODB_ADMINPASSWORD=qwerty \
-e ME_CONFIG_MONGODB_SERVER=mongo \
mongo-express

#### Check mongo-express is installed
Go to browser http://localhost:8081/
use standard username: admin and password: pass

