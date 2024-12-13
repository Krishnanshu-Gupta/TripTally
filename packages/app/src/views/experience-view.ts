import { define, View } from "@calpoly/mustang";
import { css, html } from "lit";
import { state, property } from "lit/decorators.js";
import { Msg } from "../messages";
import { Model } from "../model";
import { Stars } from "../components/stars";
import { Review } from "server/models";

export class ExperienceViewElement extends View<Model, Msg> {
  @property({ type: String, attribute: "experience-id" })
  experienceId!: string;
  @state()
  reviews: any[] = [];
  @state()
  showReviewForm: boolean = false;
  @state()
  sortOption: string = "rating";
  @state()
  savedByUser: boolean = false;
  @state()
  isEditingExperience: boolean = false;

  @state()
  get experience() {
    return this.model.experience;
  }

  @state()
  newReview = {
    overallRating: 0,
    valueForMoney: 0,
    accessibility: 0,
    uniqueness: 0,
    comment: "",
    id: "",
  };

  @state()
  editingExperience = {
    id: "",
    title: "",
    category: "",
    location: "",
    description: "",
    rating: 0,
  };

  @state()
  get isAuthenticated(): boolean {
    return this.model.isAuthenticated;
  }

  @state()
  get user(): { username: string } | undefined {
    return this.model.user;
  }

  static uses = [Stars];

  constructor() {
    super("blazing:model");
  }

