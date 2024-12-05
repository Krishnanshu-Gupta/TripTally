import { define, View } from "@calpoly/mustang";
import { css, html } from "lit";
import { state, property } from "lit/decorators.js";
import { Msg } from "../messages";
import { Model } from "../model";
import { Stars } from "../components/stars";

export class ExperienceViewElement extends View<Model, Msg> {
  @property({ type: String, attribute: "experience-id" })
  experienceId!: string;

  @state()
  reviews: any[] = [];

  @state()
  sortOption: string = "rating";

  @state()
  get experience() {
    return this.model.experience;
  }

  static uses = [Stars];

  constructor() {
    super("blazing:model");
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchReviews(this.experienceId);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "experience-id" && oldValue !== newValue && newValue) {
      this.dispatchMessage(["experience/select", { experienceId: newValue }]);
      this.fetchReviews(newValue);
    }
  }

  async fetchReviews(experienceId: string) {
    try {
      const response = await fetch(`/api/reviews/${experienceId}`);
      if (response.ok) {
        this.reviews = await response.json();
        this.sortReviews();
      } else {
        this.reviews = [];
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      this.reviews = [];
    }
  }

  calculateAverageRating(field: string): number {
    if (!this.reviews.length) return 0;
    const total = this.reviews.reduce((sum, review) => sum + (review[field] || 0), 0);
    return Number((total / this.reviews.length).toFixed(1));
  }

  handleSaveExperience() {
    console.log("Save functionality triggered for", this.experience?.id);
  }

  navigateBack() {
    window.history.pushState({}, "", "/app");
    window.dispatchEvent(new Event("popstate"));
  }

  sortReviews() {
    if (this.sortOption === "rating") {
      this.reviews = [...this.reviews].sort(
        (a, b) => b.overallRating - a.overallRating
      );
    } else if (this.sortOption === "recent") {
      this.reviews = [...this.reviews].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }
  }

  handleSortChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.sortOption = target.value; // Update the sort option
    this.sortReviews(); // Apply sorting
  }

  render() {
    if (!this.experience) {
      return html`<p>Loading experience details...</p>`;
    }

    const categoryColors = {
      "Adventure": "#FF4500",       // Orange-Red
      "Cultural": "#8A2BE2",        // Blue-Violet
      "Nature and Wildlife": "#228B22", // Forest Green
      "Family-Friendly": "#FFD700", // Golden Yellow
      "Luxury": "#DAA520",          // Goldenrod
      "Budget-Friendly": "#4682B4"  // Steel Blue
    };

    const { id, title, category, location, rating = 0, description } = this.experience;

    const averageValueForMoney = this.calculateAverageRating("valueForMoney");
    const averageAccessibility = this.calculateAverageRating("accessibility");
    const averageUniqueness = this.calculateAverageRating("uniqueness");

    return html`
      <main class="experience-page">
        <!-- Navigation Buttons -->
        <div class="navigation">
          <button
            class="back-button"
            @click=${() => this.navigateBack()}
          >
            ⬅ Back
          </button>
        </div>

        <section class="experience-header">
          <div class="header-content">
            <div class="header-text">
              <h1>${title}</h1>
              <div class="rating">
                <span class="rating-value">${Number(rating).toFixed(1)}</span>
                <star-rating value="${Number(rating).toFixed(1)}"></star-rating>
              </div>
              <div class="header-sub">
                <div
                  class="category-badge"
                  style="background-color: ${categoryColors[category] || '#CCC'}"
                >
                  ${category}
                </div>
                <span class="location">${location}</span>
              </div>
              <div class="description">${description}</div>
              <div class="ratings-breakdown">
                <div class="rating-item">
                  <strong>Value for Money:</strong>
                  <star-rating value="${averageValueForMoney}"></star-rating>
                </div>
                <div class="rating-item">
                  <strong>Accessibility:</strong>
                  <star-rating value="${averageAccessibility}"></star-rating>
                </div>
                <div class="rating-item">
                  <strong>Uniqueness:</strong>
                  <star-rating value="${averageUniqueness}"></star-rating>
                </div>
              </div>
            </div>
          </div>
          <div class="header-image">
            <img
              src="/assets/experiences/${id}.jpg"
              alt="${title}"
              onerror="this.src='/assets/default.jpg'"
            />
            <button class="image-icon" @click=${this.handleSaveExperience}>
              <svg class="icon">
                <use href="/assets/icons/sprite.svg#heart"></use>
              </svg>
            </button>
          </div>
        </section>

        <!-- Reviews Section -->
        <section class="reviews">
          <h2>Reviews</h2>
          <div class="reviews-header">
            <button class="feedback-button">Leave Feedback</button>
            <select
              class="sort-dropdown"
              @change=${(event: Event) => this.handleSortChange(event)}
            >
              <option value="rating">Sort by: Highest Rating</option>
              <option value="recent">Sort by: Most Recent</option>
            </select>
          </div>
          <div class="review-grid">
            ${this.renderReviews()}
          </div>
        </section>
      </main>
    `;
  }

  renderReviews() {
    if (!this.reviews.length) {
      return html`<p>No reviews available for this experience.</p>`;
    }

    return this.reviews.map(
      (review) => html`
        <div class="review-card">
          <div class="review-header">
            <p class="review-user"><strong>${review.user}</strong></p>
            <p class="review-date">${new Date(review.updatedAt).toLocaleDateString()}</p>
          </div>
          <star-rating value="${review.overallRating || 0}"></star-rating>
          <p class="review-comment">${review.comment || "No comment provided."}</p>
          <div class="review-ratings">
            <div class="rating-item">
              <span>💰 Value:</span>
              <star-rating value="${review.valueForMoney || 0}"></star-rating>
            </div>
            <div class="rating-item">
              <span>♿ Accessibility:</span>
              <star-rating value="${review.accessibility || 0}"></star-rating>
            </div>
            <div class="rating-item">
              <span>🌟 Uniqueness:</span>
              <star-rating value="${review.uniqueness || 0}"></star-rating>
            </div>
          </div>
        </div>
      `
    );
  }

  static styles = css`
    :host {
      font-family: var(--font-family-primary);
      background-color: var(--background-color);
    }

    .experience-page {
      background: var(--background-color);
      background-color: var(--background-color);
      color: var(--text-color);
      padding: var(--space-lg);
      font-family: var(--font-family-primary);
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Navigation Buttons */
    .navigation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-md);
    }

    .back-button,
    .save-button {
      background-color: var(--primary-color);
      color: var(--background-color);
      border: none;
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--border-radius);
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .back-button:hover,
    .save-button:hover {
      background-color: var(--accent-color);
      transform: translateY(-2px);
    }

    .experience-header {
      display: grid;
      grid-template-columns: 1fr 1fr; /* Two equal columns */
      gap: var(--space-lg);
      align-items: center; /* Align items to the top */
      margin-bottom: var(--space-lg);
    }

    .header-image {
      position: relative;
      grid-column: 2; /* Image stays in the right column */
      grid-row: 1; /* Align it with the first row */
      max-height: 100%; /* Prevents it from exceeding the container height */
      display: flex; /* Ensures content inside aligns properly */
      align-items: center;
      justify-content: center;
      overflow: hidden; /* Ensures no overflow */
    }

    .header-image img {
      width: 100%; /* Makes the image span the container's width */
      max-height: 100%; /* Constrains the image's height to its container */
      object-fit: cover; /* Maintains aspect ratio and crops excess */
      border-radius: var(--border-radius);
    }

    .header-content {
      grid-column: 1; /* Ensure it stays in the left column */
      grid-row: 1; /* Position it at the top of the grid */
      display: flex;
      flex-direction: column;
      gap: var(--space-md); /* Add spacing between header elements */
    }

    .header-text h1 {
      font-size: 2.5rem;
      margin-bottom: 0;
      color: var(--primary-color);
    }

    .header-sub {
      display: flex;
      gap: var(--space-sm);
      font-size: 0.9rem;
      color: var(--text-color);
      margin-bottom: var(--space-md);
    }

    .description {
      font-size: 1.1rem;
      line-height: 1.6;
      color: var(--text-color);
      margin-bottom: var(--space-md);
    }


    .image-icon {
      position: absolute; /* Positions the button relative to the parent container */
      top: 10px; /* Distance from the top of the image */
      right: 10px; /* Distance from the right of the image */
      background-color: var(--background-color); /* Adds a semi-transparent background */
      color: white; /* Icon color */
      border: none; /* Removes default button border */
      border-radius: 50%; /* Makes it circular */
      cursor: pointer; /* Pointer cursor for interaction */
      block-size: 2rem;
      inline-size: 2rem;
      padding: 7px;
      display: flex; /* Flexbox to center content */
      align-items: center; /* Centers vertically */
      justify-content: center; /* Centers horizontally */
      transition: background-color 0.3s ease; /* Adds hover effect */
    }

    .image-icon:hover {
      background-color: rgba(0, 0, 0, 0.8); /* Darkens background on hover */
    }

    .icon {
      height: 24px;
      width: 24px;
      fill: #e61e43;
      font-weight: bold;
    }

    .category {
      background: var(--primary-color);
      color: var(--background-color);
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius);
    }

    .location {
      color: var(--text-color);
      font-weight: bold;
      font-size: 1rem;
      padding: 0.2rem 0.4rem;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-size: 1.2rem;
      margin-top: var(--space-sm);
      margin-bottom: var(--space-md);
    }

    .rating-categories {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-size: 0.9rem;
    }

    .rating-value {
      font-weight: bold;
      color: var(--primary-color);
      line-height: 1.2; /* Ensures alignment with the star-rating */
    }

    star-rating {
      display: inline-flex;
      align-items: center;
      line-height: 1.2;
    }

    /* Ratings Breakdown */
    .ratings-breakdown {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-md);
      margin-top: var(--space-md);
    }

    .ratings-breakdown div {
      flex: 1;
      min-width: 200px;
      text-align: left;
    }

    /* Reviews Section */
    .reviews h2 {
      font-size: 1.8rem;
      margin-bottom: var(--space-md);
      color: var(--primary-color);
    }

    .reviews-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-md);
    }

    .feedback-button {
      background: var(--primary-color);
      color: var(--background-color);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--border-radius);
      border: none;
      font-size: 1rem;
      cursor: pointer;
    }

    .feedback-button:hover {
      background: var(--accent-color);
    }

    .sort-dropdown {
      padding: var(--space-sm);
      border: 1px solid var(--text-color);
      border-radius: var(--border-radius);
      font-size: 0.9rem;
      background: var(--background-color);
      color: var(--text-color);
    }

    .category-badge {
      display: inline-block;
      background-color: var(--accent-color);
      color: var(--background-color);
      padding: 0.2rem 0.4rem;
      border-radius: var(--border-radius-sm);
      font-size: 0.85rem;
      width: fit-content;
      text-transform: uppercase;
      font-weight: bold;
    }

    .review-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-md);
    }

    .review-card {
      background: var(--secondary-color);
      padding: var(--space-md);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
    }

    .review-card:hover {
      transform: scale(1.023);
      box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .review-user {
      font-weight: bold;
    }

    .review-date {
      font-size: 0.8rem;
      color: #777;
      margin-left: auto; /* Aligns date to the right */
    }

    .review-comment {
      margin: var(--space-sm) 0;
      margin-bottom: var(--space-md);
      font-size: 1rem;
      line-height: 1.6;
      color: var(--text-color);
    }

    .review-ratings {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .rating-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }
  `;
}

define({ "experience-view": ExperienceViewElement });
