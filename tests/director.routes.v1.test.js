process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const mongoose = require('mongoose');
const server = require('../server');
const Director = require('../models/director');
const testDirector = new Director({
    firstName: 'James',
    lastName: 'Cameron',
    yearOfBirth: 1954,
    countryOfOrigin: 'Canada',
    isActor: 0,
    imageUrl: 'www.test.nl/picture.jpg'
});

var id = '';

chai.use(chaiHttp);

describe('Creating a director', () => {
    before((next) => {
        testDirector.save()
            .then(() => {
                next();
            });
    });

    describe('/GET Directors (all)', () => {
        it('should return all directors from MongoDB', (done) => {
            chai.request(server)
                .get('/api/v1/directors')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.not.be.eql(null);
                    res.body.length.should.be.eql(1);
                    res.body.length.should.be.eql(1);
                    res.body[0].should.have.property('firstName').equal('James');
                    done();
                });
        });
        it('it should return a specific director', (done) => {
            chai.request(server)
                .get('/api/v1/directors/' + testDirector._id)
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('firstName').equal('James');
                    res.body.should.have.property('lastName').equal('Cameron');
                    res.body.should.have.property('yearOfBirth').equal(1954);
                    done();
                });
        });
    });

    describe('/POST director', () => {
        it('it should post a new director to the database and return it', (done) => {
            var newDirector = {
                firstName: 'newDirector',
                lastName: 'newLastName',
                yearOfBirth: 1970,
                countryOfOrigin: 'Brazil',
                isActor: 1,
                imageUrl: 'url.nl/testfoto.jpg'
            };
            // console.log(newDirector);
            chai.request(server)
                .post('/api/v1/directors')
                .send(newDirector)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('firstName').equal('newDirector');
                    res.body.should.have.property('lastName').equal('newLastName');
                    res.body.should.have.property('yearOfBirth').equal(1970);
                    done();
                });
        });
    });
    describe('/PUT directors', () => {
        it('it should edit a director and return it', (done) => {
            chai.request(server)
                .get('/api/v1/directors')
                .end((err, res) => {
                    // console.log(res.body);
                    chai.request(server)
                        .put('/api/v1/directors/' + res.body[0]._id)
                        .send({
                            firstName: 'editedJames',
                            lastName: 'editedCameron',
                            yearOfBirth: 1960,
                            countryOfOrigin: 'USA',
                            isActor: 1,
                            imageUrl: 'url.nl'
                            })
                        .end((err, response) => {
                            // console.log(res.body);
                            response.should.have.status(200);
                            response.body.should.be.a('object');
                            response.body.should.have.property('firstName').equal('editedJames');
                            response.body.should.have.property('lastName').equal('editedCameron');
                            done();
                        });
                })

        });
    });

    // describe('/PUT director', () => {
    //     it('should edit a director and return it', (done) => {
    //         chai.request(server)
    //             .get('/api/v1/directors')
    //             .end((err, res) => {
    //                 // console.log('@PUT directors' + res.body);
    //                 // console.log(res);
    //                 const dirId = res.body[0]._id;
    //                 const query = '/api/v1/directors/' + dirId;
    //                 console.log('@PUT director query = ' + query);
    //                 chai.request(server)
    //                     .put('/api/v1/directors/' + testDirector._id)
    //                     .send({
    //                         firstName: 'editedJames',
    //                         lastName: 'editedCameron',
    //                         yearOfBirth: 1960,
    //                         countryOfOrigin: 'USA',
    //                         isActor: 1,
    //                         imageUrl: 'url.nl'
    //                     })
    //                     .end((err, res) => {
    //                         res.should.have.status(200);
    //                         res.should.be.a('object');
    //                         res.should.have.property('firstName').equal('editedJames');
    //                         done();
    //                     });
    //             });
    //     });
    //     it('it should add a movie to a directors and return it', (done) => {
    //         chai.request(server)
    //             .put('/api/v1/directors/' + testDirector._id + '/movie')
    //             .send({
    //                 title: 'TestMovie',
    //                 subtitle: 'tests subtitle',
    //                 minutes: 124,
    //                 genre: 'Action',
    //                 yearOfRelease: 2015,
    //                 imageUrl: 'testurl.nl/foto.jpg'
    //             })
    //             .end((err, response) => {
    //                 // console.log(response.body);
    //                 response.should.have.status(200);
    //                 response.body.should.be.a('object');
    //                 response.body.should.have.property('movies').should.be.a('object');
    //                 done();
    //             });
    //     })
    // });

    describe('/DELETE director', () => {
        it('should delete a director', (done) => {
            chai.request(server)
                .get('/api/v1/directors')
                .end((err, res) => {
                    chai.request(server)
                        .delete('/api/v1/directors/' + testDirector._id)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.should.be.a('object');
                            res.body.should.have.property('message').equal('Director removed');
                            done();
                        })
                })
        })
    });

    after((done => {
        const {directors} = mongoose.connection.collections;
        directors.drop(() => {
            done();
        });
        // const { movies } = mongoose.connection.collections;
        // movies.drop(() => {
        //     done();
        // });
    }));

});