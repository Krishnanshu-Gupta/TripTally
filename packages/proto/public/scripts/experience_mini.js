import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class ExperienceMini extends HTMLElement {
  static template = html`
    <template>
      <article class="experience border-box">
        <h2>
          <a href="#"><slot name="title">Experience Title</slot></a>
        </h2>
        <p>
          <strong>
            <svg class="icon">
              <use href="/icons/sprite.svg#location"></use>
            </svg>
            Location:
          </strong>
          <a href="#"><slot name="location">Location</slot></a>
        </p>
        <p>
          <strong>
            <svg class="icon">
              <use href="/icons/sprite.svg#category"></use>
            </svg>
            Category:
          </strong>
          <a href="#"><slot name="category">Category</slot></a>
        </p>
        <p>
          <strong>
            <svg class="icon">
              <use href="/icons/sprite.svg#rating"></use>
            </svg>
            Rating:
          </strong>
          <slot name="rating">4.5</slot>
        </p>
        <p>
          <strong>
            <svg class="icon">
              <use href="/icons/sprite.svg#user"></use>
            </svg>
            User:
          </strong>
          <a href="#"><slot name="user">User Name</slot></a>
        </p>
        <div class="reviews-container" hidden>
          <p><strong>Reviews:</strong></p>
          <ul>
            <slot name="reviews"></slot>
          </ul>
        </div>
        <p>
          <a href="#"><slot name="read-more">Read more</slot></a>
        </p>
      </article>
    </template>
  `;

  static styles = css`
    article {
      border: 1px solid var(--secondary-color);
      border-radius: 5px;
      padding: 1em;
      background-color: var(--experience-box-color);

    }

    h2 {
      font-family: var(--font-primary);
      font-size: 1.75rem;
      color: var(--primary-color);
    }

    a {
      text-decoration: none;
      color: var(--primary-color);
    }

    a:hover {
      text-decoration: underline;
    }

    p {
      margin: 10px 0;
      font-size: 1rem;
    }

    .icon {
      height: 1em;
      width: 1em;
      vertical-align: middle;
      fill: currentColor;
    }

    .reviews-container {
      margin-top: 10px;
    }

    ul {
      padding-left: 20px;
    }
  `;

  constructor() {
    super();
    shadow(this)
      .template(ExperienceMini.template)
      .styles(reset.styles, ExperienceMini.styles);
  }

  connectedCallback() {
    this.toggleReviewsVisibility();
  }

  toggleReviewsVisibility() {
    const reviewsSlot = this.shadowRoot.querySelector('slot[name="reviews"]');
    const reviewsContainer = this.shadowRoot.querySelector(".reviews-container");

    reviewsContainer.hidden = reviewsSlot.assignedNodes().length === 0;
  }
}
