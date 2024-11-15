import { css, html, shadow } from "@calpoly/mustang";

export class Stars extends HTMLElement {
  static template = html`
    <template>
      <div class="stars"></div>
    </template>
  `;

  static styles = css`
    .stars {
      display: inline-flex;
      align-items: center;
      gap: 0.2em;
    }

    .icon {
      height: 1em;
      width: 1em;
      fill: var(--accent-color, gold);
    }

    .half-star {
      clip-path: inset(0 50% 0 0);
    }
  `;

  constructor() {
    super();
    shadow(this).template(Stars.template).styles(Stars.styles);
  }

  static get observedAttributes() {
    return ["value"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "value") {
      this.renderStars(parseFloat(newValue));
    }
  }

  connectedCallback() {
    this.renderStars(parseFloat(this.getAttribute("value")) || 0);
  }

  renderStars(value) {
    const starsContainer = this.shadowRoot.querySelector(".stars");
    starsContainer.innerHTML = "";

    const fullStars = Math.floor(value);
    const hasHalfStar = value % 1 !== 0;
    for (let i = 0; i < fullStars; i++) {
      starsContainer.innerHTML += `<svg class="icon gold"><use href="/icons/sprite.svg#starfill"></use></svg>`;
    }
    if (hasHalfStar) {
      starsContainer.innerHTML += `<svg class="icon gold half-star"><use href="/icons/sprite.svg#starfill"></use></svg>`;
    }
    const emptyStars = 5 - Math.ceil(value);
    for (let i = 0; i < emptyStars; i++) {
      starsContainer.innerHTML += `<svg class="icon"><use href="/icons/sprite.svg#star"></use></svg>`;
    }
  }
}
