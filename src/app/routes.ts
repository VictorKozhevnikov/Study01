import { Router } from "express";
import { findShortestPath } from '../flights/flights';

export const routes = Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Helllo World" });
});

routes.get("/route", (req, res) => {
  const from = req.query.from;
  const to = req.query.to;

  const maxHops = 4;

  if (typeof(from) === "string" && typeof(to) === "string") {
    console.log(findShortestPath({from, to, maxHops}));
    return res.json({ from, to }); 
  }

  return res.status(400).send();
});
