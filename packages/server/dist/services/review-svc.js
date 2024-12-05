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
var review_svc_exports = {};
__export(review_svc_exports, {
  default: () => review_svc_default
});
module.exports = __toCommonJS(review_svc_exports);
var import_mongoose = require("mongoose");
const ReviewSchema = new import_mongoose.Schema({
  experienceId: { type: String, required: true },
  // Always store experienceId as a string
  userID: { type: import_mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  user: { type: String, required: true },
  overallRating: { type: Number, required: true },
  valueForMoney: { type: Number, required: true },
  accessibility: { type: Number, required: true },
  uniqueness: { type: Number, required: true },
  comment: { type: String, trim: true }
}, { collection: "reviews", timestamps: true });
const ReviewModel = import_mongoose.models.Review || (0, import_mongoose.model)("Review", ReviewSchema);
async function getReviewsForExperience(experienceId) {
  try {
    const reviews = await ReviewModel.find({ experienceId: String(experienceId) }).sort({ createdAt: -1 }).exec();
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}
function getReviewById(reviewId) {
  return ReviewModel.findById(reviewId).then((review) => {
    if (!review) {
      throw new Error(`Review with ID ${reviewId} not found`);
    }
    return review;
  });
}
function createReview(json) {
  const review = new ReviewModel(json);
  return review.save();
}
function updateReview(reviewId, updatedReview) {
  return ReviewModel.findByIdAndUpdate(reviewId, updatedReview, { new: true }).then((updated) => {
    if (!updated) throw new Error(`Review with ID ${reviewId} not updated`);
    return updated;
  });
}
function deleteReview(reviewId) {
  return ReviewModel.findByIdAndDelete(reviewId).then((deleted) => {
    if (!deleted) throw new Error(`Review with ID ${reviewId} not deleted`);
  });
}
var review_svc_default = {
  getReviewsForExperience,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
};
