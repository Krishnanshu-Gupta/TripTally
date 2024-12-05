import { ObjectId } from "mongoose";

export interface Experience {
  id: string;
  title: string;
  category: string;
  location: string;
  rating: number; // Calculated as an average of the `overallRating` from reviews
  userID: ObjectId | string;
  user: string;
  description: string;
  reviewCount?: number; // Number of reviews (calculated from the `reviews` collection)
}