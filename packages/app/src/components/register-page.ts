import { LitElement, html, css } from "lit";
import { state } from "lit/decorators.js";
import { define } from "@calpoly/mustang";

export class RegistrationPageElement extends LitElement {
  @state()
  username: string = "";

  @state()
  password: string = "";

  @state()
  confirmPassword: string = "";

  @state()
  errorMessage: string = "";

  handleRegister(event: Event) {
    event.preventDefault();

    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Passwords do not match!";
      return;
    }

    fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/login";
        } else {
          throw new Error("Failed to register");
        }
      })
      .catch((error) => {
        this.errorMessage = error.message;
      });
  }

  render() {
    return html`
      <main class="register-page">
        <form @submit=${this.handleRegister}>
          <h1>Register</h1>
          ${this.errorMessage
            ? html`<p class="error-message">${this.errorMessage}</p>`
            : ""}
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            .value=${this.username}
            @input=${(e: any) => (this.username = e.target.value)}
            required
          />
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            .value=${this.password}
            @input=${(e: any) => (this.password = e.target.value)}
            required
          />
          <label for="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            .value=${this.confirmPassword}
            @input=${(e: any) => (this.confirmPassword = e.target.value)}
            required
          />
          <button type="submit">Register</button>
          <p>
            Already have an account?
            <a href="/login" @click=${this.navigateToLogin}>Login</a>
          </p>
        </form>
      </main>
    `;
  }

  navigateToLogin(event: Event) {
    event.preventDefault();
    window.history.pushState({}, "", "/login");
    window.dispatchEvent(new Event("popstate"));
  }

  static styles = css`
    .register-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: var(--background-color);
    }
    form {
      background-color: var(--secondary-color);
      padding: 2rem;
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      text-align: center;
      width: 100%;
      max-width: 400px;
    }
    input {
      width: 100%;
      padding: 0.8rem;
      margin: 0.5rem 0;
      border: 1px solid var(--input-border);
      border-radius: var(--border-radius);
    }
    button {
      width: 100%;
      padding: 0.8rem;
      background-color: var(--primary-color);
      color: var(--background-color);
      border: none;
      border-radius: var(--border-radius);
      font-size: 1rem;
      cursor: pointer;
    }
    button:hover {
      background-color: var(--accent-color);
    }
    .error-message {
      color: var(--error-color);
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
  `;
}

define({ "register-page": RegistrationPageElement });
