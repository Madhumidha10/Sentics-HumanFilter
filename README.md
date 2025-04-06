# QuestDB API Server

This is an Express.js API server designed to interact with a QuestDB instance. It provides endpoints to fetch graph data and heatmap data from the QuestDB database based on the given metrics and time range.

## Setup

Before running the server, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [QuestDB](https://questdb.io/)

### Dependencies

The following dependencies are required for the server:

- `express` - Web framework for Node.js
- `undici` - HTTP client used for querying QuestDB
- `cors` - Middleware for enabling Cross-Origin Resource Sharing (CORS)

You can install the necessary dependencies by running:

npm install


### Starting the Server
To start the server, run:


node server.js
The server will start running on http://localhost:4000.

Make sure QuestDB is running on http://localhost:9000 (default).
