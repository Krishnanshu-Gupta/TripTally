import { Schema, model, models } from "mongoose";
import { Review } from "../models";

const ReviewSchema = new Schema<Review>(
  {
    id: { type: String, required: true },
    experienceId: { type: String, required: true },
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: String, required: true },
    overallRating: { type: Number, required: true },
    valueForMoney: { type: Number, required: true },
    accessibility: { type: Number, required: true },
    uniqueness: { type: Number, required: true },
    comment: { type: String, trim: true },
  },
  { collection: "reviews", timestamps: true }
);

const ReviewModel = models.Review || model<Review>("Review", ReviewSchema);

async function getReviews(): Promise<Review[]> {
  return await ReviewModel.find().sort({ createdAt: -1 }).exec();
}

async function getReviewsForExperience(
  experienceId: string
): Promise<Review[]> {
  try {
    const reviews = await ReviewModel.find({
      experienceId: String(experienceId),
    })
      .sort({ createdAt: -1 })
      .exec();
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}

function getReviewById(reviewId: string): Promise<Review> {
  return ReviewModel.findOne({ id: reviewId }).then((review) => {
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

async function updateReview(
  reviewId: string,
  updatedReview: Partial<Review>
): Promise<Review> {
  try {
    const updated = await ReviewModel.findOneAndUpdate(
      { id: reviewId },
      updatedReview,
      { new: true }
    );
    if (!updated) throw new Error(`Review with ID ${reviewId} not updated`);
    return updated;
  } catch (error) {
    console.error(`Error updating review with ID ${reviewId}:`, error);
    throw error;
  }
}

async function deleteReview(reviewId: string): Promise<void> {
  try {
    const deleted = await ReviewModel.findOneAndDelete({ id: reviewId });
    if (!deleted) {
      throw new Error(`Review with ID ${reviewId} not deleted`);
    }
  } catch (error) {
    console.error(`Error deleting review with ID ${reviewId}:`, error);
    throw error;
  }
}

export default {
  getReviews,
  getReviewsForExperience,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
