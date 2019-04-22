process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const mongoose = require('mongoose');
const server = require('../server');
const Actor = require('../models/actor');
const testActor = new Actor ({
    firstName: 'Christian',
    lastName: 'Bale',
    yearOfBirth: '1974',
    countryOfOrigin: 'Wales',
    isDirector: 0,
    imageUrl: 'www.test.nl/picture.jpg'
});

chai.use(chaiHttp);

describe('Creating an Actor', () => {
    before((next) => {
        testActor.save()
            .then(() => {
                next();
        });
    });

    describe('/GET actors (all)', () => {
       it('should return all actors from MongoDB', (done) => {
           chai.request(server)
               .get('/api/v1/actors')
               .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.not.be.eql(null);
                    res.body.length.should.not.be.eql(1);
                    res.body.length.should.be.eql(2);
                    res.body[0].should.have.property('firstName').equal('Christian');
                    done();
               });
        });
        it('it should return a specific actor', (done) => {
            chai.request(server)
                .get('/api/v1/actors/' + testActor._id)
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('firstName').equal('Christian');
                    res.body.should.have.property('lastName').equal('Bale');
                    res.body.should.have.property('yearOfBirth').equal(1974);
                    done();
                    //MG 15 n.a low weight
                });
        });
    });

    describe('/POST actor', () => {
        it('it should post a new actor to the database and return it', (done) => {
            var newActor = {
                firstName: 'newActor',
                lastName: 'newLastName',
                yearOfBirth: 1975,
                countryOfOrigin: 'Hungary',
                isDirector: 0,
                imageUrl: 'url.nl/testfoto.jpg'
            };
            chai.request(server)
                .post('/api/v1/actors')
                .send(newActor)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('firstName').equal('newActor');
                    res.body.should.have.property('lastName').equal('newLastName');
                    res.body.should.have.property('yearOfBirth').equal(1975);
                    done();
                });
        });

    });

    describe('/DELETE actor', () => {
        it('should delete a actor', (done) => {
            chai.request(server)
                .get('/api/v1/actors')
                .end((err, res) => {
                    chai.request(server)
                        .delete('/api/v1/actors/' + testActor._id)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.should.be.a('object');
                            res.body.should.have.property('message').equal('Actor removed');
                            done();
                        })
                })
        })
    });

    after((done => {
        const { actors } = mongoose.connection.collections;
        actors.drop(() => {
            done();
        });
    }))
});