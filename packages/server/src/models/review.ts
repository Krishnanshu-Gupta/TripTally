import { ObjectId } from "mongoose";

export interface Review {
  id: string;
  experienceId: string;
  userID: ObjectId | string;
  user: string;
  overallRating: number;
  valueForMoney: number;
  accessibility: number;
  uniqueness: number;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
