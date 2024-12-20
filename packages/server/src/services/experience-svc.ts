import { Schema, model, Types } from "mongoose";
import { Experience } from "../models";
import { Review } from "../models/review";

const ReviewSchema = new Schema<Review>(
  {
    id: { type: String, required: true, unique: true },
    experienceId: { type: String, required: true },
    userID: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    user: { type: String, required: true },
    overallRating: { type: Number, required: true },
    valueForMoney: { type: Number, required: true },
    accessibility: { type: Number, required: true },
    uniqueness: { type: Number, required: true },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "reviews", timestamps: true }
);

const ReviewModel = model<Review>("Review", ReviewSchema);

// Experience Schema
const ExperienceSchema = new Schema<Experience>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, default: 0 },
    reviewCount: { type: Number, default: 0 },
    user: { type: String, required: true, trim: true },
    userID: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    description: { type: String, required: true, trim: true },
  },
  { collection: "experiences", timestamps: true }
);

const ExperienceModel = model<Experience>("Experience", ExperienceSchema);

async function index(filter: Partial<Experience> = {}): Promise<Experience[]> {
  const experiences = await ExperienceModel.find(filter).lean().exec();
  await Promise.all(
    experiences.map((experience) => updateRatingsAndReviewCount(experience.id))
  );
  return experiences.map((experience) => ({
    ...experience,
    userID: experience.userID.toString(),
  })) as Experience[];
}

async function getExperience(id: string): Promise<Experience> {
  await updateRatingsAndReviewCount(id);
  const experience = await ExperienceModel.findOne({ id }).lean();

  if (!experience) {
    throw new Error(`Experience with ID ${id} not found`);
  }

  const reviews = await aggregateReviews(id);
  experience.rating = reviews.averageRating || 0;
  experience.reviewCount = reviews.count || 0;

  return {
    ...experience,
    userID: experience.userID.toString(),
  } as Experience;
}

async function aggregateReviews(experienceId: string): Promise<{
  averageRating: number;
  count: number;
}> {
  const result = await ReviewModel.aggregate([
    { $match: { experienceId } },
    {
      $group: {
        _id: "$experienceId",
        averageRating: { $avg: "$overallRating" },
        count: { $sum: 1 },
      },
    },
  ]);

  return result[0] || { averageRating: 0, count: 0 };
}

async function getReviewsForExperience(
  experienceId: string
): Promise<Review[]> {
  const reviews = await ReviewModel.find({ experienceId })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return reviews.map((review) => ({
    ...review,
    experienceId: review.experienceId,
    userID: review.userID.toString(),
  })) as Review[];
}

async function create(json: Experience): Promise<Experience> {
  const experience = new ExperienceModel(json);
  const saved = await experience.save();
  return saved.toObject() as Experience;
}

async function update(
  id: string,
  experience: Partial<Experience>
): Promise<Experience> {
  const updated = await ExperienceModel.findOneAndUpdate({ id }, experience, {
    new: true,
  }).lean();

  if (!updated) {
    throw new Error(`Experience with ID ${id} not updated`);
  }

  return {
    ...updated,
    userID: updated.userID.toString(),
  } as Experience;
}

async function remove(id: string): Promise<void> {
  const deleted = await ExperienceModel.findOneAndDelete({ id }).exec();

  if (!deleted) {
    throw new Error(`Experience with ID ${id} not deleted`);
  }
}

async function updateRatingsAndReviewCount(
  experienceId: string
): Promise<void> {
  const { averageRating, count } = await aggregateReviews(experienceId);

  await ExperienceModel.findOneAndUpdate(
    { id: experienceId },
    { rating: averageRating, reviewCount: count },
    { new: true }
  ).exec();
}

ReviewSchema.post("save", async function (doc) {
  await updateRatingsAndReviewCount(doc.experienceId);
});

ReviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function (doc) {
    if (doc) {
      await updateRatingsAndReviewCount(doc.experienceId);
    }
  }
);

export default {
  index,
  getExperience,
  create,
  update,
  remove,
  getReviewsForExperience,
  updateRatingsAndReviewCount,
};
