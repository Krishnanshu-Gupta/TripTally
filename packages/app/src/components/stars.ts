import { css, html, shadow, define } from "@calpoly/mustang";

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
      height: 1.5em;
      width: 1.5em;
      fill: var(--star-color, gold);
    }

    .half-star {
        fill: var(--star-color);
        clip-path: inset(0 50% 0 0);
    }
  `;

  constructor() {
    super();
    shadow(this).template(Stars.template).styles(Stars.styles);
  }

  static get observedAttributes(): string[] {
    return ["value"];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (name === "value") {
      this.renderStars(parseFloat(newValue || "0"));
    }
  }

  connectedCallback(): void {
    this.renderStars(parseFloat(this.getAttribute("value") || "0"));
  }

  private renderStars(value: number): void {
    const starsContainer = this.shadowRoot?.querySelector(".stars");
    if (!starsContainer) return;

    starsContainer.innerHTML = "";

    const fullStars = Math.floor(value);
    const hasHalfStar = value % 1 !== 0;
    const emptyStars = 5 - Math.ceil(value);

    for (let i = 0; i < fullStars; i++) {
        starsContainer.innerHTML += `
          <svg class="icon">
            <use href="/assets/icons/sprite.svg#starfill"></use>
          </svg>
        `;
      }

      if (hasHalfStar) {
        starsContainer.innerHTML += `
          <svg class="icon gold half-star">
            <use href="/assets/icons/sprite.svg#starfill"></use>
          </svg>
        `;
      }
      for (let i = 0; i < emptyStars; i++) {
        starsContainer.innerHTML += `
          <svg class="icon">
            <use href="/assets/icons/sprite.svg#star"></use>
          </svg>
        `;
      }
    }
}

define({ "star-rating": Stars });