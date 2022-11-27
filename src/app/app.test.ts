import request from "supertest";
import { app } from "./app";

describe("app", () => {
  it("should return hello world", async () =>
    request(app).get("/").expect(200).expect({ message: "Helllo World" }));

  it("should find the route - case 1", () =>
    request(app)
      .get("/route?from=BRU&to=JFK")
      .expect(200)
      .expect((response) => {
        expect(response.body?.path.sections).toEqual([
          { from: "BRU", to: "EWR" },
          { from: "EWR", to: "PHL" },
          { from: "PHL", to: "JFK" },
        ]);
      }));

  it("should find the route - case 2", () =>
    request(app)
      .get("/route?from=SJC&to=UFA")
      .expect(200)
      .expect((response) => {
        expect(response.body?.path.sections).toEqual([
          { from: "SJC", to: "LAX" },
          { from: "LAX", to: "JED" },
          { from: "JED", to: "SHJ" },
          { from: "SHJ", to: "UFA" },
        ]);
      }));

  it("should not exceed maximum number of flights", () =>
    request(app)
      .get("/route?from=ANC&to=ASP&maxFlights=2")
      .expect(200)
      .expect({ path: null }));
});
