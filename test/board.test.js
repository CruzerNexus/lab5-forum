const chai = require("chai");

const app = require("../src/server");
const expect = chai.expect;
const User = require("../src/models/User");
const Board = require("../src/models/Board");
const bcrypt = require("bcrypt");

describe("express board", () => {
  before(async function() {
    const user = new User({
      email: "asdf@qwerty.com",
      password: "mineTurtle"
    });
    const admin = new User({
      email: "nex@platinus.com",
      password: "shinyb01",
      admin: "true"
    });
    user.passwordHash = bcrypt.hashSync("mineTurtle", 10);
    admin.passwordHash = bcrypt.hashSync("shinyb01", 10);
    await user.save();
    await admin.save();
    this.user = user;
    this.admin = admin;
    const res = await chai
      .request(app)
      .post("/auth/login")
      .send({
        email: this.user.email,
        password: "mineTurtle"
      });
    this.userToken = res.body.token;
    const adminRes = await chai
      .request(app)
      .post("/auth/login")
      .send({
        email: this.admin.email,
        password: "shinyb01"
      });
    this.adminToken = adminRes.body.token;

    this.extraBoard = new Board({
      name: "I exist to show off the list function! :D",
      user: this.user._id
    });
    await this.extraBoard.save();
  });

  it("should create a new board", async function() {
    const res = await chai
      .request(app)
      .post("/board")
      .set("Authorization", "Bearer " + this.adminToken)
      .send({
        name: "First Board!"
      });
    expect(res.body).to.have.property("_id");
    expect(res.body).to.have.property("name");
    expect(res.body).to.have.property("user");
    expect(res.body).to.have.property("createdAt");
    expect(res.body).to.have.property("updatedAt");
    this.boardId = res.body._id;
  });

  it("should NOT create a new board", async function() {
    const res = await chai
      .request(app)
      .post("/board")
      .set("Authorization", "Bearer " + this.userToken)
      .send({
        name: "First User Board!"
      });
    expect(res.status).to.equal(401);
  });

  it("should return a specified board", async function() {
    const res = await chai
      .request(app)
      .get("/board/" + this.boardId);
    expect(res.body._id).to.eq(this.boardId);
  });

  it("should update a specified board", async function(){
    const res = await chai
      .request(app)
      .patch("/board/" + this.boardId)
      .set("Authorization", "Bearer " + this.adminToken)
      .send({
        name: "First Board (2.0 Update)!"
      });
      expect(res.body.name).to.eq("First Board (2.0 Update)!");
  });

  it("should NOT update a specified board", async function(){
    const res = await chai
      .request(app)
      .patch("/board/" + this.boardId)
      .set("Authorization", "Bearer " + this.userToken)
      .send({
        name: "First User Board (Long live the people's revolution)!"
      });
      expect(res.status).to.eq(401);
  });

  it("should list all boards", async function(){
    const res = await chai
      .request(app)
      .get("/board");
    console.log(res.body);
    expect(res.body).to.be.an("array").lengthOf(2);
  })

  it("should NOT delete specified board", async function(){
    const res = await chai
      .request(app)
      .delete("/board/" + this.boardId)
      .set("Authorization", "Bearer " + this.userToken);
    expect(res.status).to.eq(401);
  });

  it("should delete specified board", async function(){
    const res = await chai
      .request(app)
      .delete("/board/" + this.boardId)
      .set("Authorization", "Bearer " + this.adminToken);
      const board = await Board.findOne({ _id: this.boardId });
      expect(board).to.not.exist;
  });
});
