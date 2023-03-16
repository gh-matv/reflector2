
import express from 'express';
const app = express();

import fs from 'fs';
import path from 'path';
const config = JSON.parse(fs.readFileSync(path.join(__dirname, './config.json'), 'utf8'));

app.get(`${config.basepath}`, (req, res) => {
	  res.send('Hello World!');
});

app.listen(config.port, () => {
	  console.log('Server is running on port ' + config.port);
});
