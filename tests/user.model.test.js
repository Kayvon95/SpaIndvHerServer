process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const mongoose = require('mongoose');
const server = require('../server');
const User = require('../models/user');

chai.use(chaiHttp);
