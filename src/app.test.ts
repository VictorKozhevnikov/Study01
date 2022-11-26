import request from "supertest";
import { app } from "./app";

describe("app", () => {
  it("should return hello world", async () =>
    request(app).get("/").expect(200).expect({ message: "Helllo World" }));

  it("should parse the input", async () =>
    request(app)
      .get("/route?from=BRU&to=JFK")
      .expect(200)
      .expect({ from: "BRU", to: "JFK" }));
});
