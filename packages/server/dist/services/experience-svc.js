"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var experience_svc_exports = {};
__export(experience_svc_exports, {
  default: () => experience_svc_default
});
module.exports = __toCommonJS(experience_svc_exports);
var import_mongoose = require("mongoose");
const ReviewSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    experienceId: { type: String, required: true },
    userID: { type: import_mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    user: { type: String, required: true },
    overallRating: { type: Number, required: true },
    valueForMoney: { type: Number, required: true },
    accessibility: { type: Number, required: true },
    uniqueness: { type: Number, required: true },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { collection: "reviews", timestamps: true }
);
const ReviewModel = (0, import_mongoose.model)("Review", ReviewSchema);
const ExperienceSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, default: 0 },
    reviewCount: { type: Number, default: 0 },
    user: { type: String, required: true, trim: true },
    userID: { type: import_mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    description: { type: String, required: true, trim: true }
  },
  { collection: "experiences", timestamps: true }
);
const ExperienceModel = (0, import_mongoose.model)("Experience", ExperienceSchema);
async function index(filter = {}) {
  const experiences = await ExperienceModel.find(filter).lean().exec();
  await Promise.all(
    experiences.map((experience) => updateRatingsAndReviewCount(experience.id))
  );
  return experiences.map((experience) => ({
    ...experience,
    userID: experience.userID.toString()
  }));
}
async function getExperience(id) {
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
    userID: experience.userID.toString()
  };
}
async function aggregateReviews(experienceId) {
  const result = await ReviewModel.aggregate([
    { $match: { experienceId } },
    {
      $group: {
        _id: "$experienceId",
        averageRating: { $avg: "$overallRating" },
        count: { $sum: 1 }
      }
    }
  ]);
  return result[0] || { averageRating: 0, count: 0 };
}
async function getReviewsForExperience(experienceId) {
  const reviews = await ReviewModel.find({ experienceId }).sort({ createdAt: -1 }).lean().exec();
  return reviews.map((review) => ({
    ...review,
    experienceId: review.experienceId,
    userID: review.userID.toString()
  }));
}
async function create(json) {
  const experience = new ExperienceModel(json);
  const saved = await experience.save();
  return saved.toObject();
}
async function update(id, experience) {
  const updated = await ExperienceModel.findOneAndUpdate({ id }, experience, {
    new: true
  }).lean();
  if (!updated) {
    throw new Error(`Experience with ID ${id} not updated`);
  }
  return {
    ...updated,
    userID: updated.userID.toString()
  };
}
async function remove(id) {
  const deleted = await ExperienceModel.findOneAndDelete({ id }).exec();
  if (!deleted) {
    throw new Error(`Experience with ID ${id} not deleted`);
  }
}
async function updateRatingsAndReviewCount(experienceId) {
  const { averageRating, count } = await aggregateReviews(experienceId);
  await ExperienceModel.findOneAndUpdate(
    { id: experienceId },
    { rating: averageRating, reviewCount: count },
    { new: true }
  ).exec();
}
ReviewSchema.post("save", async function(doc) {
  await updateRatingsAndReviewCount(doc.experienceId);
});
ReviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function(doc) {
    if (doc) {
      await updateRatingsAndReviewCount(doc.experienceId);
    }
  }
);
var experience_svc_default = {
  index,
  getExperience,
  create,
  update,
  remove,
  getReviewsForExperience,
  updateRatingsAndReviewCount
};
