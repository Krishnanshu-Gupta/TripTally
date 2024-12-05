import { ObjectId } from "mongoose";

export interface Review {
    id: string; // Unique ID for the review
    experienceId: string; // Links to the Experience ID
    userID: ObjectId | string; // User who created the review
    user: string; // User's name
    overallRating: number; // Overall rating for the experience
    valueForMoney: number; // Rating for value
    accessibility: number; // Rating for accessibility
    uniqueness: number; // Rating for uniqueness
    comment?: string; // Optional review comment
    createdAt?: Date; // Automatically set by MongoDB
    updatedAt?: Date; // Automatically set by MongoDB
}
