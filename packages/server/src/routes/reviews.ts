import express, { Request, Response } from "express";
import Reviews from "../services/review-svc";
import { Review } from "../models/review";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const reviews = await Reviews.getReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to get reviews" });
  }
});

router.get("/:experienceId", async (req: Request, res: Response) => {
  try {
    const { experienceId } = req.params;
    const reviews: Review[] = await Reviews.getReviewsForExperience(
      experienceId
    );
    res.status(200).json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({ error: `Error fetching reviews for experience: ${err}` });
  }
});

router.get("/review/:reviewId", async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const review: Review = await Reviews.getReviewById(reviewId);
    res.status(200).json(review);
  } catch (err) {
    res.status(404).json({ error: `Review not found: ${err}` });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const newReview: Partial<Review> = req.body;
    const review: Review = await Reviews.createReview(newReview);
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: `Error creating review: ${err}` });
  }
});

router.put("/:reviewId", async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const updatedReview: Partial<Review> = req.body;
    const review: Review = await Reviews.updateReview(reviewId, updatedReview);
    res.status(200).json(review);
  } catch (err) {
    res.status(404).json({ error: `Error updating review: ${err}` });
  }
});

router.delete("/:reviewId", async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    await Reviews.deleteReview(reviewId);

    res.status(204).end();
  } catch (err) {
    res.status(404).json({ error: `Error deleting review: ${err}` });
  }
});

export default router;
