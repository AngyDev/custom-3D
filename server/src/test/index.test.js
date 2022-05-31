const expect = require("chai").expect;
const request = require("request");

const baseUrl = "http://localhost:3000";

describe("Server up", () => {
  const url = baseUrl + "/";

  it("returns status 200", (done) => {
    request.get(url, (err, res, body) => {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
});
