const path = require('path');
const config = require('./config/config.template');
const logger = require('./utils/logger');
const express = require('express');

const app = express();

app.use(express.static(path.resolve(__dirname, 'build_webpack')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build_webpack', 'index.html'));
});

app.listen(config.port, () => {
  logger.log('debug',
  `App listening on port: ${config.port}`)
})
