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
  /**
     * Test the GET route
     */
    describe('GET /campgrounds', ()=>{
        it("It should GET all the campgrounds", (done) => {
            chai.request(server)
                .get("/campgrounds")
                .end((err, res) => {
                    res.should.have.status(200);
                done();
                })
        })
    })
    


    
})


    

    
        
