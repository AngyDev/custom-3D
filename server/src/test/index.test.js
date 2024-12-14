const expect = require("chai").expect;
const axios = require("axios");

const baseUrl = "http://localhost:3000";

describe("Server up", () => {
  const url = baseUrl + "/";

  it("returns status 200", async () => {
    const response = await axios.get(url);
    expect(response.status).to.equal(200);
  });
});
