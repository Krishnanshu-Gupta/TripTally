import express, { Request, Response } from "express";
import Experiences from "../services/experience-svc";
import { Experience } from "../models/experience";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Experiences.index()
    .then((list: Experience[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Experiences.getExperience(id)
    .then((experience: Experience) => res.json(experience))
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newExperience = req.body;

  Experiences.create(newExperience)
    .then((experience: Experience) => res.status(201).json(experience))
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedExperience = req.body;

  Experiences.update(id, updatedExperience)
    .then((experience: Experience) => res.json(experience))
    .catch((err) => res.status(404).send(err));
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Experiences.remove(id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
