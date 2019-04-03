const mongoose = require("mongoose");
const Mockgoose = require("mockgoose").Mockgoose;
const db = {
  Accounts: require("../models/Account"),
  Polls: require("../models/Poll")
};

const keys = require("../config/keys");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");

let mockgoose = new Mockgoose(mongoose);
let should = chai.should();

chai.use(chaiHttp);

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.Promise = Promise;

describe("Polls", () => {
  let pollTestUser;
  before(done => {
    mockgoose.helper.reset().then(() => {
      done();
    });
  });

  before(done => {
    pollTestUser = new db.Accounts({
      email: "poll@testuser.com",
      username: "polltestuser",
      password: "polltestuser"
    });
    pollTestUser.save().then(() => done());
  });

  describe("/GET Polls", () => {
    it("should GET all polls", done => {
      chai
        .request(server)
        .get("/api/polls")
        .query({ search: "" })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("cursor");
          res.body.should.have.property("polls");
          done();
        });
    });
  });

  describe("/POST Polls", () => {
    it("should NOT CREATE a poll - Too few options", done => {
      let poll = {
        creator: pollTestUser.id,
        title: "Test Fail Poll - Title",
        description: "Test Fail Poll - Description",
        options: [{ option: "One", votes: 0 }]
      };
      let agent = chai.request.agent(server);
      agent
        .get("/api/accounts/" + pollTestUser.id)
        .send(pollTestUser)
        .then((err, res) => {
          agent
            .post("/api/polls")
            .send(poll)
            .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a("object");
              res.body.should.have.property("errors");
              res.body.errors.should.have.property("options");
              res.body.errors.options.should.have.property("message");
              done();
            });
        });
    });

    it("should CREATE a poll", done => {
      let poll = {
        creator: pollTestUser.id,
        title: "Test Poll - Title",
        description: "Test Poll - Description",
        options: [{ option: "One", votes: 7 }, { option: "Two", votes: 20 }]
      };
      let agent = chai.request.agent(server);
      agent
        .get("/api/accounts/" + pollTestUser.id)
        .send(pollTestUser)
        .then((err, res) => {
          agent
            .post("/api/polls")
            .send(poll)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.should.have.property("creator").eql(pollTestUser.id);
              res.body.options.should.be.a("array");
              done();
            });
        });
    });
  });

  describe("/GET Poll", () => {
    it("should GET single poll", done => {
      let poll = new db.Polls({
        creator: pollTestUser.id,
        title: "Test Poll 2 - Title",
        description: "Test Poll 2 - Description",
        options: [{ option: "One", votes: 0 }, { option: "Two", votes: 0 }]
      });
      poll.save((err, res) => {
        chai
          .request(server)
          .get("/api/polls/" + poll.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("creator").eql(pollTestUser.id);
            res.body.options.should.be.a("array");
            done();
          });
      });
    });
  });

  describe("/PUT Poll", () => {
    it("should UPDATE single poll", done => {
      let poll = new db.Polls({
        creator: pollTestUser.id,
        title: "Test Poll 3 - Title",
        description: "Test Poll 3 - Description",
        options: [{ option: "One", votes: 0 }, { option: "Two", votes: 0 }]
      });
      let newPoll = {
        title: "Test Poll 3 - Title Updated",
        description: "Test Poll 3 - Description Updated",
        options: [{ option: "One", votes: 1 }, { option: "Two", votes: 10 }]
      };
      poll.save((err, res) => {
        let agent = chai.request.agent(server);
        agent
          .get("/api/accounts/" + pollTestUser.id)
          .send(pollTestUser)
          .then(res => {
            agent
              .put("/api/polls/" + poll.id)
              .send(newPoll)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have
                  .property("title")
                  .eql("Test Poll 3 - Title Updated");
                res.body.should.have
                  .property("description")
                  .eql("Test Poll 3 - Description Updated");
                done();
              });
          });
      });
    });
  });

  describe("/DELETE Poll", () => {
    it("should DELETE single poll", done => {
      let poll = new db.Polls({
        creator: pollTestUser.id,
        title: "Test Poll 4 - Title",
        description: "Test Poll 4 - Description",
        options: [{ option: "One", votes: 0 }, { option: "Two", votes: 0 }]
      });
      poll.save((err, res) => {
        let agent = chai.request.agent(server);
        agent
          .get("/api/accounts/" + pollTestUser.id)
          .send(pollTestUser)
          .then(res => {
            agent
              .delete("/api/polls/" + poll.id)
              .send()
              .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a("object");
                res.body.should.have.property("message").eql("Poll deleted.");
                done();
              });
          });
      });
    });
  });
});

process.env.NODE_ENV = "dev";
