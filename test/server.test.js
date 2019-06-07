const chai = require("chai");

const app = require("../src/server");
const expect = chai.expect;

describe("express server", () => {
  it("should return hello", async () => {
    const res = await chai.request(app).get("/");

    expect(res.text).to.eq("hello");
  });
});
