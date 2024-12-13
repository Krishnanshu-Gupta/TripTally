import { Experience } from "server/models";
import { Review } from "server/models";

export interface Model {
  reviews?: Array<Review>;
  experiences?: Array<Experience>;
  selectedExperience?: Experience;
  experience?: {
    userID: any;
    id: string;
    user: string;
    title: string;
    category: string;
    location: string;
    rating: number;
    description: string;
    reviews: Array<{
      text: string;
      link?: string;
    }>;
  };
  isAuthenticated: boolean;
  user?: { id: string; name: string; username: string };
  darkMode: boolean;
}

export const init: Model = {
  isAuthenticated: false,
  user: undefined,
  darkMode: localStorage.getItem("darkMode") === "true",
};
