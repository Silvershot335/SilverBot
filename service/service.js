const Service = require('node-windows').Service;
const path = require('path');

module.exports = new Service({
  name: require('./name'),
  description: 'The discord bot 💻',
  script: path.join(__dirname, '..', 'lib', 'index.js'),
});
