const express = require('express');
const {fetch} = require('undici');  // Make sure node-fetch is installed

const cors = require('cors');
const app = express();
const port = 4000;
app.use(cors());
//app.use(express.json());
// SELECT timestamp, COUNT(*) AS number_of_humans
// FROM output.csv
// WHERE timestamp BETWEEN 1662896469284 AND 1662897890888
// GROUP BY timestamp
// ORDER BY timestamp;



//   SELECT timestamp, AVG(pos_x) AS average_pos_x
// FROM output.csv
// WHERE timestamp BETWEEN 1662896469284 AND 1662897890888
// GROUP BY timestamp
// ORDER BY timestamp;
app.get('/questdb/graph-data', async (req, res) => {
  try {
    const { metric, startTime, endTime } = req.query;

    let query = '';
    if (metric === 'number_of_humans') {
      query = `
        SELECT timestamp, COUNT(*) AS number_of_humans
        FROM output.csv
        WHERE timestamp BETWEEN ${startTime} AND ${endTime}
        GROUP BY timestamp
        ORDER BY timestamp;
      `;
    } else if (metric === 'average_pos_x') {
      query = `
        SELECT timestamp, AVG(pos_x) AS average_pos_x
        FROM output.csv
        WHERE timestamp BETWEEN ${startTime} AND ${endTime}
        GROUP BY timestamp
        ORDER BY timestamp;
      `;
    }
console.log(query);

    const questdbUrl = `http://localhost:9000/exec?query=${encodeURIComponent(query)}`;
    const response = await fetch(questdbUrl);
    const data = await response.json();

    if (!data.dataset) {
      return res.status(500).json({ error: 'No data returned from QuestDB' });
    }

    // Format the data into a structure that can be consumed by the frontend
    const formattedData = data.dataset.map(row => ({
      timestamp: row[0],
      value: row[1],
    }));

    res.json(formattedData);

  } catch (error) {
    console.error('Error during fetching data from QuestDB:', error);
    res.status(500).json({ error: error.message });
  }
});



app.get('/questdb/heatmap-data', async (req, res) => {
    try {
      const { startTime, endTime } = req.query;
      
      const query = `
        SELECT timestamp, pos_x, pos_y,AVG(pos_x) AS Intensity
        FROM output.csv
        WHERE timestamp BETWEEN ${startTime} AND ${endTime}
        ORDER BY timestamp;
      `;
      
      const questdbUrl = `http://localhost:9000/exec?query=${encodeURIComponent(query)}`;
      const response = await fetch(questdbUrl);
    const data = await response.json();
  
      if (!data.dataset) {
        return res.status(500).json({ error: 'No data returned from QuestDB' });
      }
  
      const heatmapData = data.dataset.map(row => ({
        timestamp: row[0],
        pos_x: row[1],
        pos_y: row[2],
        value: row[3],  // This will be the intensity
      }));
  
      res.json(heatmapData);
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
