const winston = require('winston');

let logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({'timestamp':true}),
      new (winston.transports.File)({ filename: 'logs/' + Date.now() + '.log' })
    ]
});

logger.level = process.env.LOGLVL || 'debug';

module.exports = logger;
