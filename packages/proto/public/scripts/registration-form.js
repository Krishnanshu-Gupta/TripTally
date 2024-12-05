import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";
import headings from "./styles/headings.css.js";
import tokens from "./styles/tokens.css.js";

export class RegistrationForm extends HTMLElement {
  static template = html`
    <template>
      <form id="registration-form">
        <slot name="title">
          <h3>Create Your Account</h3>
        </slot>
        <label>
          <span>
            <slot name="username">Username</slot>
          </span>
          <input name="username" autocomplete="off" required />
        </label>
        <label>
          <span>
            <slot name="password">Password</slot>
          </span>
          <input type="password" name="password" required />
        </label>
        <label>
          <span>
            <slot name="confirm-password">Confirm Password</slot>
          </span>
          <input type="password" name="confirmPassword" required />
        </label>
        <slot name="submit">
          <button type="submit">Sign Up</button>
        </slot>
      </form>
    </template>
  `;

  static styles = css`
    :host {
      display: block;
      margin: 0 auto;
      padding: var(--space-md);
      max-width: 400px;
      border: 1px solid var(--secondary-color);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      background-color: var(--experience-box-color);
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    label {
      display: flex;
      flex-direction: column;
      font-size: var(--base-font-size);
      font-weight: 500;
      color: var(--text-color);
    }

    input {
      margin-top: var(--space-sm);
      padding: var(--space-sm);
      font-size: var(--base-font-size);
      border: 1px solid var(--input-border);
      border-radius: var(--border-radius);
      background-color: var(--input-background);
      color: var(--input-text);
      outline: none;
      transition: border 0.3s ease, background-color 0.3s ease, color 0.3s ease;
    }

    input:hover {
      background-color: var(--secondary-color);
    }

    input:focus {
      border: 1px solid var(--primary-color);
      background-color: var(--background-color);
      color: var(--text-color);
    }

    button[type="submit"] {
      margin: var(--space-md) 0 0;
      padding: var(--space-sm) var(--space-md);
      font-size: var(--base-font-size);
      font-weight: bold;
      background-color: var(--primary-color);
      color: var(--background-color);
      border: none;
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.2s ease;
    }

    button[type="submit"]:hover {
      background-color: var(--accent-color);
      transform: translateY(-2px);
    }

    button[type="submit"]:active {
      transform: translateY(0);
    }

    ::slotted(*[slot="title"]),
    slot[name="title"] > * {
      font-size: 1.25rem;
      font-weight: bold;
      color: var(--text-color);
      text-align: center;
      margin-bottom: var(--space-md);
    }

    :host(.dark-mode) {
      background-color: var(--secondary-color);
      border-color: var(--input-border-dark);
    }

    :host(.dark-mode) button[type="submit"] {
      background-color: var(--primary-color);
      color: var(--background-color);
    }

    :host(.dark-mode) button[type="submit"]:hover {
      background-color: var(--accent-color);
    }
  `;

  constructor() {
    super();

    shadow(this)
      .template(RegistrationForm.template)
      .styles(reset.styles, headings.styles, tokens.styles, RegistrationForm.styles);

    this._form = null;
  }

  connectedCallback() {
    this._form = this.shadowRoot.querySelector("#registration-form");
    this._form.addEventListener("submit", this.handleSubmit.bind(this));
  }

  disconnectedCallback() {
    if (this._form) {
      this._form.removeEventListener("submit", this.handleSubmit.bind(this));
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(this._form);

    // Password confirmation check
    if (data.get("password") !== data.get("confirmPassword")) {
      alert("Passwords do not match!");
      return;
    }

    // Post data to the API
    fetch(this.getAttribute("api"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(data)),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Registration failed");
        return res.json();
      })
      .then(() => {
        alert("Registration successful! Please log in.");
        window.location.href = "./login";
      })
      .catch((error) => console.error("Error during registration:", error));
  }
}

customElements.define("registration-form", RegistrationForm);
