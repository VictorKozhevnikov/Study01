import request from "supertest";
import { app } from "./app";

describe("app", () => {
  it("should return hello world", async () =>
    request(app)
    .get("/")
    .expect(200)
    .expect({message: 'Helllo World'})
    );
});
