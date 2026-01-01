const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../../error_log.txt');

const logError = (context, error) => {
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] ${context}: ${error.message}\nStack: ${error.stack}\n\n`;
  fs.appendFileSync(logFile, message);
};

module.exports = logError;
