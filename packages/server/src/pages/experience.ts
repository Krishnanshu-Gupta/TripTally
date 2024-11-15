import { css, html } from "@calpoly/mustang/server";
import { Experience } from "../models";
import renderPage from "./renderPage";

export class ExperiencePage {
  data: Experience;

  constructor(data: Experience) {
    this.data = data;
  }

  render() {
    return renderPage({
      body: this.renderBody(),
      stylesheets: ["/styles/experience.css"],
      scripts: [],
    });
  }

  renderBody() {
    const { title, category, location, rating, user, description } = this.data;

    return html`
      <header>
        <h1>${title}</h1>
      </header>
      <section>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Rating:</strong> ${this.renderStars(rating)}</p>
        <p><strong>User:</strong> ${user}</p>
        <p><strong>Description:</strong> ${description}</p>
      </section>
    `;
  }

  renderStars(rating: number) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = html`
      ${Array(fullStars)
        .fill(0)
        .map(() => html`<svg class="icon gold"><use href="/icons/sprite.svg#starfill"></use></svg>`)}
      ${halfStar ? html`<svg class="icon half-star"><use href="/icons/sprite.svg#starfill"></use></svg>` : ""}
    `;
    return stars;
  }
}
