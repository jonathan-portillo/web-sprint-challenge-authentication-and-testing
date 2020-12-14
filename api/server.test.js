const request = require("supertest");
const server = require("./server");

describe("server.js", () => {
  test("make sure Server is working", () => {
    expect(process.env.DB_ENV).toBe("testing");
  });
});

describe("GET /", () => {
  test("Returns 200", () => {
    return request(server)
      .get("/")
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  test("should return api is up", () => {
    return request(server)
      .get("/")
      .then((res) => {
        expect(res.body).toEqual({ api: "is up" });
      });
  });

  test("JSON Body", () => {
    return request(server)
      .get("/")
      .then((res) => {
        expect(res.type).toBe("application/json");
      });
  });
});
