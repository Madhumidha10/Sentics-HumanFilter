const fs = require('fs');
const JSONStream = require('JSONStream');
const { parse } = require('json2csv');

// Create a read stream for the large JSON file
const inputStream = fs.createReadStream('uploads/FilteredDataHuman.json', { encoding: 'utf8' });

// Create a writable stream for the output CSV file
const outputStream = fs.createWriteStream('output.csv');

// Set up the CSV writer with the appropriate header (if needed)
const csvWriter = parse({ fields: ['timestamp', '_id', 'instance_id', 'pos_x', 'pos_y', 'vel_x', 'vel_y', 'confidence', 'sensors'] });

// Write CSV header
outputStream.write('timestamp,_id,instance_id,pos_x,pos_y,vel_x,vel_y,confidence,sensors\n');

// Use JSONStream to parse the JSON file stream and convert to CSV
inputStream
  .pipe(JSONStream.parse('*'))  // Parse each top-level JSON object
  .on('data', (item) => {
    const timestamp = item.timestamp.$date.$numberLong; // Flatten timestamp
    const _id = item._id.$oid; // Flatten _id
    const instances = item.instances;

    // Flatten each instance and write to the CSV file
    for (const instanceId in instances) {
      const instance = instances[instanceId];
      const row = {
        timestamp,
        _id,
        instance_id: instanceId,
        pos_x: instance.pos_x,
        pos_y: instance.pos_y,
        vel_x: instance.vel_x,
        vel_y: instance.vel_y,
        confidence: instance.confidence,
        sensors: JSON.stringify(instance.sensors) // Convert sensors array to a string
      };
      outputStream.write(`${Object.values(row).join(',')}\n`);
    }
  })
  .on('end', () => {
    console.log('CSV file has been generated as output.csv');
  })
  .on('error', (err) => {
    console.error('Error processing JSON file:', err);
  });
