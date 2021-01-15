let chai = require('chai');
let server = require('../app');
let chaiHttp = require('chai-http');
//Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Campgrounds API', ()=>{
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