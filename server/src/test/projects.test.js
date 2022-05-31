const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;

const baseUrl = "http://localhost:3000/api";
const url = baseUrl + "/project";

describe("Project CRUD", () => {
  const project = {
    projectName: "API Test",
    patientCode: "Patient API Test",
    status: "start",
    assignedAt: null,
    userId: "d27db05e-fb3f-4942-a517-59fefbd97937",
  };

  const projectUpdate = {
    projectName: "API Test",
    patientCode: "Patient API Test",
    status: "in progress",
    assignedAt: null,
    userId: "d27db05e-fb3f-4942-a517-59fefbd97937",
  };

  it("should create a new project, get the created project and  delete the project", (done) => {
    chai
      .request(url)
      .post("/")
      .send(project)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);

        const id = res.body.id;

        chai
          .request(url)
          .get("/" + id)
          .end((err, res) => {
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("project");
            expect(res.body).to.have.property("objectsPath");
            expect(res.body.project.id).to.equal(id);
          });

        chai
          .request(url)
          .delete("/" + id)
          .end((err, res) => {
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("message");
            expect(res.body.message).to.equal("Project deleted");
          });
        done();
      });
  });

  it("should create a new project and update it", (done) => {
    chai
      .request(url)
      .post("/")
      .send(project)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);

        const id = res.body.id;

        chai
          .request(url)
          .put("/" + id)
          .send(projectUpdate)
          .end((err, res) => {
            expect(res.body).to.be.an("object");
            expect(res.body.id).to.equal(id);
            expect(res.body.status).to.equal("in progress");
            done();
          });
      });
  });

  it("should get all projects", (done) => {
    chai
      .request(baseUrl)
      .get("/projects")
      .end((err, res) => {
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf.at.least(1);
        done();
      });
  });

  it("should get the projects by user id", (done) => {
    const userId = "d27db05e-fb3f-4942-a517-59fefbd97937";
    chai
      .request(baseUrl)
      .get("/project-user/" + userId)
      .end((err, res) => {
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf.at.least(1);
        done();
      });
  });
});
