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
        localStorage.setItem("darkMode", String(newModel.darkMode));
        return newModel;
      });
      break;

    case "experiences/load":
      fetch("/api/experiences", {
        method: "GET",
        headers: { ...Auth.headers(user) },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to load experiences.");
          return response.json();
        })
        .then((experiences) => {
          apply((model) => ({
            ...model,
            experiences,
          }));
          if (typeof message[1]?.onSuccess === "function") {
            message[1].onSuccess(experiences);
          }
        })
        .catch((err) => {
          console.error("Error loading experiences:", err);
          if (typeof message[1]?.onFailure === "function") {
            message[1].onFailure(err);
          }
        });
      break;

    case "experience/fetch":
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
          apply((model) => ({
            ...model,
            experiences: [...(model.experiences || []), createdExperience],
          }));
        })
        .catch((err) => {
          console.error("Error creating experience:", err);
        });
      break;

    case "experience/update": {
      const { experience, onSuccess, onFailure } = message[1];
      fetch(`/api/experiences/${experience.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...Auth.headers(user) },
        body: JSON.stringify(experience),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to update experience.");
          return response.json();
        })
        .then(() => {
          onSuccess();
        })
        .catch((err) => {
          console.error("Error updating experience:", err);
          onFailure(err);
        });
      break;
    }

    case "experience/delete": {
      const { experienceId } = message[1];
      fetch(`/api/experiences/${experienceId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...Auth.headers(user) },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to delete experience.");
          apply((model) => ({
            ...model,
            experiences: model.experiences?.filter(
              (exp) => exp.id !== experienceId
            ),
            experience:
              model.experience?.id === experienceId
                ? undefined
                : model.experience,
          }));
        })
        .catch((err) => {
          console.error("Error deleting experience:", err);
        });
      break;
    }

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
          apply((model) => {
            if (
              model.experience &&
              model.experience.id === createdReview.experienceId
            ) {
              return {
                ...model,
                experience: {
                  ...model.experience,
                  reviews: [...model.experience.reviews, createdReview],
                },
              } as Model;
            }
            return model;
          });
        })
        .catch((err) => {
          console.error("Error creating review:", err);
        });
      break;

    case "reviews/load":
      fetch("/api/reviews", {
        method: "GET",
        headers: { ...Auth.headers(user) },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to load reviews.");
          return response.json();
        })
        .then((reviews) => {
          apply((model) => ({
            ...model,
            reviews,
          }));
          if (typeof message[1]?.onSuccess === "function") {
            message[1].onSuccess(reviews);
          }
        })
        .catch((err) => {
          console.error("Error loading reviews:", err);
          if (typeof message[1]?.onFailure === "function") {
            message[1].onFailure(err);
          }
        });
      break;

    case "reviews/fetch": {
      const { experienceId, onSuccess, onFailure } = message[1];

      fetchReviews({ experienceId }, user)
        .then((reviews) => {
          if (reviews) {
            apply((model) => {
              if (!model.experience || model.experience.id !== experienceId) {
                console.error("Experience not found or mismatched.");
                return model;
              }

              return {
                ...model,
                experience: {
                  ...model.experience,
                  reviews, // Ensure this doesn't overwrite other required fields
                },
              };
            });

            if (typeof onSuccess === "function") {
              onSuccess(reviews);
            }
          }
        })
        .catch((err) => {
          console.error("Error fetching reviews:", err);
          if (typeof onFailure === "function") {
            onFailure(err);
          }
        });
      break;
    }

    case "review/update": {
      const { review, onSuccess, onFailure } = message[1];
      fetch(`/api/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...Auth.headers(user) },
        body: JSON.stringify(review),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to update review.");
          return response.json();
        })
        .then(() => {
          onSuccess();
        })
        .catch((err) => {
          console.error("Error updating review:", err);
          onFailure(err);
        });
      break;
    }

    case "review/delete": {
      const { reviewId, onSuccess, onFailure } = message[1];
      fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...Auth.headers(user) },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to delete review.");
          onSuccess();
        })
        .catch((err) => {
          console.error("Error deleting review:", err);
          onFailure(err);
        });
      break;
    }

    case "auth/login": {
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
          apply((model) => ({
            ...model,
            isAuthenticated: true,
            user: {
              id: userData.id,
              name: userData.name,
              username: userData.username,
            },
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
          apply((model) => ({
            ...model,
            isAuthenticated: true,
            user: {
              id: userData.id,
              name: userData.name,
              username: userData.username,
            },
          }));
          window.history.pushState({}, "", "/");
          window.dispatchEvent(new Event("popstate"));
        })
        .catch((error) => {
          console.error("Registration failed:", error);
          alert("Registration failed. Please try again.");
        });
      break;

    case "saved/fetch": {
      const { userId, onSuccess, onFailure } = message[1];
      fetch(`/api/saved/${userId}`, {
        headers: Auth.headers(user),
      })
        .then((response) => {
          if (!response.ok)
            throw new Error(`Failed to fetch saved experiences.`);
          return response.json();
        })
        .then((savedExperiences) => {
          apply((model) => ({ ...model, saved: savedExperiences }));
          if (typeof onSuccess === "function") onSuccess(savedExperiences);
        })
        .catch((err) => {
          console.error("Error fetching saved experiences:", err);
          if (typeof onFailure === "function") onFailure(err);
        });
      break;
    }

    case "saved/add": {
      const { userId, experienceId, onSuccess, onFailure } = message[1];
      fetch(`/api/saved/${userId}`, {
        method: "POST",
        headers: {
          ...Auth.headers(user),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ experienceId }),
      })
        .then((response) => {
          if (!response.ok) throw new Error(`Failed to add saved experience.`);
          return response.json();
        })
        .then(() => {
          if (typeof onSuccess === "function") onSuccess();
        })
        .catch((err) => {
          console.error("Error adding saved experience:", err);
          if (typeof onFailure === "function") onFailure(err);
        });
      break;
    }

    case "saved/remove": {
      const { userId, experienceId, onSuccess, onFailure } = message[1];
      fetch(`/api/saved/${userId}`, {
        method: "DELETE",
        headers: {
          ...Auth.headers(user),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ experienceId }),
      })
        .then((response) => {
          if (!response.ok)
            throw new Error(`Failed to remove saved experience.`);
          if (typeof onSuccess === "function") onSuccess();
        })
        .catch((err) => {
          console.error("Error removing saved experience:", err);
          if (typeof onFailure === "function") onFailure(err);
        });
      break;
    }

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