  connectedCallback() {
    super.connectedCallback();
    const checkUserInterval = setInterval(() => {
      if (this.model.user) {
        this.savedStatus();
        clearInterval(checkUserInterval);
      }
    }, 100);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "experience-id" && oldValue !== newValue && newValue) {
      this.dispatchMessage(["experience/fetch", { experienceId: newValue }]);
      this.refreshReviews();
    }
  }

  savedStatus() {
    const userId = this.model.user?.id;

    if (!userId) {
      this.savedByUser = false;

      return;
    }
    this.dispatchMessage([
      "saved/fetch",
      {
        userId: userId,
        onSuccess: (saved: string[]) => {
          this.savedByUser = saved.includes(this.experienceId);
        },
        onFailure: (error: Error) => {
          console.error("Error fetching saved experiences:", error);
          this.savedByUser = false;
        },
      },
    ]);
  }

  calculateAverageRating(field: string): number {
    if (!this.reviews.length) return 0;
    const total = this.reviews.reduce(
      (sum, review) => sum + (review[field] || 0),
      0
    );
    return Number((total / this.reviews.length).toFixed(1));
  }

  handleSaveExperience() {
    let userId = this.model.user?.id;
    if (!userId) {
      alert("You need to log in to save experiences.");
      return;
    }
    this.savedByUser = !this.savedByUser;

    if (this.savedByUser) {
      this.dispatchMessage([
        "saved/add",
        {
          userId,
          experienceId: this.experienceId,
          onSuccess: () => {
            alert("Experience saved successfully!");
          },
          onFailure: () => {
            alert("Failed to save experience. Please try again.");
            this.savedByUser = false;
          },
        },
      ]);
    } else {
      this.dispatchMessage([
        "saved/remove",
        {
          userId,
          experienceId: this.experienceId,
          onSuccess: () => {
            alert("Experience unsaved successfully!");
          },
          onFailure: () => {
            alert("Failed to unsave experience. Please try again.");
            this.savedByUser = true;
          },
        },
      ]);
    }
  }

  handleRatingInput(type: string, event: Event) {
    const target = event.target as HTMLInputElement;
    let value = parseFloat(target.value);

    value = Math.min(Math.max(value, 0), 5);
    value = parseFloat(value.toFixed(1));

    this.newReview = { ...this.newReview, [type]: value };
  }

  async handleSubmitReview() {
    const {
      overallRating,
      valueForMoney,
      accessibility,
      uniqueness,
      comment,
      id,
    } = this.newReview;
    const user = this.model.user;
    if (!user?.username || !user?.id || !user?.name) {
      alert("User details are missing. Please log in.");
      return;
    }
    if (
      !overallRating ||
      !valueForMoney ||
      !accessibility ||
      !uniqueness ||
      !comment.trim()
    ) {
      alert(
        "Please fill out all fields and provide ratings for each category."
      );
      return;
    }
    const payload = {
      id: id || crypto.randomUUID(),
      experienceId: this.experienceId,
      userID: user.id,
      user: user.name,
      overallRating,
      valueForMoney,
      accessibility,
      uniqueness,
      comment,
    };
    if (id) {
      this.dispatchMessage([
        "review/update",
        {
          review: payload,
          onSuccess: () => {
            alert("Review updated successfully!");
            this.refreshReviews();
          },
          onFailure: (error: Error) => {
            console.error("Failed to update review:", error);
            alert("An error occurred while updating the review.");
          },
        },
      ]);
    } else {
      this.dispatchMessage(["review/create", payload]);
      alert("Review created successfully!");
      this.refreshReviews();
    }
    this.showReviewForm = false;
  }

  refreshReviews() {
    this.dispatchMessage([
      "reviews/fetch",
      {
        experienceId: this.experienceId,
        onSuccess: (reviews: Review[]) => {
          this.reviews = reviews;
        },
        onFailure: (error: Error) => {
          console.error("Error fetching reviews:", error);
          this.reviews = [];
        },
      },
    ]);
  }

  navigateBack() {
    window.history.back()
  }

  sortReviews() {
    if (this.sortOption === "rating") {
      this.reviews = [...this.reviews].sort(
        (a, b) => b.overallRating - a.overallRating
      );
    } else if (this.sortOption === "recent") {
      this.reviews = [...this.reviews].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }
  }

  handleSortChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.sortOption = target.value;
    this.sortReviews();
  }

  renderStarRating(type: string, currentRating: number) {
    return html`
      <star-rating
        data-type="${type}"
        value="${currentRating.toFixed(1)}"
      ></star-rating>
    `;
  }

  handleEditExperience() {
    if (this.experience?.userID !== this.model.user?.id) {
      alert("You can only edit your own experiences.");
      return;
    }
    this.editingExperience = {
      id: this.experience?.id || "default-id",
      title: this.experience?.title || "Default Title",
      category: this.experience?.category || "Default Category",
      location: this.experience?.location || "Default Location",
      description: this.experience?.description || "No description provided",
      rating: this.experience?.rating || 0,
    };
    this.isEditingExperience = true;
  }

  async handleSubmitExperienceEdit() {
    const { id, title, category, location, description, rating } =
      this.editingExperience;

    if (!title.trim() || !description.trim()) {
      alert("Title and Description are required.");
      return;
    }

    const updatedExperience = {
      ...this.experience,
      id,
      title,
      category,
      location,
      description,
      rating,
    };

    if (!this.experience) {
      console.error("Experience is undefined");
      return;
    }

    this.dispatchMessage([
      "experience/update",
      {
        experience: {
          ...this.experience,
          ...updatedExperience,
          user: this.experience.user || "defaultUser",
          userID: this.experience.userID || "defaultUserID",
        },
        onSuccess: () => {
          alert("Experience updated successfully!");
          this.isEditingExperience = false;
          this.dispatchMessage([
            "experience/fetch",
            { experienceId: this.experienceId },
          ]);
        },
        onFailure: (error: Error) => {
          console.error("Failed to update experience:", error);
          alert("An error occurred while updating the experience.");
        },
      },
    ]);
  }

  handleCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.editingExperience = {
      ...this.editingExperience,
      category: target.value,
    };
  }

  renderExperienceEditForm() {
    const categories = [
      "Adventure",
      "Cultural",
      "Nature and Wildlife",
      "Family-Friendly",
      "Luxury",
      "Budget-Friendly",
    ];
    return html`
      <section class="form-container">
        <h1>Edit Experience</h1>
        <form @submit=${(e: Event) => e.preventDefault()}>
          <div class="form-group full-width">
            <label for="title">Title</label>
            <input
              type="text"
              id="title"
              .value=${this.editingExperience.title}
              @input=${(e: Event) => {
                const target = e.target as HTMLInputElement;
                this.editingExperience = {
                  ...this.editingExperience,
                  title: target.value,
                };
              }}
              required
            />
          </div>

          <div class="form-group full-width">
            <label for="category">Category</label>
            <select
              id="category"
              name="category"
              @change=${this.handleCategoryChange}
              .value=${this.editingExperience.category || ""}
              required
            >
              <option
                value=""
                disabled
                ?selected=${!this.editingExperience.category}
              >
                Select a category
              </option>
              ${categories.map(
                (category) => html`<option
                  value="${category}"
                  ?selected=${this.editingExperience.category === category}
                >
                  ${category}
                </option>`
              )}
            </select>
          </div>

          <div class="form-group full-width">
            <label for="location">Location</label>
            <input
              type="text"
              id="location"
              .value=${this.editingExperience.location}
              @input=${(e: Event) => {
                const target = e.target as HTMLInputElement;
                this.editingExperience = {
                  ...this.editingExperience,
                  location: target.value,
                };
              }}
              required
            />
          </div>

          <div class="form-group full-width">
            <label for="description">Description</label>
            <textarea
              id="description"
              .value=${this.editingExperience.description}
              @input=${(e: Event) => {
                const target = e.target as HTMLTextAreaElement;
                this.editingExperience = {
                  ...this.editingExperience,
                  description: target.value,
                };
              }}
              rows="4"
              required
            ></textarea>
          </div>

          <div class="form-actions">
            <button
              type="button"
              class="save-button"
              @click=${this.handleSubmitExperienceEdit}
            >
              Save Changes
            </button>
            <button
              type="button"
              class="edit-button"
              @click=${() => (this.isEditingExperience = false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    `;
  }

  renderReviewForm() {
    return html`
			<section class="form-container">
				<h1>Write a Review</h1>
				<form @submit=${(e: Event) => e.preventDefault()}>
					<div class="form-group full-width">
						<textarea
								id="comment"
								name="comment"
								.value=${this.newReview.comment}
								@input=${(e: Event) => {
                  const target = e.target as HTMLTextAreaElement;
                  this.newReview = { ...this.newReview, comment: target.value };
                }}
								placeholder="Add a review"
								rows="4"
								required
						></textarea>
					</div>
					<div class="ratings-section">
						<div class="rating-item">
								<label for="overallRating">Overall Rating</label>
								${this.renderStarRating("overallRating", this.newReview.overallRating)}
								<input
										type="number"
										id="overallRating"
										name="overallRating"
										min="0"
										max="5"
										step="0.1"
										.value=${this.newReview.overallRating}
										@input=${(e: Event) => this.handleRatingInput("overallRating", e)}
								/>
						</div>

						<div class="rating-item">
								<label for="valueForMoney">Value for Money</label>
								${this.renderStarRating("valueForMoney", this.newReview.valueForMoney)}
								<input
										type="number"
										id="valueForMoney"
										name="valueForMoney"
										min="0"
										max="5"
										step="0.1"
										.value=${this.newReview.valueForMoney}
										@input=${(e: Event) => this.handleRatingInput("valueForMoney", e)}
								/>
						</div>

						<div class="rating-item">
								<label for="accessibility">Accessibility</label>
								${this.renderStarRating("accessibility", this.newReview.accessibility)}
								<input
										type="number"
										id="accessibility"
										name="accessibility"
										min="0"
										max="5"
										step="0.1"
										.value=${this.newReview.accessibility}
										@input=${(e: Event) => this.handleRatingInput("accessibility", e)}
								/>
						</div>

						<div class="rating-item">
								<label for="uniqueness">Uniqueness</label>
								${this.renderStarRating("uniqueness", this.newReview.uniqueness)}
								<input
										type="number"
										id="uniqueness"
										name="uniqueness"
										min="0"
										max="5"
										step="0.1"
										.value=${this.newReview.uniqueness}
										@input=${(e: Event) => this.handleRatingInput("uniqueness", e)}
								/>
						</div>
						<div class="form-actions">
							<button
									type="button"
									class="save-button"
									@click=${this.handleSubmitReview}
							>
							${this.newReview.id ? "Update Review" : "Create Review"}
							</button>
							${
                this.newReview.id
                  ? html`
                      <button
                        type="button"
                        class="edit-button"
                        @click=${() => (this.showReviewForm = false)}
                      >
                        Cancel
                      </button>
                    `
                  : ""
              }
						</div>
				</form>
		</section>
		`;
  }

  render() {
    if (!this.experience) {
      return html`<p>Loading experience details...</p>`;
    }

    const categoryColors: { [key: string]: string } = {
      Adventure: "#FF4500",
      Cultural: "#8A2BE2",
      "Nature and Wildlife": "#228B22",
      "Family-Friendly": "#FFD700",
      Luxury: "#DAA520",
      "Budget-Friendly": "#4682B4",
      default: "#CCC",
  };

    const {
      id,
      title,
      category,
      location,
      rating = 0,
      description,
    } = this.experience;

    const averageValueForMoney = this.calculateAverageRating("valueForMoney");
    const averageAccessibility = this.calculateAverageRating("accessibility");
    const averageUniqueness = this.calculateAverageRating("uniqueness");

    return html`
      <main class="experience-page">
        <!-- Navigation Buttons -->
        <div class="navigation">
          <button class="back-button" @click=${() => this.navigateBack()}>
            ⬅ Back
          </button>
        </div>

        <section class="experience-header">
          <div class="header-content">
            ${this.isEditingExperience
              ? this.renderExperienceEditForm()
              : html`
                  <div class="header-text">
                    <h1>${title}</h1>
                    <div class="rating">
                      <span class="rating-value"
                        >${Number(rating).toFixed(1)}</span
                      >
                      <star-rating
                        value="${Number(rating).toFixed(1)}"
                      ></star-rating>
                    </div>
                    <div class="header-sub">
                      <div
                        class="category-badge"
                        style="background-color: ${categoryColors[category] || categoryColors.default}"
                      >
                        ${category}
                      </div>
                      <span class="location">${location}</span>
                    </div>
                    <div class="description">${description}</div>
                    <div class="ratings-breakdown">
                      <div class="rating-item">
                        <strong>Value for Money:</strong>
                        <star-rating
                          value="${averageValueForMoney}"
                        ></star-rating>
                      </div>
                      <div class="rating-item">
                        <strong>Accessibility:</strong>
                        <star-rating
                          value="${averageAccessibility}"
                        ></star-rating>
                      </div>
                      <div class="rating-item">
                        <strong>Uniqueness:</strong>
                        <star-rating value="${averageUniqueness}"></star-rating>
                      </div>
                    </div>
                  </div>
                  <div class="review-actions">
                    <button
                      class="edit-button"
                      ?hidden=${this.experience?.userID !== this.model.user?.id}
                      @click=${() => this.handleEditExperience()}
                    >
                      Edit Experience
                    </button>
                  </div>
                `}
          </div>
          <div class="header-image">
            <img src="/assets/experiences/${id}.jpg"
            alt="${title}"packages/app/public/assets/experiences/default.jpg
            onerror="this.src='/assets/experiences/default.jpg'" />
            <button class="image-icon" @click=${this.handleSaveExperience}>
              <svg class="icon">
                <use
                  href="/assets/icons/sprite.svg#${this.savedByUser
                    ? "heartfill"
                    : "heart"}"
                ></use>
              </svg>
            </button>
          </div>
        </section>

        <!-- Reviews Section -->
        <section class="reviews">
          <h2>Reviews</h2>
          <div class="reviews-header">
            <button
              class="feedback-button"
              ?disabled=${this.reviews.some(
                (review) => review.userID === this.model.user?.id
              )}
              @click=${() => {
                if (
                  this.reviews.some(
                    (review) => review.userID === this.model.user?.id
                  )
                ) {
                  alert(
                    "You have already submitted a review for this experience."
                  );
                } else if (this.model.isAuthenticated) {
                  this.showReviewForm = !this.showReviewForm;
                  if (this.showReviewForm) {
                    this.newReview = {
                      overallRating: 0,
                      valueForMoney: 0,
                      accessibility: 0,
                      uniqueness: 0,
                      comment: "",
                      id: "",
                    };
                  }
                } else {
                  alert("You must be logged in to leave a review.");
                }
              }}
            >
              Leave Feedback
            </button>
            <select
              class="sort-dropdown"
              @change=${(event: Event) => this.handleSortChange(event)}
            >
              <option value="rating">Sort by: Highest Rating</option>
              <option value="recent">Sort by: Most Recent</option>
            </select>
          </div>
          ${this.showReviewForm ? this.renderReviewForm() : ""}
          <div class="review-grid">${this.renderReviews()}</div>
        </section>
      </main>
    `;
  }

  renderReviews() {
    if (!this.reviews.length) {
      return html`<p>No reviews available for this experience.</p>`;
    }

    return this.reviews.map((review) => {
      let isUserReview = false;
      if (this.isAuthenticated && this.model.user) {
        isUserReview = this.model.user.id === review.userID;
      }

      return html`
        <div class="review-card">
          <div class="review-header">
            <p class="review-user"><strong>${review.user}</strong></p>
            <p class="review-date">
              ${new Date(review.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <star-rating value="${review.overallRating || 0}"></star-rating>
          <p class="review-comment">
            ${review.comment || "No comment provided."}
          </p>
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
          ${isUserReview
            ? html`
                <div class="review-actions">
                  <button
                    class="edit-button"
                    @click=${() => this.handleEditReview(review)}
                  >
                    Edit
                  </button>
                  <button
                    class="delete-button"
                    @click=${() => this.handleDeleteReview(review.id)}
                  >
                    Delete
                  </button>
                </div>
              `
            : ""}
        </div>
      `;
    });
  }

  handleEditReview(review: any) {
    this.newReview = { ...review };
    this.showReviewForm = true;
  }

  async handleDeleteReview(reviewId: string) {
    const confirmed = confirm("Are you sure you want to delete this review?");
    if (!confirmed) return;
    this.dispatchMessage([
      "review/delete",
      {
        reviewId: reviewId,
        onSuccess: () => {
          alert("Review deleted successfully!");
          this.reviews = this.reviews.filter(
            (review) => review.id !== reviewId
          );
          this.refreshReviews();
        },
        onFailure: (error: Error) => {
          console.error("Failed to delete review:", error);
          alert("An error occurred while deleting the review.");
        },
      },
    ]);
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

    .review-actions {
      display: flex;
      gap: var(--space-sm);
      margin-top: var(--space-md);
    }

    .edit-button,
    .delete-button {
      background-color: var(--primary-color);
      color: var(--background-color);
      border: none;
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--border-radius);
      font-size: 0.9rem;
      cursor: pointer;
    }

    .edit-button:hover {
      background-color: var(--accent-color);
    }

    .delete-button:hover {
      background-color: var(--danger-color, #e63946);
    }

    .experience-header {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-lg);
      align-items: center;
      margin-bottom: var(--space-lg);
    }

    .header-image {
      position: relative;
      grid-column: 2;
      grid-row: 1;
      max-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .header-image img {
      width: 100%;
      max-height: 100%;
      object-fit: cover;
      border-radius: var(--border-radius);
    }

    .header-content {
      grid-column: 1;
      grid-row: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
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
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: var(--background-color);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      block-size: 2rem;
      inline-size: 2rem;
      padding: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s ease;
    }

    .image-icon:hover {
      background-color: rgba(0, 0, 0, 0.8);
    }

    .icon {
      height: 24px;
      width: 24px;
      fill: #ff0000;
      stroke: #e61e43;
      stroke-width: 2px;
      transition: fill 0.3s ease, stroke 0.3s ease;
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
      line-height: 1.2;
    }

    star-rating {
      display: inline-flex;
      align-items: center;
      line-height: 1.2;
    }

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
      margin-left: auto;
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

    .form-container {
      background: var(--background-color, #fff);
      padding: 2rem;
      border-radius: 10px;
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
      margin-top: 0.5rem;
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
  `;
}

define({ "experience-view": ExperienceViewElement });
