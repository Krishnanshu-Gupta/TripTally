import { define, View } from "@calpoly/mustang";
import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { Msg } from "../messages";
import { Model } from "../model";
import { ExperienceCardElement } from "../components/experience-card";
import { Stars } from "../components/stars";

export class ProfileViewElement extends View<Model, Msg> {
  @state()
  userPostedExperiences: any[] = [];

  @state()
  userReviews: any[] = [];

  @state()
  savedExperiences: any[] = [];

  @state()
  get user() {
    return this.model.user;
  }

  static uses = [ExperienceCardElement, Stars];

  constructor() {
    super("blazing:model");
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchData();
  }

  fetchData() {
    const checkUserInterval = setInterval(() => {
      const userId = this.model.user?.id;
      if (userId) {
        this.dispatchMessage([
          "experiences/load",
          {
            onSuccess: (experiences: any[]) => {
              this.userPostedExperiences = experiences.filter(
                (experience) => experience.userID === userId
              );

              this.savedExperiences = this.savedExperiences.map(
                (saved) =>
                  experiences.find(
                    (experience) => experience.id === saved.id
                  ) || saved
              );

              this.userReviews = this.userReviews.map((review) => {
                const experience = experiences.find(
                  (exp) => exp.id === review.experienceId
                );
                return experience
                  ? { ...review, experienceTitle: experience.title }
                  : review;
              });
            },
            onFailure: (error: Error) => {
              console.error("Error fetching experiences:", error);
            },
          },
        ]);

        this.dispatchMessage([
          "reviews/load",
          {
            onSuccess: (reviews: any[]) => {
              this.userReviews = reviews.filter(
                (review) => review.userID === userId
              );
            },
            onFailure: (error: Error) => {
              console.error("Error fetching reviews:", error);
            },
          },
        ]);

        this.dispatchMessage([
          "saved/fetch",
          {
            userId,
            onSuccess: (savedIds: string[]) => {
              this.savedExperiences = savedIds.map((id) => ({
                id,
                title: "Loading...",
              }));
              if (this.model.experiences) {
                this.savedExperiences = this.model.experiences.filter(
                  (experience) => savedIds.includes(experience.id)
                );
              }
            },
            onFailure: (error: Error) => {
              console.error("Error fetching saved experiences:", error);
            },
          },
        ]);

        clearInterval(checkUserInterval);
      }
    }, 100);
  }

  navigateLogin() {
    window.history.pushState({}, "", "/app/auth");
    window.dispatchEvent(new Event("popstate"));
  }

  render() {
    if (!this.user) {
      return html`
        <main class="profile-page">
          <section class="login-container">
            <h1>You must be logged in to view your profile.</h1>
            <div class="form-actions">
              <button
                class="submit-button"
                @click=${() => this.navigateLogin()}
              >
                Go to Login
              </button>
            </div>
          </section>
        </main>
      `;
    }

    return html`
      <main class="profile-page">
        <!-- User Information Section -->
        <section class="user-info">
          <h1>Welcome, ${this.user.name}!</h1>
        </section>

        <!-- User's Posted Experiences -->
        <section class="section">
          <h2>Your Posted Experiences</h2>
          <div class="grid">
            ${this.userPostedExperiences.length
              ? this.userPostedExperiences.map(
                  (experience) =>
                    html`<experience-card
                      .experience=${experience}
                    ></experience-card>`
                )
              : html`<p>You haven't posted any experiences yet.</p>`}
          </div>
        </section>

        <!-- User's Posted Reviews -->
        <section class="section">
          <h2>Your Reviews</h2>
          <div class="grid">
            ${this.userReviews.length
              ? this.userReviews.map(
                  (review) => html`
                    <div class="review-card">
                      <div class="review-header">
                        <h3>Review for: ${review.experienceTitle}</h3>
                        <span
                          >${new Date(
                            review.updatedAt
                          ).toLocaleDateString()}</span
                        >
                      </div>
                      <div class="review-content">
                        <star-rating
                          value="${review.overallRating}"
                        ></star-rating>
                        <p>${review.comment || "No comment provided."}</p>
                      </div>
                    </div>
                  `
                )
              : html`<p>You haven't posted any reviews yet.</p>`}
          </div>
        </section>

        <!-- User's Saved Experiences -->
        <section class="section">
          <h2>Your Saved Experiences</h2>
          <div class="grid">
            ${this.savedExperiences.length
              ? this.savedExperiences.map(
                  (experience) =>
                    html`<experience-card
                      .experience=${experience}
                    ></experience-card>`
                )
              : html`<p>You haven't saved any experiences yet.</p>`}
          </div>
        </section>
      </main>
    `;
  }

  static styles = css`
    :host {
      font-family: var(--font-family-primary);
      background-color: var(--background-color);
    }

    .profile-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--space-lg);
      color: var(--text-color);
    }

    .user-info {
      text-align: center;
      margin-bottom: var(--space-lg);
    }

    .user-info h1 {
      font-size: 2.5rem;
      color: var(--primary-color);
    }

    .user-info p {
      font-size: 1.2rem;
      color: var(--secondary-color);
    }

    .section {
      margin-bottom: var(--space-lg);
    }

    .section h2 {
      font-size: 1.8rem;
      margin-bottom: var(--space-md);
      color: var(--primary-color);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-md);
    }

    .review-card {
      background: var(--secondary-color);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      padding: var(--space-md);
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-sm);
    }

    .review-header h3 {
      font-size: 1.2rem;
      color: var(--primary-color);
    }

    .review-content p {
      margin-top: var(--space-sm);
      font-size: 1rem;
      line-height: 1.6;
    }

    .review-ratings {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      margin-top: var(--space-md);
    }

    .rating-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    h1 {
      font-size: 2rem;
      color: var(--primary-color, #007bff);
      margin-bottom: 2rem;
      text-align: center;
    }

    .submit-button {
      background: var(--primary-color, #007bff);
      color: var(--background-color, #fff);
      padding: 0.75rem 1.5rem;
      border-radius: 5px;
      border: none;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .submit-button:hover {
      background: var(--accent-color, #0056b3);
    }

    .login-container {
      background: var(--background-color, #fff);
      padding: 2rem;
      border-radius: 10px;
      vertical-align: center;
      justify-content: center;
    }

    .form-actions {
      text-align: center;
      margin-top: 2rem;
    }
  `;
}

define({ "profile-view": ProfileViewElement });
