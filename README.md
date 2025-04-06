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

### Endpoints
**1. /questdb/graph-data**
Fetches data for graph metrics (e.g., number of humans or average position on the X-axis) from QuestDB.

**Query Parameters:**
metric: The type of metric you want to fetch. Valid options:

number_of_humans: Count of humans in the dataset.

average_pos_x: Average value of the pos_x column.

startTime: The start timestamp for the time range (Unix timestamp).

endTime: The end timestamp for the time range (Unix timestamp).

**Example Request:**

GET http://localhost:4000/questdb/graph-data?metric=number_of_humans&startTime=1615284697&endTime=1615288297
**Example Response:**

[
  {
    "timestamp": 1615284697,
    "value": 5
  },
  {
    "timestamp": 1615284797,
    "value": 7
  },
  ...
]
### 2. /questdb/heatmap-data
Fetches heatmap data from QuestDB, including the positions (pos_x, pos_y) and intensity of the data points.

**Query Parameters:**
startTime: The start timestamp for the time range (Unix timestamp).

endTime: The end timestamp for the time range (Unix timestamp).

**Example Request:**

GET http://localhost:4000/questdb/heatmap-data?startTime=1615284697&endTime=1615288297
**Example Response:**

[
{
    "timestamp": 1615284697,
    "pos_x": 10.5,
    "pos_y": 20.7,
    "value": 5
  },
  {
    "timestamp": 1615284797,
    "pos_x": 12.2,
    "pos_y": 21.5,
    "value": 7
  },
  ...
]
### Error Handling
If there's an error while fetching data from QuestDB or in the server code, the response will contain a message with details about the error:

{
  "error": "No data returned from QuestDB"
}
