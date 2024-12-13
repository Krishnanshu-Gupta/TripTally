import { ObjectId } from "mongoose";

export interface Save {
  userId: ObjectId | string;
  saved: string[];
}
