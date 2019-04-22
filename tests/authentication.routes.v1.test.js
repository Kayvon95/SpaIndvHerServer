process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const mongoose = require('mongoose');
const server = require('../server');
const auth = require('../auth/authentication');
const User = require('../models/user');

const testUser = new User({
   username: 'testUser',
   password: 'testpassword'
});

chai.use(chaiHttp);

describe('Creating an user', () => {
    before((next) => {
        testUser.save()
            .then(() => {
                next();
            });
    });

    describe('/POST signUp', () => {
        it('should return a user and token from the server', (done) => {
            const newTestUser = new User({
                username: 'testUser',
                password: 'testpassword1'
            });
            chai.request(server)
                .post('/api/v1/authentication/signup')
                .send(newTestUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.property('username').equal('testUser');
                    done();
                });
        });
    });

    describe('POST login', () => {
        it('should return a token and user upon logging in', (done) => {
           const user = new User({
               username: 'testUser',
               password: 'testpassword'
           });
           chai.request(server)
               .post('/api/v1/authentication/login')
               .send(user)
               .end((err, res)=> {
                   res.should.have.status(200);
                   done()
               });
        });

    })
});
