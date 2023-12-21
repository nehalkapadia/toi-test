// index.js
// Required package for environment variables
require("dotenv").config();
// const express = require('express');
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.NEXT_PORT || 3000;

app.prepare().then(() => {
  console.log(port, process.env.NEXT_PORT);
  //   const server = express();

  // Add your API routes or middleware here
  // express configuration
  const server = require("./server/api/server");

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
