import { Router } from "express";

export const routes = Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Helllo World" });
});

routes.get("/route", (req, res) => {
  const from = req.query.from;
  const to = req.query.to;

  return res.json({ from, to });
});
