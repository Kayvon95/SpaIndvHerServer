process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const mongoose = require('mongoose');
const server = require('../server');
const Movie = require('../models/movie');
const testMovie = new Movie ({
    title: 'Batman',
    subtitle: 'The Dark Knight',
    minutes: 152,
    genre: 'Action',
    yearOfRelease: 2008,
    imageUrl: 'www.test.nl/picture.jpg'
});

chai.use(chaiHttp);

describe('Creating a Movie', () => {
    before((next) => {
        testMovie.save()
            .then(() => {
                next();
            });
    });

    describe('/GET Movies', () => {
        it('should return all the movies from MongoDB', (done) => {
            chai.request(server)
                .get('/api/v1/movies')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.not.be.eql(null);
                    res.body.length.should.be.eql(1);
                    res.body.length.should.not.be.eql(2);
                    res.body[0].should.have.property('title').equal('Batman');
                    done();
                });
        });
            it('it should return a specific movie', (done) => {
                chai.request(server)
                    .get('/api/v1/movies/' + testMovie._id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('title').equal('Batman');
                        res.body.should.have.property('subtitle').equal('The Dark Knight');
                        res.body.should.have.property('yearOfRelease').equal(2008);
                        done();
                    });
            });
    });

    // describe('/GET movies (all)', () => {
    //     it('should return all movies from MongoDB', (done) => {
    //         chai.request(server)
    //             .get('/api/v1/movies')
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 should.exist(res.body);
    //                 res.body.should.be.a('array');
    //                 res.body.length.should.be.eql(1);
    //                 res.body.length.should.not.be.eql(2);
    //                 console.log(res.body[1]);
    //                 res.body[1].should.have.property('title').equal('Batman');
    //                 res.body[1].should.have.property('subtitle').equal('The Dark Knight');
    //                 done();
    //             });
    //     });
    //     it('it should return a specific movie', (done) => {
    //         chai.request(server)
    //             .get('/api/v1/movies/' + testMovie._id)
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.body.should.be.a('object');
    //                 res.body.should.have.property('title').equal('Batman');
    //                 res.body.should.have.property('subtitle').equal('The Dark Knight');
    //                 res.body.should.have.property('yearOfRelease').equal(2008);
    //                 done();
    //             });
    //     });
    // });

    describe('/POST movie', () => {
        it('it should post a new movie to the database and return it', (done) => {
            var newMovie = {
                title: 'The Wolf of Wall Street',
                subtitle: '',
                minutes: 180,
                genre: 'Crime',
                yearOfRelease: 2013,
                imageUrl: 'www.test.nl/WOW-poster.jpg'
            };
            chai.request(server)
                .post('/api/v1/movies')
                .send(newMovie)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title').equal('The Wolf of Wall Street');
                    res.body.should.have.property('subtitle').equal('');
                    res.body.should.have.property('yearOfRelease').equal(2013);
                    done();
                });
        });
        it('it should add an actor to a movie and return it', (done) => {
            chai.request(server)
                .put('/api/v1/movies/' + testMovie._id + '/actor')
                .send({firstName: 'Christian',
                    lastName: 'Bale',
                    yearOfBirth: '1974',
                    countryOfOrigin: 'Wales',
                    isDirector: 0,
                    imageUrl: 'www.test.nl/picture.jpg'})
                .end((err, response) => {
                    // console.log(response.body);
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('actors').should.be.a('object');
                    done();
                });
        })
    });

    describe('/DELETE movie', () => {
        it('should delete a movie', (done) => {
            chai.request(server)
                .get('/api/v1/movies')
                .end((err, res) => {
                    chai.request(server)
                        .delete('/api/v1/movies/' + testMovie._id)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.should.be.a('object');
                            res.body.should.have.property('message').equal('Movie removed');
                            done();
                        })
                })
        })
    });

    after((done => {
        const { movies } = mongoose.connection.collections;
        movies.drop(() => {
            done();
        });
    }))
});