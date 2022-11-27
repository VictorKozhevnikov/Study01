import request from "supertest";
import { app } from "./app";

describe("app", () => {
  it("should return hello world", async () =>
    request(app).get("/").expect(200).expect({ message: "Helllo World" }));

  it("should find the route - direct", () =>
    request(app)
      .get("/route?from=BRU&to=JFK")
      .expect(200)
      .expect((response) => {
        expect(response.body?.path.sections).toEqual([
          { from: "BRU", to: "JFK" },
        ]);
      }));

  it("should find the route - 2 flights", () =>
    request(app)
      .get("/route?from=BRU&to=UFA")
      .expect(200)
      .expect((response) => {
        expect(response.body?.path.sections).toEqual([
          { from: "BRU", to: "SVO" },
          { from: "SVO", to: "UFA" },
        ]);
      }));

  it("should find the route - 3 flights", () =>
    request(app)
      .get("/route?from=SJC&to=UFA")
      .expect(200)
      .expect((response) => {
        expect(response.body?.path.sections).toEqual([
          { from: "SJC", to: "LAX" },
          { from: "LAX", to: "SVO" },
          { from: "SVO", to: "UFA" },
        ]);
      }));

  it("should find the route - 4 flights", () =>
    request(app)
      .get("/route?from=ANC&to=AYQ")
      .expect(200)
      .expect((response) => {
        expect(response.body?.path.sections).toEqual([
          { from: "ANC", to: "HNL" },
          { from: "HNL", to: "BNE" },
          { from: "BNE", to: "ASP" },
          { from: "ASP", to: "AYQ" },
        ]);
      }));

  it.todo("should not exceed default number of flights");

  it("should not exceed maximum number of flights", () =>
    request(app)
      .get("/route?from=ANC&to=ASP&maxFlights=2")
      .expect(200)
      .expect({ path: null }));

  it.todo('departure airport not found');
  it.todo('destination airport not found');
});
