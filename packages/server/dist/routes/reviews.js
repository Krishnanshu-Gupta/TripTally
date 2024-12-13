"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var reviews_exports = {};
__export(reviews_exports, {
  default: () => reviews_default
});
module.exports = __toCommonJS(reviews_exports);
var import_express = __toESM(require("express"));
var import_review_svc = __toESM(require("../services/review-svc"));
const router = import_express.default.Router();
router.get("/", async (req, res) => {
  try {
    const reviews = await import_review_svc.default.getReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to get reviews" });
  }
});
router.get("/:experienceId", async (req, res) => {
  try {
    const { experienceId } = req.params;
    const reviews = await import_review_svc.default.getReviewsForExperience(
      experienceId
    );
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: `Error fetching reviews for experience: ${err}` });
  }
});
router.get("/review/:reviewId", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await import_review_svc.default.getReviewById(reviewId);
    res.status(200).json(review);
  } catch (err) {
    res.status(404).json({ error: `Review not found: ${err}` });
  }
});
router.post("/", async (req, res) => {
  try {
    const newReview = req.body;
    const review = await import_review_svc.default.createReview(newReview);
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: `Error creating review: ${err}` });
  }
});
router.put("/:reviewId", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const updatedReview = req.body;
    const review = await import_review_svc.default.updateReview(reviewId, updatedReview);
    res.status(200).json(review);
  } catch (err) {
    res.status(404).json({ error: `Error updating review: ${err}` });
  }
});
router.delete("/:reviewId", async (req, res) => {
  try {
    const { reviewId } = req.params;
    await import_review_svc.default.deleteReview(reviewId);
    res.status(204).end();
  } catch (err) {
    res.status(404).json({ error: `Error deleting review: ${err}` });
  }
});
var reviews_default = router;
