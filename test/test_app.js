let chai = require('chai');
let server = require('../app');
let chaiHttp = require('chai-http');
const helpers = require('../middleware')
const sinon = require('sinon')
const express = require('express')
//Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Campgrounds API', ()=>{


    /**
     * test the GET/campgrounds:id route
     */
    describe('GET /campgrounds/:id', ()=>{
        it("It should GET a single campground", (done) => {
            chai.request(server)
                .get("/campgrounds/5ffed3b3dba5f630141f02fe")
                .end((err, res) => {
                    res.should.have.status(200);
                done();
                })
        })
    })

    describe('POST/campgrounds', ()=>{
        it('Create new camp', async function(done) {
            console.log("YOOOOOOOOO")
            // helpers.isLoggedIn.callsFake((req, res, next) => {
            //     return (req, res, next) => {
            //         next();
            //     };
            // })
            
            sinon.stub(helpers, 'validateCampground')
            helpers.validateCampground.callsFake((req, res, next) => {
                return (req, res, next) => {
                    next();
                };
            })
            chai.request(server)
            .post('/campgrounds')
            .end(function(err, res2) {
                res2.should.have.status(200);
                // helpers.isLoggedIn.restore()
                helpers.validateCampground.restore()
            
            })
            done();
            
        });
    });

    


    
})


    

    
        
