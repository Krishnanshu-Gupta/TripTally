import express, { Request, Response } from "express";
import Saved from "../services/save-svc";

const router = express.Router();

router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const savedExperiences = await Saved.getSavedForUser(userId);
    res.status(200).json(savedExperiences);
  } catch (err) {
    res.status(500).json({ error: `Error fetching saved experiences: ${err}` });
  }
});

router.post("/:userId", (req: Request, res: Response) => {
  const { userId } = req.params;
  const { experienceId } = req.body;

  Saved.addSavedExperience(userId, experienceId)
    .then(() =>
      res.status(201).json({ message: "Experience saved successfully" })
    )
    .catch((err) =>
      res.status(500).json({ error: `Error saving experience: ${err}` })
    );
});

router.delete("/:userId", (req: Request, res: Response) => {
  const { userId } = req.params;
  const { experienceId } = req.body;

  Saved.removeSavedExperience(userId, experienceId)
    .then(() =>
      res.status(200).json({ message: "Experience removed successfully" })
    )
    .catch((err) =>
      res.status(500).json({ error: `Error removing experience: ${err}` })
    );
});

export default router;
