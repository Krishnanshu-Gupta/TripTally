import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class ExperienceMini extends HTMLElement {
  static template = html`
    <template>
      <article class="experience border-box">
        <h2>
          <a><slot name="title">Experience Title</slot></a>
        </h2>
        <p>
          <strong>
            <svg class="icon">
              <use href="/icons/sprite.svg#location"></use>
            </svg>
            Location:
          </strong>
          <a><slot name="location">Location</slot></a>
        </p>
        <p>
          <strong>
            <svg class="icon">
              <use href="/icons/sprite.svg#category"></use>
            </svg>
            Category:
          </strong>
          <a><slot name="category">Category</slot></a>
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
          <a><slot name="user">User Name</slot></a>
        </p>
        <div class="reviews-container" hidden>
          <p><strong>Reviews:</strong></p>
          <ul>
            <slot name="reviews"></slot>
          </ul>
        </div>
        <p>
          <a><slot name="read-more">Read more</slot></a>
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

  get src() {
    return this.getAttribute("src");
  }

  connectedCallback() {
    if (this.src) {
      this.hydrate(this.src);
    }
  }

  hydrate(url) {
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
        return res.json();
      })
      .then((data) => this.renderSlots(data))
      .catch((error) =>
        console.error(`Failed to load data from ${url}:`, error)
      );
  }

  renderSlots(data) {
    const elements = {
        title: `<a href="${data.detailPage}">${data.title}</a>`,
        location: `<a href="${data.locationPage}">${data.location}</a>`,
        category: `<a href="${data.categoryPage}">${data.category}</a>`,
        user: `<a href="${data.userPage}">${data.user}</a>`,
        "read-more": `<a href="${data.detailPage}">Read more</a>`,
    };
    for (const [slotName, content] of Object.entries(elements)) {
        const slotElement = this.shadowRoot.querySelector(`slot[name="${slotName}"]`);
        if (slotElement) {
            const wrapper = document.createElement("span");
            wrapper.innerHTML = content;
            wrapper.slot = slotName;
            this.appendChild(wrapper);
        }
    }
    const ratingSlot = this.shadowRoot.querySelector(`slot[name="rating"]`);
    if (ratingSlot) {
        const starRating = document.createElement("star-rating");
        starRating.setAttribute("value", data.rating.toFixed(1));
        starRating.slot = "rating";
        this.appendChild(starRating);
    }

    if (data.reviews?.length) {
        const reviewsList = document.createElement("ul");
        reviewsList.slot = "reviews";

        data.reviews.forEach((review) => {
            const listItem = document.createElement("li");
            const link = document.createElement("a");
            link.href = review.link;
            link.textContent = review.text;
            listItem.appendChild(link);
            reviewsList.appendChild(listItem);
        });

        this.appendChild(reviewsList);
    }
    this.toggleReviewsVisibility();
  }

  toggleReviewsVisibility() {
    const reviewsSlot = this.shadowRoot.querySelector('slot[name="reviews"]');
    const reviewsContainer = this.shadowRoot.querySelector(".reviews-container");
    reviewsContainer.hidden = reviewsSlot.assignedNodes().length === 0;
  }
}
