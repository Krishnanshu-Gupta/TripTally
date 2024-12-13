import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";
import headings from "./styles/headings.css.js";
import tokens from "./styles/tokens.css.js";

export class LoginForm extends HTMLElement {
  static template = html`<template>
    <form onsubmit="false;">
      <slot name="title">
        <h3>Sign in with Username and Password</h3>
      </slot>
      <label>
        <span>
          <slot name="username">Username</slot>
        </span>
        <input name="username" autocomplete="off" />
      </label>
      <label>
        <span>
          <slot name="password">Password</slot>
        </span>
        <input type="password" name="password" />
      </label>
      <slot name="submit">
        <button type="submit">Sign In</button>
      </slot>
    </form>
  </template>`;

  static styles = css`
    login-form {
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

    body.dark-mode input {
      background-color: var(--input-background);
      border: 1px solid var(--input-border);
      color: var(--input-text);
    }

    body.dark-mode input:focus {
      border-color: var(--primary-color);
    }

    button[type="submit"] {
      margin: var(--space-md);
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

    body.dark-mode login-form {
      background-color: var(--secondary-color);
      border-color: var(--input-border-dark);
    }

    body.dark-mode button[type="submit"] {
      background-color: var(--primary-color);
      color: var(--background-color);
    }

    body.dark-mode button[type="submit"]:hover {
      background-color: var(--accent-color);
    }
  `;

  get form() {
    return this.shadowRoot.querySelector("form");
  }

  constructor() {
    super();

    shadow(this)
      .template(LoginForm.template)
      .styles(reset.styles, headings.styles, tokens.styles, LoginForm.styles);

    this.form.addEventListener("submit", (event) =>
      submitLoginForm(
        event,
        this.getAttribute("api"),
        this.getAttribute("redirect") || "/"
      )
    );
  }
}

function submitLoginForm(event, endpoint, redirect) {
  event.preventDefault();
  const form = event.target.closest("form");
  const data = new FormData(form);
  const method = "POST";
  const headers = {
    "Content-Type": "application/json",
  };
  const body = JSON.stringify(Object.fromEntries(data));

  fetch(endpoint, { method, headers, body })
    .then((res) => {
      if (res.status !== 200)
        throw new Error(`Form submission failed: Status ${res.status}`);
      return res.json();
    })
    .then((payload) => {
      const { token } = payload;

      form.dispatchEvent(
        new CustomEvent("auth:message", {
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { token, redirect }],
        })
      );
    })
    .catch((err) => console.error("Error submitting form:", err));
}
