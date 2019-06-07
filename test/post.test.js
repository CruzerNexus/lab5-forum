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
});