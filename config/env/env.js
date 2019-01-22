/**
 * Created by Kayvon Rahimi on 15-11-2018.
 */
var env = {
    webPort: process.env.PORT || '5000',
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '27017',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbDatabase: process.env.DB_DATABASE || 'SPAindvServer',
    // dbDatabase: process.env.DB_DATABASE || 'SPAindvServerTest',
    neo4jPassword: process.env.NEO4J_PASSWORD || 'Ftuna19zIga',
};

// var dbUrl = 'mongodb://' + process.env.dbUser + ':' + process.env.dbPassword + '@ds123372.mlab.com:23372/diractor-meann-server'
var dbUrl =  `mongodb://localhost:${env.dbPort}/` + env.dbDatabase;

module.exports = {
    env: env,
    dbUrl: dbUrl
};