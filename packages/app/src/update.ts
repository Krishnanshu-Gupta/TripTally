import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "dark-mode/toggle":
      apply((model) => {
        const newModel = {
          ...model,
          darkMode: message[1].enabled,
        };
        console.log("Saving darkMode to localStorage:", newModel.darkMode);
        localStorage.setItem("darkMode", String(newModel.darkMode));
        return newModel;
      });
      break;

    case "experience/select":
      fetchExperience(message[1], user)
        .then((experience) => {
          if (experience) {
            apply((model) => ({ ...model, experience }));
          }
        })
        .catch((err) => {
          console.error("Error fetching experience:", err);
        });
      break;

      case "experience/create":
        const experienceData = message[1];
        fetch("/api/experiences", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...Auth.headers(user) },
          body: JSON.stringify(experienceData),
        })
          .then((response) => {
            if (!response.ok) throw new Error("Failed to create experience.");
            return response.json();
          })
          .then((createdExperience) => {
            console.log("Experience created:", createdExperience);

            // Optionally update the UI
            apply((model) => ({
              ...model,
              experiences: [...(model.experiences || []), createdExperience],
            }));
          })
          .catch((err) => {
            console.error("Error creating experience:", err);
          });
      break;

    case "review/create":
      const reviewData = message[1];
      fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...Auth.headers(user) },
        body: JSON.stringify(reviewData),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to create review.");
          return response.json();
        })
        .then((createdReview) => {
          console.log("Review created:", createdReview);

          // Optionally update the UI with the new review
          apply((model) => {
            if (model.experience?.id === createdReview.experienceId) {
              return {
                ...model,
                experience: {
                  ...model.experience,
                  reviews: [...(model.experience?.reviews || []), createdReview],
                },
              };
            }
            return model;
          });
        })
        .catch((err) => {
          console.error("Error creating review:", err);
        });
      break;

    case "reviews/fetch":
      fetchReviews(message[1], user)
        .then((reviews) => {
          if (reviews) {
            apply((model) => ({
              ...model,
              experience: { ...model.experience, reviews },
            }));
          }
        })
        .catch((err) => {
          console.error("Error fetching reviews:", err);
        });
      break;

      case "auth/login": {
        console.log(message[1]);
        const { username, password } = message[1];
        fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Invalid login credentials");
            }
            return response.json();
          })
          .then((userData) => {
            console.log("Login successful. User data:", userData);
            apply((model) => ({
              ...model,
              isAuthenticated: true,
              user: { id: userData.id, name: userData.name, username: userData.username },
            }));
            window.history.pushState({}, "", "/");
            window.dispatchEvent(new Event("popstate"));
          })
          .catch((error) => {
            console.error("Login failed:", error);
            alert("Login failed. Please check your credentials.");
          });
        break;
      }

      case "auth/logout":
        apply((model) => ({
          ...model,
          isAuthenticated: false,
          user: undefined,
        }));
        break;

      case "auth/register":
        const { username, name, password } = message[1];
        console.log("Registering user:", username, name, password);
        fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, name, password }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Registration failed. Please try again.");
            }
            return response.json();
          })
          .then((userData) => {
            console.log("Login successful. User data:", userData);
            apply((model) => ({
              ...model,
              isAuthenticated: true,
              user: { id: userData.id, name: userData.name, username: userData.username },
            }));
            window.history.pushState({}, "", "/");
            window.dispatchEvent(new Event("popstate"));
          })
          .catch((error) => {
            console.error("Registration failed:", error);
            alert("Registration failed. Please try again.");
          });
        break;

    default:
      console.error(`Unhandled message: ${message[0]}`);
  }
}

function fetchExperience(
  msg: { experienceId: string },
  user: Auth.User
): Promise<any> {
  return fetch(`/api/experiences/${msg.experienceId}`, {
    headers: Auth.headers(user),
  })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(`Failed to fetch experience: ${response.status}`);
    })
    .catch((err) => {
      console.error("Error fetching experience:", err);
      return null;
    });
}

function fetchReviews(
  msg: { experienceId: string },
  user: Auth.User
): Promise<any[]> {
  return fetch(`/api/reviews/${msg.experienceId}`, {
    headers: Auth.headers(user),
  })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(`Failed to fetch reviews: ${response.status}`);
    })
    .catch((err) => {
      console.error("Error fetching reviews:", err);
      return [];
    });
}

function createExperience(
  experience: any,
  user: Auth.User
): Promise<any> {
  return fetch("/api/experiences", {
    method: "POST",
    headers: {
      ...Auth.headers(user),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(experience),
  })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error("Failed to create experience.");
    })
    .catch((err) => {
      console.error("Error creating experience:", err);
      throw err;
    });
}