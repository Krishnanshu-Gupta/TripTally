import { ObjectId } from "mongoose";

export interface Experience {
  id: string;
  title: string;
  category: string;
  location: string;
  rating: number;
  userID: ObjectId | string;
  user: string;
  description: string;
  reviewCount?: number;
}
