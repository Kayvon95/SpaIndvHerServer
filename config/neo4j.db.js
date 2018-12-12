const neo4j = require('neo4j-driver').v1;
const config =  require('../config/env/env');

const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', config.env.neo4jPassword));

module.exports = driver;