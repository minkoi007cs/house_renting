const handler = require('../dist/serverless').default;

module.exports = (req, res) => handler(req, res);
