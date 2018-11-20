/**
 * Created by Kayvon Rahimi on 15-11-2018.
 */
var env = {
    webPort: process.env.PORT || '5000',
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '27017',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbDatabase: process.env.DB_DATABASE || 'SPAindvTest',
    neo4jPassword: process.env.NEO4J_PASSWORD || '',
};

// var dbUrl = process.env.NODE_ENV === 'production' ?
//     'mongodb://' + env.dbUser + ':' + env.dbPassword + '@' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase :
//     'mongodb://localhost/' + env.dbDatabase;
var dbUrl =  `mongodb://localhost:${env.dbPort}/` + env.dbDatabase;

module.exports = {
    env: env,
    dbUrl: dbUrl
};