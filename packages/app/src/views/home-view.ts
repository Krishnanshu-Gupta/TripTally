import { Auth, Observer } from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import reset from "../styles/reset.css";
import tokens from "../styles/tokens.css";
import { state } from "lit/decorators.js";
import { ExperienceCardElement } from "../components/experience-card";

export class HomeViewElement extends LitElement {
  private _authObserver = new Observer<Auth.Model>(this, "blazing:auth");
  private _user = new Auth.User();

  @state() authenticated = false;
  @state() experiences: Array<any> = [];
  @state() filteredExperiences: Array<any> = [];
  @state() searchQuery: string = "";
  @state() rankOptions = "rating";

  static uses = [ExperienceCardElement];

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe(({ user }) => {
      if (user) {
        this._user = user;
        this.authenticated = true;
      } else {
        this.authenticated = false;
      }
    });
    this.fetchExperiences();
  }

  fetchExperiences() {
    fetch("/api/experiences", {
      headers: Auth.headers(this._user),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(`Failed to fetch experiences: ${res.status}`);
      })
      .then((data) => {
        this.experiences = data || [];
        this.filteredExperiences = [...this.experiences];
        this.updateFilters();
      })
      .catch((err) => console.error("Error fetching experiences:", err));
  }

  updateFilters() {
    const query = this.searchQuery.toLowerCase();
    let filtered = this.experiences.filter(
      (experience) =>
        experience.title.toLowerCase().includes(query) ||
        experience.location.toLowerCase().includes(query)
    );

    filtered.sort((a, b) => {
      if (this.rankOptions === "rating") return b.rating - a.rating;
      if (this.rankOptions === "title") return a.title.localeCompare(b.title);
      return 0;
    });

    this.filteredExperiences = filtered;
  }

  handleSearchInput(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.updateFilters();
  }

  handleRankChange(event: InputEvent) {
    const target = event.target as HTMLSelectElement;
    this.rankOptions = target.value;
    this.updateFilters();
  }

  addExperience(_event: InputEvent) {
    window.history.pushState({}, "", `/app/add-experience`);
    window.dispatchEvent(new Event("popstate"));
  }

  renderExperienceCards() {
    return html`
      <div class="experience-cards">
        ${this.filteredExperiences.map(
          (experience) =>
            html`<experience-card .experience=${experience}></experience-card>`
        )}
      </div>
    `;
  }
  
  render() {
    return html`
      <main class="home-container">
        <section class="hero">
          <div class="hero-content">
            <div class="hero-left">
              <h1>
                Discover Your <span class="highlight"> Next Adventure</span>
              </h1>
              <p>
                Explore unforgettable travel experiences, share your adventures,
                and inspire others to uncover the beauty of the world.
              </p>
              <div class="search-bar">
                <input
                  type="text"
                  placeholder="Search by experience or location..."
                  .value=${this.searchQuery}
                  @input=${this.handleSearchInput}
                  aria-label="Search"
                />
                <button>
                  <span class="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="#ffffff"
                    >
                      <path
                        d="M10 2a8 8 0 105.27 14.32l4.6 4.6a1 1 0 001.41-1.41l-4.6-4.6A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z"
                      />
                    </svg>
                  </span>
                </button>
              </div>
              <div class="filter-bar">
                <label for="sort">Sort By:</label>
                <select
                  id="sort"
                  class="sort-dropdown"
                  @change=${this.handleRankChange}
                >
                  <option value="rating">Rating</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>
          </div>
          <div class="image-grid">
            <img
              src="../assets/hero/adventure.jpg"
              alt="Adventure Destination"
            />
            <img src="../assets/hero/luxury2.jpg" alt="Beach Getaway" />
            <img src="../assets/hero/temple2.jpg" alt="Culinary Experience" />
            <img src="../assets/hero/food.jpg" alt="Waterfall Adventure" />
            <img src="../assets/hero/nature.jpg" alt="Culinary Delights" />
          </div>
        </section>
        <div>
          <button class="add-experience-button" @click=${this.addExperience}>
            +
          </button>
          <div class="tooltip">Add an Experience</div>
        </div>
        <section class="experience-list">
          <p>Explore the most highly rated experiences from around the world</p>
          <div class="experience-cards">${this.renderExperienceCards()}</div>
        </section>
      </main>
    `;
  }

  static styles = [
    reset.styles,
    tokens.styles,
    css`
      :host {
        background-color: var(--background-color);
        color: var(--text-color);
        font-family: "Poppins", "Roboto", sans-serif;
      }

      main {
        padding: var(--space-lg) 20px;
        max-width: 1200px;
        margin: 0 auto;
        display: ;
      }

      /* Hero Section */
      .hero {
        display: grid;
        grid-template-columns: calc(50% - 0.75rem) calc(50% - 0.75rem);
        justify-content: space-between;
        align-items: flex-start;
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        margin-bottom: 2rem;
      }

      .hero-content {
        flex: 1;
        max-width: none;
      }

      .hero-left {
        padding-top: 2rem;
      }
      .hero-content h1 {
        font-family: "Poppins", sans-serif;
        font-size: 3.5rem;
        font-weight: 800;
        color: var(--primary-color);
        line-height: 1.2;
        margin-bottom: 1rem;
      }

      .hero-content h1 .highlight {
        color: #28a99e;
      }

      .hero-content p {
        font-family: "Poppins", sans-serif;
        font-size: 1.2rem;
        font-weight: 400;
        padding: 1rem 0rem;
        color: var(--text-secondary-color);
        line-height: 1.8;
        margin-bottom: 2rem;
      }

      .sort-dropdown {
        border: 1px solid var(--text-color);
        border-radius: var(--border-radius);
        font-size: 0.9rem;
        background: var(--secondary-color);
        color: var(--text-color);
      }

      .search-bar {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        width: 100%;
        border-radius: 1rem;
        background-color: var(--secondary-color);
      }

      .search-bar input {
        flex-grow: 1;
        border: none;
        outline: none;
        font-size: 1rem;
        color: var(--text-color);
        background-color: var(--secondary-color);
      }

      .search-bar button {
        background-color: var(--primary-color);
        color: white;
        cursor: pointer;
        border-color: var(--primary-color);
        margin-color: var(--primary-color);
        border-radius: 1.75rem;
      }

      .filter-bar {
        margin-top: var(--space-md);
        display: flex;
        gap: var(--space-sm);
      }

      .filter-bar label {
        font-size: 1rem;
        color: var(--text-secondary-color);
      }

      .image-grid {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(3, 1fr); /* 3 columns for the images */
        grid-template-rows: auto;
        grid-template-areas:
          "nothing empty four"
          "nothing two four"
          "one two four"
          "one three five"
          "one three five"
          "controls three five";
        gap: 1rem;
      }

      .image-grid img:nth-child(1) {
        grid-area: one; /* Top-left */
      }

      .image-grid img:nth-child(2) {
        grid-area: two; /* Top-center */
      }

      .image-grid img:nth-child(3) {
        grid-area: three; /* Top-right */
      }

      .image-grid img:nth-child(4) {
        grid-area: four; /* Bottom-left */
      }

      .image-grid img:nth-child(5) {
        grid-area: five; /* Bottom-center */
      }

      .image-grid img {
        width: 100%;
        height: stretch;
        object-fit: cover;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .experience-list {
        text-align: center;
      }

      .experience-list p {
        font-family: "Poppins", sans-serif;
        font-size: 1.2rem;
        color: var(--text-secondary-color);
        margin-bottom: var(--space-sm);
      }

      .experience-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .add-experience-button {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
      }

      .add-experience-button:hover {
        background-color: #28a99e; /* Primary color on hover */
      }

      .tooltip {
        position: absolute;
        bottom: 4.5rem; /* Adjust this to position above the button */
        right: 0; /* Align with the button */
        background-color: rgba(
          0,
          0,
          0,
          0.8
        ); /* Dark background for the tooltip */
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem; /* Smaller font for tooltip */
        white-space: nowrap;
        opacity: 0; /* Hidden by default */
        visibility: hidden; /* Prevent interaction when hidden */
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }

      .add-experience-button:hover + .tooltip {
        opacity: 1; /* Show the tooltip on hover */
        visibility: visible; /* Make it interactive */
      }

      .experience-cards {
        display: grid;
        text-align: left;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 1.5rem;
        margin: 0;
        padding: 0;
        border: none;
        widdth: 100%;
        box-sizing: border-box;
      }
    `,
  ];
}
