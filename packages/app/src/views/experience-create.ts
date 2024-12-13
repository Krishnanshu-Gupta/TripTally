import { define, View } from "@calpoly/mustang";
import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { Model } from "../model";
import { Msg } from "../messages";
import { Stars } from "../components/stars";

export class ExperienceCreateElement extends View<Model, Msg> {
  @state()
  experience = {
    title: "",
    category: "",
    location: "",
    description: "",
    comment: "",
    overallRating: 0,
    ratings: {
      valueForMoney: 0,
      accessibility: 0,
      uniqueness: 0,
    },
  };

  @state()
  get isAuthenticated(): boolean {
    return this.model.isAuthenticated;
  }

  @state()
  get user(): { username: string } | undefined {
    return this.model.user;
  }

  @state()
  categories = [
    "Adventure",
    "Cultural",
    "Nature and Wildlife",
    "Family-Friendly",
    "Luxury",
    "Budget-Friendly",
  ];

  constructor() {
    super("blazing:model");
  }

  connectedCallback() {
    super.connectedCallback();
  }

  static uses = [Stars];

  handleInput(event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const name = target.name;
    this.experience = { ...this.experience, [name]: target.value };
  }

  handleCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.experience = { ...this.experience, category: target.value };
  }

  handleRatingInput(type: string, event: Event) {
    const target = event.target as HTMLInputElement;
    let value = parseFloat(target.value);

    value = Math.min(Math.max(value, 0), 5);
    value = parseFloat(value.toFixed(1));

    if (type === "overallRating") {
      this.experience = { ...this.experience, overallRating: value };
    } else {
      const ratingKey = type as keyof typeof this.experience.ratings;
      this.experience.ratings[ratingKey] = value;
      this.experience = { ...this.experience };
    }
  }

  renderStarRating(type: string, currentRating: number) {
    return html`
      <star-rating
        data-type="${type}"
        value="${currentRating.toFixed(1)}"
      ></star-rating>
    `;
  }

  navigateLogin() {
    window.history.pushState({}, "", "/app/auth");
    window.dispatchEvent(new Event("popstate"));
  }

  async handleSubmit() {
    const {
      title,
      category,
      location,
      description,
      overallRating,
      ratings,
      comment,
    } = this.experience || {};
    const user = this.model.user;
    if (!user?.username || !user?.id || !user?.name) {
      alert("User details are missing. Please log in.");
      return;
    }
    if (
      !title?.trim() ||
      !category?.trim() ||
      !location?.trim() ||
      !description?.trim()
    ) {
      alert(
        "All fields (title, category, location, description) are required."
      );
      return;
    }
    if (
      overallRating <= 0 ||
      ratings.valueForMoney <= 0 ||
      ratings.accessibility <= 0 ||
      ratings.uniqueness <= 0
    ) {
      alert("All ratings must be greater than 0.");
      return;
    }
    const experienceId = crypto.randomUUID();
    const reviewId = crypto.randomUUID();
    this.dispatchMessage([
      "experience/create",
      {
        id: experienceId,
        userID: user.id,
        user: user.name,
        title,
        category,
        location,
        description,
        rating: overallRating,
      },
    ]);

    this.dispatchMessage([
      "review/create",
      {
        id: reviewId,
        experienceId: experienceId,
        userID: user.id,
        user: user.name,
        overallRating: overallRating,
        valueForMoney: ratings.valueForMoney,
        accessibility: ratings.accessibility,
        uniqueness: ratings.uniqueness,
        comment: comment,
      },
    ]);
    alert(`Experience "${title}" and initial review created successfully!`);
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new Event("popstate"));
  }

  render() {
    if (!this.isAuthenticated) {
      return html`
        <main class="create-experience-page">
          <section class="login-container">
            <h1>You must be logged in to create an experience.</h1>
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
      <main class="create-experience-page">
        <div class="navigation">
          <button
            class="back-button"
            @click=${() => {
              window.history.back();
            }}
          >
            ⬅ Back
          </button>
        </div>

        <section class="form-container">
          <h1>Create New Experience</h1>
          <form @submit=${(e: Event) => e.preventDefault()}>
            <div class="form-row">
              <div class="form-group half-width">
                <label for="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  .value=${this.experience.title}
                  @input=${this.handleInput}
                  placeholder="Enter experience title"
                  required
                />
              </div>
              <div class="form-group half-width">
                <label for="category">Category</label>
                <select
                  id="category"
                  name="category"
                  @change=${this.handleCategoryChange}
                  required
                >
                  <option value="" disabled selected>Select a category</option>
                  ${this.categories.map(
                    (category) =>
                      html`<option value="${category}">${category}</option>`
                  )}
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group half-width">
                <label for="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  .value=${this.experience.location}
                  @input=${this.handleInput}
                  placeholder="Enter location"
                  required
                />
              </div>
              <div class="form-group full-width">
                <label for="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  .value=${this.experience.description}
                  @input=${this.handleInput}
                  placeholder="Describe the experience"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div class="form-group full-width">
                <label for="comment">Review</label>
                <textarea
                  id="comment"
                  name="comment"
                  .value=${this.experience.comment}
                  @input=${this.handleInput}
                  placeholder="Add a review"
                  rows="4"
                  required
                ></textarea>
              </div>
            </div>

            <div class="ratings-section">
              <div class="rating-item">
                <label for="overallRating">Overall Rating</label>
                ${this.renderStarRating(
                  "overallRating",
                  this.experience.overallRating
                )}
                <input
                  type="number"
                  id="overallRating"
                  name="overallRating"
                  min="0"
                  max="5"
                  step="0.1"
                  .value=${this.experience.overallRating}
                  @input=${(e: Event) => this.handleRatingInput("overallRating", e)}
                />
              </div>

              <div class="rating-item">
                <label for="valueForMoney">Value for Money</label>
                ${this.renderStarRating(
                  "valueForMoney",
                  this.experience.ratings.valueForMoney
                )}
                <input
                  type="number"
                  id="valueForMoney"
                  name="valueForMoney"
                  min="0"
                  max="5"
                  step="0.1"
                  .value=${this.experience.ratings.valueForMoney}
                  @input=${(e: Event) => this.handleRatingInput("valueForMoney", e)}
                />
              </div>

              <div class="rating-item">
                <label for="accessibility">Accessibility</label>
                ${this.renderStarRating(
                  "accessibility",
                  this.experience.ratings.accessibility
                )}
                <input
                  type="number"
                  id="accessibility"
                  name="accessibility"
                  min="0"
                  max="5"
                  step="0.1"
                  .value=${this.experience.ratings.accessibility}
                  @input=${(e: Event) => this.handleRatingInput("accessibility", e)}
                />
              </div>

              <div class="rating-item">
                <label for="uniqueness">Uniqueness</label>
                ${this.renderStarRating(
                  "uniqueness",
                  this.experience.ratings.uniqueness
                )}
                <input
                  type="number"
                  id="uniqueness"
                  name="uniqueness"
                  min="0"
                  max="5"
                  step="0.1"
                  .value=${this.experience.ratings.uniqueness}
                  @input=${(e: Event) => this.handleRatingInput("uniqueness", e)}
                />
              </div>
            </div>

            <div class="form-actions">
              <button
                type="button"
                class="submit-button"
                @click=${this.handleSubmit}
              >
                Create Experience
              </button>
            </div>
          </form>
        </section>
      </main>
    `;
  }

  static styles = css`
    :host {
      font-family: var(--font-family-primary, Arial, sans-serif);
    }

    .create-experience-page {
      background: var(--background-color, #f9f9f9);
      color: var(--text-color, #333);
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .form-container {
      background: var(--background-color, #fff);
      padding: 2rem;
      border-radius: 10px;
    }

    .login-container {
      background: var(--background-color, #fff);
      padding: 2rem;
      border-radius: 10px;
      vertical-align: center;
      justify-content: center;
    }

    h1 {
      font-size: 2rem;
      color: var(--primary-color, #007bff);
      margin-bottom: 2rem;
      text-align: center;
    }

    .form-group {
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
    }

    label {
      font-size: 1rem;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    input,
    textarea,
    select {
      padding: 0.75rem;
      font-size: 1rem;
      border-radius: 6px;
      border: 0px;
      background: var(--secondary-color, #fefefe);
      color: var(--text-color);
    }

    input {
      flex-grow: 1;
      border: none;
      outline: none;
      font-size: 1rem;
      color: var(--text-color);
    }

    textarea {
      resize: none;
      height: 100px;
    }

    .form-group.half-width {
      width: calc(50% - 0.5rem);
      flex-grow: 1;
    }

    .form-group.full-width {
      width: 100%;
      margin-top: -1.5rem;
    }

    .form-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: flex-start;
    }

    .ratings-section {
      margin-top: 2rem;
    }

    .rating-item {
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .rating-item label {
      flex: 1;
      font-weight: bold;
    }

    .rating-item input[type="number"] {
      max-width: 6rem;
      text-align: center;
    }

    .form-actions {
      text-align: center;
      margin-top: 2rem;
    }

    .back-button {
      background-color: var(--primary-color);
      color: var(--background-color);
      border: none;
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--border-radius);
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.2s ease;
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
  `;
}

define({ "experience-create": ExperienceCreateElement });
