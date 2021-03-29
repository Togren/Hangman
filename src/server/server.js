// ~~~~~~~~~~~~~~~~~~~~ IMPORTS ~~~~~~~~~~~~~~~~~~~~ //

// NodeJS native
const fs = require('fs').promises;
const http = require('http');
const path = require('path');


// ~~~~~~~~~~~~~~~~~~~~ CONSTANTS ~~~~~~~~~~~~~~~~~~~~ //

const CURRENT_DIR = __dirname;
const HOME_DIR = path.join(CURRENT_DIR, '..', '..');
const CLIENT_HOME_DIR = path.join(HOME_DIR, 'src', 'client');

// ~~~~~~~~~~~~~~~~~~~~ SERVER CONFIG ~~~~~~~~~~~~~~~~~~~~ //

const scriptArgs = process.argv.slice(2);
const host = scriptArgs.length >= 1 ? scriptArgs[0] : 'localhost';
const port = scriptArgs.length >= 2 ? scriptArgs[1] : 8080;

// ~~~~~~~~~~~~~~~~~~~~ REQUEST LISTENER ~~~~~~~~~~~~~~~~~~~~ //

const requestListener = async (req, res) => {
  // Incoming URL has client folder as root
  const url = req.url === '/' ? 'index.html' : req.url;
  const filePath = path.join(CLIENT_HOME_DIR, url);
  // Retrieve file content
  try {
    const contents = await fs.readFile(filePath);
    // Switch over file extensions
    switch (path.extname(url)) {
      case '.html':
        res.setHeader('Content-Type', 'text/html');
        break;
      case '.js':
        res.setHeader('Content-Type', 'application/javascript');
        break;
      case '.css':
        res.setHeader('Content-Type', 'text/css');
        break;
      case '.json':
      case '.map':
        res.setHeader('Content-Type', 'application/json');
        break;
    }
    // Set generic headers and send
    res.writeHead(200);
    res.end(contents);
  } catch (err) {
    // Error occurred while handling request
  console.error(`Error while handling request for file ${filePath}: ${err.message}.`);
  res.writeHead(500);
  res.end(JSON.stringify({error: 'Resource not found/Error while loading.'}));
}
}

// ~~~~~~~~~~~~~~~~~~~~ SERVER INIT ~~~~~~~~~~~~~~~~~~~~ //

// Spin up server and start listening
const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.info(`Web Server successfully started on http://${host}:${port}`);
})

