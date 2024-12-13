import { Experience, Review } from "server/models";

export type Msg =
  | [
      "experiences/load",
      {
        onSuccess?: (experiences: Experience[]) => void;
        onFailure?: (error: Error) => void;
      }
    ]
  | ["experience/fetch", { experienceId: string }]
  | [
      "experience/update",
      {
        experience: Experience;
        onSuccess: () => void;
        onFailure: (error: Error) => void;
      }
    ]
  | [
      "experience/create",
      {
        id: string;
        userID: string;
        user: string;
        title: string;
        category: string;
        location: string;
        description: string;
        rating: number;
      }
    ]
  | [
      "experience/delete",
      {
        experienceId: string;
        onSuccess: () => void;
        onFailure: (error: Error) => void;
      }
    ]
  | [
      "reviews/load",
      {
        onSuccess?: (experiences: Experience[]) => void;
        onFailure?: (error: Error) => void;
      }
    ]
  | [
      "review/create",
      {
        id: string;
        experienceId: string;
        userID: string;
        user: string;
        overallRating: number;
        valueForMoney: number;
        accessibility: number;
        uniqueness: number;
        comment?: string;
      }
    ]
  | [
      "reviews/fetch",
      {
        experienceId: string;
        onSuccess?: (reviews: Review[]) => void;
        onFailure?: (error: Error) => void;
      }
    ]
  | [
      "review/update",
      {
        review: Review;
        onSuccess: () => void;
        onFailure: (error: Error) => void;
      }
    ]
  | [
      "review/delete",
      {
        reviewId: string;
        onSuccess: () => void;
        onFailure: (error: Error) => void;
      }
    ]
  | [
      "saved/fetch",
      {
        userId: string;
        onSuccess?: (saved: string[]) => void;
        onFailure?: (error: Error) => void;
      }
    ]
  | [
      "saved/add",
      {
        userId: string;
        experienceId: string;
        onSuccess: () => void;
        onFailure: (error: Error) => void;
      }
    ]
  | [
      "saved/remove",
      {
        userId: string;
        experienceId: string;
        onSuccess: () => void;
        onFailure: (error: Error) => void;
      }
    ]
  | ["auth/login", { username: string; password: string }]
  | ["auth/logout", {}]
  | ["auth/register", { username: string; password: string; name: string }]
  | ["dark-mode/toggle", { enabled: boolean }];
