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

  describe("GET /api/accounts", () => {
    it("should get accounts with paging properties", done => {
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

  describe("GET /api/acconts/:username", () => {
    it("should not get a single account - User does not exist", done => {
      let account = new db.Accounts({
        email: "test2@success.com",
        username: "test2success",
        password: "test2success"
      });
      account.save((err, res) => {
        chai
          .request(server)
          .get("/api/accounts/DoesNotExist")
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a(
              "string",
              "Unknown database error has occured."
            );
            done();
          });
      });
    });

    it("should get a single account", done => {
      let account = new db.Accounts({
        email: "test1@success.com",
        username: "test1success",
        password: "test1success"
      });
      account.save((err, res) => {
        chai
          .request(server)
          .get("/api/accounts/" + account.username)
          .end((err, res) => {
            res.should.have.not.cookie("session");
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("id");
            res.body.should.have.property("username");
            done();
          });
      });
    });
  });

  describe("POST /api/acconts/signin", () => {
    it("should not signin - wrong creds", done => {
      let account = new db.Accounts({
        email: "test2@success.com",
        username: "test2success",
        password: "test2success"
      });
      account.save((err, res) => {
        chai
          .request(server)
          .post("/api/accounts/signin")
          .send({ username: "test2success", password: "wrongpass" })
          .end((err, res) => {
            res.should.have.status(401);
            res.should.have.not.cookie("session");
            done();
          });
      });
    });

    it("should signin", done => {
      let account = new db.Accounts({
        email: "test2@success.com",
        username: "test2success",
        password: "test2success"
      });
      account.save((err, res) => {
        chai
          .request(server)
          .post("/api/accounts/signin")
          .send({ username: "test2success", password: "test2success" })
          .end((err, res) => {
            res.should.have.status(200);
            res.should.have.cookie("session");
            res.body.should.be.a("object");
            res.body.should.have.property("id");
            res.body.should.have.property("username");
            done();
          });
      });
    });
  });

  describe("POST /api/accounts/signup", () => {
    it("should not CREATE new account - Missing field", done => {
      let account = {
        email: "test@fail.com",
        password: "testfail"
      };
      chai
        .request(server)
        .post("/api/accounts/signup")
        .send(account)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("String", "Unknown database error has occured.");
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
        .post("/api/accounts/signup")
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

  describe("PUT /api/accounts/:username", () => {
    it("should NOT UPDATE account - No session", done => {
      let account = new db.Accounts({
        email: "test3@fail",
        username: "test3fail",
        password: "test3fail"
      });

      account.save((err, res) => {
        let agent = chai.request.agent(server);
        agent
          .put("/api/accounts/" + account.username)
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
          .post("/api/accounts/signin")
          .send({ username: "test3success", password: "test3success" })
          .then(res => {
            agent
              .put("/api/accounts/" + account.username)
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

  describe("DELETE /api/accounts/:username", () => {
    it("should NOT DELETE account - No session", done => {
      let account = new db.Accounts({
        email: "test4@fail.com",
        username: "test4fail",
        password: "test4fail"
      });
      account.save((err, res) => {
        let agent = chai.request.agent(server);
        agent
          .delete("/api/accounts/" + account.username)
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
          .post("/api/accounts/signin")
          .send({ username: "test4success", password: "test4success" })
          .then(res => {
            agent
              .delete("/api/accounts/" + account.username)
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

  describe("DELETE /api/accounts/logout", () => {
    it("should logout user", done => {
      let account = new db.Accounts({
        email: "test5@success.com",
        username: "test5success",
        password: "test5success"
      });
      account.save((err, res) => {
        let agent = chai.request.agent(server);
        agent
          .post("/api/accounts/signin")
          .send({ username: "test5success", password: "test5success" })
          .then(res => {
            agent
              .delete("/api/accounts/logout")
              .send()
              .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a("object");
                res.body.should.have.property("isAuthenticated").eql(false);
                done();
              });
          });
      });
    });
  });
});

process.env.NODE_ENV = "dev";
