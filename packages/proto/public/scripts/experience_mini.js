import { css, html, shadow, define } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";
import { Observer, Form } from "@calpoly/mustang";

export class ExperienceMini extends HTMLElement {
  static uses = define({
    "mu-form": Form.Element,
  });

  static template = html`
    <template>
      <section class="view">
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
            <slot name="rating"></slot>
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
          <button id="edit-button">Edit</button>
        </article>
      </section>
      <mu-form class="edit" hidden>
        <label>
          <span>Title</span>
          <input name="title" />
        </label>
        <label>
          <span>Location</span>
          <input name="location" />
        </label>
        <label>
          <span>Category</span>
          <input name="category" />
        </label>
        <label>
          <span>Rating</span>
          <input name="rating" type="number" min="0" max="5" step="0.1" />
        </label>
        <label>
          <span>User</span>
          <input name="user" />
        </label>
        <button id="cancel-button" type="button">Cancel</button>
      </mu-form>
    </template>
  `;

  static styles = css`
    article {
      border: 1px solid var(--secondary-color);
      border-radius: 5px;
      padding: 1em;
      background-color: var(--experience-box-color);
    }

    article[hidden],
    mu-form[hidden] {
      display: none;
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

    button {
      margin-top: 10px;
      padding: 5px 10px;
      font-size: 1rem;
      border-radius: 5px;
      border: 1px solid var(--secondary-color);
      color: var(--primary-color);
      background-color: var(--experience-box-color);
      cursor: pointer;
    }
  `;

  _authObserver = new Observer(this, "blazing:auth");

  constructor() {
    super();
    shadow(this)
      .template(ExperienceMini.template)
      .styles(reset.styles, ExperienceMini.styles);

    this._user = null;

    this.editButton.addEventListener("click", () => this.showEditMode());
    this.cancelButton.addEventListener("click", () => this.showViewMode());
    this.form.addEventListener("mu-form:submit", (event) =>
      this.submit(this.src, event.detail)
    );
  }

  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      this._user = user;
      if (this.src) this.hydrate(this.src);
    });
  }

  get src() {
    return this.getAttribute("src");
  }

  set src(value) {
    this.setAttribute("src", value);
    if (this._user) this.hydrate(value);
  }

  get form() {
    return this.shadowRoot.querySelector("mu-form.edit");
  }

  get editButton() {
    return this.shadowRoot.querySelector("#edit-button");
  }

  get cancelButton() {
    return this.shadowRoot.querySelector("#cancel-button");
  }

  get authorization() {
    return this._user?.authenticated
      ? { Authorization: `Bearer ${this._user.token}` }
      : {};
  }

  hydrate(url) {
    fetch(url, { headers: this.authorization })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        this.clearSlots();
        this.renderSlots(data);
        this.form.init = data;
      })
      .catch((error) =>
        console.error(`Failed to load data from ${url}:`, error)
      );
  }

  clearSlots() {
    const slots = this.shadowRoot.querySelectorAll("slot");
    slots.forEach((slot) => {
      const assignedElements = slot.assignedElements();
      assignedElements.forEach((el) => el.remove());
    });
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

    const ratingSlot = this.shadowRoot.querySelector('slot[name="rating"]');
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

  submit(url, json) {
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.authorization,
      },
      body: JSON.stringify(json),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to update resource`);
        return res.json();
      })
      .then((data) => {
        this.clearSlots();
        this.renderSlots(data);
        this.form.init = data;
        this.showViewMode();
      })
      .catch((error) => console.error(`Failed to update resource:`, error));
  }

  showEditMode() {
    this.shadowRoot.querySelector(".view").hidden = true;
    this.form.hidden = false;
  }

  showViewMode() {
    this.shadowRoot.querySelector(".view").hidden = false;
    this.form.hidden = true;
  }
}

customElements.define("experience-mini", ExperienceMini);
