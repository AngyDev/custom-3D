const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;
chai.use(chaiHttp); // HTTP integration testing with Chai assertions.
chai.should(); // Chai should assertions.

const baseUrl = "http://localhost:3000/api";
const url = baseUrl + "/user";

describe("User CRUD", () => {
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "test@gmail.com",
    password: "123456",
    role: "admin",
  };

  it("should create a new user", (done) => {
    chai
      .request(url)
      .post("/")
      .send(user)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it("should get all users, get one user, delete the user", (done) => {
    chai
      .request(baseUrl)
      .get("/users")
      .end((err, res) => {
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf.at.least(1);

        const userRes = res.body.find((item) => item.firstName === user.firstName);
        expect(userRes).to.have.property("id");
        const userId = userRes.id;

        chai
          .request(baseUrl)
          .get("/user/" + userId)
          .end((err, res) => {
            expect(res.body).to.be.an("object");
            const user = res.body;
            expect(res.body).to.have.property("id");
            expect(res.body.id).to.equal(userId);
          });

        chai
          .request(baseUrl)
          .delete("/user/" + userId)
          .end((err, res) => {
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("message");
            expect(res.body.message).to.equal("User deleted");

            done();
          });
      });

    //
  });
});
