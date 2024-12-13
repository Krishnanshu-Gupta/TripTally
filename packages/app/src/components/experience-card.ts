import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";
import { define } from "@calpoly/mustang";
import { Stars } from "../components/stars";

export class ExperienceCardElement extends LitElement {
  @property({ type: Object }) experience: any;

  static uses = [Stars];

  handleCardClick(id: string) {
    window.history.pushState({}, "", `/app/experience/${id}`);
    window.dispatchEvent(new Event("popstate"));
  }

  render() {
    if (!this.experience) {
      return html`<div class="skeleton-card"></div>`;
    }

    const { id, title, location, category, rating, description } = this.experience as {
      id: string;
      title: string;
      location: string;
      category: "Adventure" | "Cultural" | "Nature and Wildlife" | "Family-Friendly" | "Luxury" | "Budget-Friendly";
      rating: number;
      description: string;
      image: string;
    };

    const categoryColors = {
      Adventure: "#FF4500",
      Cultural: "#8A2BE2",
      "Nature and Wildlife": "#228B22",
      "Family-Friendly": "#FFD700",
      Luxury: "#DAA520",
      "Budget-Friendly": "#4682B4",
    };

    return html`
      <div
        class="experience-card"
        role="button"
        tabindex="0"
        @click=${() => this.handleCardClick(id)}
      >
        <img
          src="${`../assets/experiences/${id}.jpg`}"
          onerror="this.src='../assets/experiences/default.jpg'"
          alt="Image of ${title}"
          class="experience-image"
          loading="lazy"
        />
        <div class="details">
          <h3>${title}</h3>
          <div class="rating">
            <span class="rating-value">${Number(rating).toFixed(1)}</span>
            <star-rating value="${Number(rating).toFixed(1)}"></star-rating>
          </div>
          <div
            class="category-badge"
            style="background-color: ${categoryColors[category] || "#CCC"}"
          >
            ${category}
          </div>
          <p><strong>Location:</strong> ${location}</p>
          <p class="description">
            <strong>Description:</strong> ${description}
          </p>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      color: var(--text-color);
      display: block;
      font-family: "Roboto", sans-serif;
    }

    .experience-card {
      display: flex;
      flex-direction: column;
      background-color: var(--experience-box-color);
      border: 1px solid var(--secondary-color);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      overflow: hidden;
      width: 350px;
      height: 450px;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }

    .experience-card:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .experience-card:focus {
      outline: 2px solid var(--focus-color);
      outline-offset: 2px;
    }

    .experience-card:active {
      transform: scale(0.98);
      opacity: 0.9;
    }

    .experience-image {
      width: 100%;
      height: 50%;
      object-fit: cover;
    }

    .details {
      padding: var(--space-md);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-grow: 1;
    }

    .details h3 {
      margin: 0 0 0;
      color: var(--primary-color);
      font-size: 1.25rem;
    }

    .details p {
      margin: 0 0 var(--space-xs);
      font-size: 0.9rem;
      color: var(--text-color);
    }

    .details .description {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
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
      text-color: var(--background-color);
      font-weight: bold;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-size: 1rem;
      color: var(--text-color);
    }

    .rating-value {
      font-weight: bold;
      color: var(--primary-color);
      line-height: 1;
    }

    star-rating {
      display: inline-flex;
      align-items: center;
      line-height: 1;
    }
  `;
}

define({ "experience-card": ExperienceCardElement });
