import { Experience, Review } from "server/models";

export type Msg =
  | ["experience/load", {}]
  | ["experience/select", { experienceId: string }]
  | ["experience/save", { experience: Experience, onSuccess: () => void, onFailure: (error: Error) => void }]
  | ["experience/create", { id: string; userID: string; user: string; title: string; category: string; location: string; description: string; rating: number }]
  | ["review/create", { id: string; experienceId: string; userID: string; user: string; overallRating: number; valueForMoney: number; accessibility: number; uniqueness: number; comment?: string }]
  | ["navigation/change", { path: string }]
  | ["reviews/fetch", { experienceId: string, onSuccess?: (reviews: Review[]) => void, onFailure?: (error: Error) => void }]
  | ["auth/login", { username: string, password: string }]
  | ["auth/logout", {}]
  | ["auth/register", { username: string, password: string, name: string }]
  | ["dark-mode/toggle", { enabled: boolean }];
