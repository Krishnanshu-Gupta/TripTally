import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { define, Dropdown, View } from "@calpoly/mustang";
import { Msg } from "../messages";
import { Model } from "../model";

export class TripHeaderElement extends View<Model, Msg> {
  static uses = define({
    "drop-down": Dropdown.Element,
  });

  @state()
  darkMode: boolean = false;

  @state()
  get isAuthenticated(): boolean {
    return this.model.isAuthenticated;
  }

  @state()
  get username(): string {
    return this.model.user?.username || "Traveler";
  }

  constructor() {
    super("blazing:model");
  }

  connectedCallback() {
    super.connectedCallback();
    const savedDarkMode = localStorage.getItem("darkMode") === "true";

    if (savedDarkMode !== this.model.darkMode) {
      this.darkMode = savedDarkMode;
      this.applyDarkMode(savedDarkMode);
      this.dispatchMessage(["dark-mode/toggle", { enabled: savedDarkMode }]);
    }
  }

  applyDarkMode(isDarkMode: boolean) {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      this.shadowRoot?.querySelector(".menu-icon")?.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
      this.shadowRoot
        ?.querySelector(".menu-icon")
        ?.classList.remove("dark-mode");
    }
  }

  toggleDarkMode(event?: InputEvent) {
    let isDarkMode = this.darkMode;

    if (event) {
      const target = event.target as HTMLInputElement;
      isDarkMode = target.checked;
    }

    this.darkMode = isDarkMode;

    if (this.darkMode) {
      document.body.classList.add("dark-mode");
      const menuIcon = this.shadowRoot?.querySelector(".menu-icon");
      if (menuIcon) {
        menuIcon.classList.add("dark-mode");
      }
    } else {
      document.body.classList.remove("dark-mode");
      this.shadowRoot
        ?.querySelector(".menu-icon")
        ?.classList.remove("dark-mode");
    }

    this.dispatchMessage(["dark-mode/toggle", { enabled: this.darkMode }]);

    localStorage.setItem("darkMode", String(this.darkMode));
  }

  handleSignOut() {
    this.dispatchMessage(["auth/logout", {}]);
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new Event("popstate"));
  }

  handleNavigation(event: MouseEvent) {
    event.preventDefault();
    const href = (event.currentTarget as HTMLAnchorElement).getAttribute(
      "href"
    );
    if (href) {
      window.dispatchEvent(
        new CustomEvent("blazing:history", { detail: { path: href } })
      );
    }
  }

  render() {
    return html`
      <header>
        <div class="title">
          <h1>
            <a href="/app" @click=${this.handleNavigation}>Trip Tally</a>
          </h1>
        </div>
        <nav>
          <a href="/app/map" @click=${this.handleNavigation} class="map-link">
            Map View
          </a>
          <drop-down>
            <button slot="actuator" class="menu-icon" aria-label="Menu">
              <img
                src="/assets/menu.svg"
                alt="Menu Icon"
                class="menu-icon-svg"
              />
            </button>
            <div class="dropdown-content">
              <label class="dark-mode-switch">
                <input
                  type="checkbox"
                  id="dark-mode-toggle"
                  @change=${this.toggleDarkMode}
                  .checked=${this.darkMode}
                />
                Dark Mode
              </label>
              <a href="/app/profile" @click=${this.handleNavigation}>
                Profile
              </a>
              ${this.isAuthenticated
                ? html` <a @click=${this.handleSignOut}>Sign Out</a> `
                : html`
                    <a href="/app/auth" @click=${this.handleNavigation}>
                      Sign In
                    </a>
                  `}
            </div>
          </drop-down>
        </nav>
      </header>
    `;
  }

  static styles = css`
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem;
      background-color: var(--primary-color);
      color: var(--background-color);
      box-shadow: var(--box-shadow);
      height: 3rem;
      padding: 20px 40px;
    }

    .title h1 {
      margin: 0;
      font-size: 1.75rem;
      font-family: var(--font-primary);
    }

    h1 a {
      text-decoration: none;
      color: var(--background-color);
    }

    nav {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .map-link {
      text-decoration: none;
      color: var(--background-color);
      font-size: 1.25rem;
    }

    .map-link:hover {
      text-decoration: underline;
    }

    .dropdown-toggle {
      cursor: pointer;
      color: var(--background-color);
      font-size: 1.25rem;
    }

    .dropdown-content {
      position: absolute;
      right: 0;
      background-color: var(--background-color);
      color: var(--primary-color);
      box-shadow: var(--box-shadow);
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 150px;
      z-index: 100;
    }

    .dropdown-content label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
    }

    .dropdown-content a {
      text-decoration: none;
      color: var(--primary-color);
      font-size: 1.1rem;
    }

    .dropdown-content a:hover {
      text-decoration: underline;
    }

    label.dark-mode-switch {
      font-size: 1.1rem;
    }

    .menu-icon {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: none;
      border: none;
      border-radius: 5px;
      padding: 4px;
      filter: invert(1);
    }

    .menu-icon.dark-mode {
      filter: invert(0);
    }

    .menu-icon-svg {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }

    .menu-icon:hover .menu-icon-svg {
      filter: brightness(1.2);
    }
  `;
}

define({ "trip-header": TripHeaderElement });
