import { ObjectId } from "mongoose";

export interface Credential {
    _id: ObjectId | string;
    username: string;
    name: string;
    hashedPassword: string;
}