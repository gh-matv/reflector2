
import fs from 'fs';
import path from 'path';
const config = JSON.parse(fs.readFileSync(path.join(__dirname, './config.json'), 'utf8'));

import express from 'express';
const app = express();

import ws from 'ws';
const wss = new ws.Server({ port: config.port + 1 });

setInterval(async () => {

	const x = await fetch("https://random-data-api.com/api/v2/users?size=1").then(res => res.json());
	const name = x.first_name;
	broadcast(`Hello ${name}!`);

}, 1000);

app.get(`${config.basepath}`, (req, res) => {
	  res.send('Hello World!');
});

let all_connections: ws.WebSocket[] = [];

const broadcast = (data: string) => {
	console.log("broadcasting: " + data + " to " + all_connections.length + " connections");
	all_connections.forEach((ws) => {
		ws.send(data);
	});
};

wss.on('connection', (ws) => {
	all_connections.push(ws);
	ws.on('message', (message) => {
		console.log(`Received message => ${message}`);
		// answer
		ws.send(`Hello, you sent -> ${message}`);
	});
});

// @ts-ignore
wss.on('close', (ws) => {
	all_connections = all_connections.filter((e) => e !== ws);
});

app.listen(config.port, () => {
	  console.log('Server is running on port ' + config.port);
});
