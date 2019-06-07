const chai = require("chai");

const app = require("../src/server");
const expect = chai.expect;
const User = require("../src/models/User")
const bcrypt = require("bcrypt");

describe("express auth", () => {
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
  });

  it("should create a new user", async() => {
    const res = await chai
      .request(app)
      .post("/auth/sign-up")
      .send({
        email: "scrambles@deathdealer.com",
        password: "hurricane",
        passwordConfirm: "hurricane",
      });
    expect(res.body).to.have.property("email");
    expect(res.body).to.have.property("admin");
    expect(res.body).to.not.have.property("password");
    expect(res.body).to.not.have.property("passwordHash");
  });

  it("should send user token", async function(){
    const res = await chai
      .request(app)
      .post("/auth/login")
      .send({
        email: this.user.email,
        password: "mineTurtle"
      });
    expect(res.body).to.have.property("token");
  });
});
