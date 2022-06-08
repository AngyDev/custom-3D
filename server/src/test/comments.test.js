const chai = require("chai");
const expect = chai.expect;

const baseUrl = "http://localhost:3000/api";
const url = baseUrl + "/comment";

describe("Comment CRUD", () => {
  const comment = {
    userId: "d27db05e-fb3f-4942-a517-59fefbd97937",
    projectId: "68e1f2b2-f7ba-47eb-a3e5-2ade3f9a4fee",
    pointId: "71E07740-7EE3-48C7-B3BD-027DA07F336A",
    text: "Comment created for test",
  };

  it("should create a new comment and delete it", (done) => {
    chai
      .request(url)
      .post("/")
      .send(comment)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);

        const comment = res.body.find((item) => item.text === "Comment created for test");
        const id = comment.id;

        chai
          .request(url)
          .delete("/" + id)
          .end((err, res) => {
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("message");
            expect(res.body.message).to.equal("Comment deleted");
          });

        done();
      });
  });
});
