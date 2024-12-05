import { Schema, model, models } from "mongoose";
import { Review } from "../models";

// Define the Review schema
const ReviewSchema = new Schema<Review>({
    experienceId: { type: String, required: true }, // Always store experienceId as a string
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: String, required: true },
    overallRating: { type: Number, required: true },
    valueForMoney: { type: Number, required: true },
    accessibility: { type: Number, required: true },
    uniqueness: { type: Number, required: true },
    comment: { type: String, trim: true },
  }, { collection: "reviews", timestamps: true });

const ReviewModel = models.Review || model<Review>("Review", ReviewSchema);

async function getReviewsForExperience(experienceId: string): Promise<Review[]> {
    try {
      const reviews = await ReviewModel.find({ experienceId: String(experienceId) }).sort({ createdAt: -1 }).exec();
      return reviews;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  }

function getReviewById(reviewId: string): Promise<Review> {
  return ReviewModel.findById(reviewId).then((review) => {
    if (!review) {
      throw new Error(`Review with ID ${reviewId} not found`);
    }
    return review;
  });
}

function createReview(json: Partial<Review>): Promise<Review> {
  const review = new ReviewModel(json);
  return review.save();
}

function updateReview(reviewId: string, updatedReview: Partial<Review>): Promise<Review> {
  return ReviewModel.findByIdAndUpdate(reviewId, updatedReview, { new: true }).then((updated) => {
    if (!updated) throw new Error(`Review with ID ${reviewId} not updated`);
    return updated;
  });
}

function deleteReview(reviewId: string): Promise<void> {
  return ReviewModel.findByIdAndDelete(reviewId).then((deleted) => {
    if (!deleted) throw new Error(`Review with ID ${reviewId} not deleted`);
  });
}

export default {
  getReviewsForExperience,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
