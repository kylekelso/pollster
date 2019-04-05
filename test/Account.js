process.env.NODE_ENV = "test";

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

describe("Accounts", () => {
  before(done => {
    mockgoose.prepareStorage().then(function() {
      mongoose.connect(
        keys.MONGO_URI,
        {
          keepAlive: true,
          useNewUrlParser: true
        },
        function() {
          done();
        }
      );
    });
  });

  describe("/GET Accounts", () => {
    it("should GET all accounts", done => {
      chai
        .request(server)
        .get("/api/accounts")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("paging");
          res.body.paging.should.have.property("pages");
          res.body.paging.should.have.property("prev");
          res.body.paging.should.have.property("next");
          res.body.should.have.property("accounts");
          done();
        });
    });
  });

  describe("/POST Account", () => {
    it("should not CREATE new account - Missing field", done => {
      let account = {
        email: "test@fail.com",
        password: "testfail"
      };
      chai
        .request(server)
        .post("/api/accounts")
        .send(account)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          res.body.errors.should.have.property("username");
          res.body.errors.username.should.have.property("kind");
          done();
        });
    });
    it("should CREATE new account", done => {
      let account = {
        email: "test@success.com",
        username: "testsuccess",
        password: "testsuccess"
      };
      chai
        .request(server)
        .post("/api/accounts")
        .send(account)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("id");
          res.body.should.have.property("username");
          done();
        });
    });
  });

  describe("/GET Account", () => {
    it("should GET a single account", done => {
      let account = new db.Accounts({
        email: "test2@success.com",
        username: "test2success",
        password: "test2success"
      });
      account.save((err, res) => {
        chai
          .request(server)
          .get("/api/accounts/" + account.id)
          .send(account)
          .end((err, res) => {
            res.should.have.cookie("session");
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("id");
            res.body.should.have.property("username");
            done();
          });
      });
    });
  });

  describe("/PUT Account", () => {
    it("should NOT UPDATE account - No session", done => {
      let account = new db.Accounts({
        email: "test3@fail",
        username: "test3fail",
        password: "test3fail"
      });

      account.save((err, res) => {
        let agent = chai.request.agent(server);
        agent
          .put("/api/accounts/" + account.id)
          .send({ username: "test3updated" })
          .end((err, res) => {
            res.should.have.status(401);
            res.should.be.a("object");
            res.body.should.have.property("error");
            done();
          });
      });
    });
    it("should UPDATE account", done => {
      let account = new db.Accounts({
        email: "test3@success.com",
        username: "test3success",
        password: "test3success"
      });

      account.save((err, res) => {
        let agent = chai.request.agent(server);
        agent
          .get("/api/accounts/" + account.id)
          .send(account)
          .then(res => {
            agent
              .put("/api/accounts/" + account.id)
              .send({ newUsername: "test3updated" })
              .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a("object");
                res.body.should.have.property("id");
                res.body.should.have.property("username");
                done();
              });
          });
      });
    });
  });

  describe("/DELETE Account", () => {
    it("should NOT DELETE account - No session", done => {
      let account = new db.Accounts({
        email: "test4@fail.com",
        username: "test4fail",
        password: "test4fail"
      });
      account.save((err, res) => {
        let agent = chai.request.agent(server);
        agent
          .delete("/api/accounts/" + account.id)
          .send()
          .end((err, res) => {
            res.should.have.status(401);
            res.should.be.a("object");
            res.body.should.have.property("error");
            done();
          });
      });
    });
    it("should DELETE account", done => {
      let account = new db.Accounts({
        email: "test4@success.com",
        username: "test4success",
        password: "test4success"
      });
      account.save((err, res) => {
        let agent = chai.request.agent(server);
        agent
          .get("/api/accounts/" + account.id)
          .send(account)
          .then(res => {
            agent
              .delete("/api/accounts/" + account.id)
              .send()
              .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a("object");
                res.body.should.have
                  .property("message")
                  .eql("Account deleted.");
                done();
              });
          });
      });
    });
  });
});

process.env.NODE_ENV = "dev";
