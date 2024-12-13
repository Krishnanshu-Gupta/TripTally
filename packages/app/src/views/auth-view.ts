import { define, View } from "@calpoly/mustang";
import { html, css } from "lit";
import { Msg } from "../messages";
import { Model } from "../model";
import { state } from "lit/decorators.js";
import { LoginPageElement } from "../components/login-page";
import { RegistrationPageElement } from "../components/register-page";

export class AuthViewElement extends View<Model, Msg> {
  @state()
  isLogin: boolean = false;
  @state()
  name: string = "";
  @state()
  username: string = "";
  @state()
  password: string = "";
  @state()
  confirmPassword: string = "";
  @state()
  errorMessage: string = "";

  static uses = [LoginPageElement, RegistrationPageElement];

  @state()
  get isAuthenticated(): boolean {
    return this.model.isAuthenticated;
  }

  @state()
  get user(): { username: string } | undefined {
    return this.model.user;
  }

  constructor() {
    super("blazing:model");
  }

  handleAuth(event: Event) {
    event.preventDefault();

    if (this.isLogin) {
      const payload = { username: this.username, password: this.password };
      this.dispatchMessage(["auth/login", payload]);
    } else if (this.password === this.confirmPassword) {
      const payload = {
        username: this.username,
        name: this.name,
        password: this.password,
      };
      this.dispatchMessage(["auth/register", payload]);
    } else {
      this.errorMessage = "Passwords do not match!";
    }
  }

  handleLogout() {
    this.dispatchMessage(["auth/logout", {}]);
  }

  toggleView() {
    this.isLogin = !this.isLogin;
    this.clearForm();
  }

  clearForm() {
    this.username = "";
    this.name = "";
    this.password = "";
    this.confirmPassword = "";
    this.errorMessage = "";
  }

  render() {
    if (this.isAuthenticated) {
      return html` <main class="page">
        <div class="auth-container">
          <p>Welcome, ${this.user?.username}! You are already logged in.</p>
          <button @click=${this.handleLogout}>Logout</button>
        </div>
      </main>`;
    }
    return html`
      <main class="page">
        <div class="auth-container">
          ${this.isLogin ? this.renderLoginView() : this.renderRegisterView()}
        </div>
      </main>
    `;
  }

  renderLoginView() {
    return html`
      <div class="login_form_container">
        <div class="left">
          <div class="form_container">
            <h1>Sign in and explore!</h1>
            <form @submit=${this.handleAuth}>
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
              <div class="button-wrapper">
                <button type="submit">Login</button>
              </div>
            </form>
          </div>
        </div>
        <div class="right">
          <h1>New Here?</h1>
          <p>Create an account to start exploring trips!</p>
          <button @click=${this.toggleView} class="change-button">
            Register Now
          </button>
        </div>
      </div>
    `;
  }

  renderRegisterView() {
    return html`
      <div class="login_form_container">
        <div class="right2">
          <h1>Already a Member?</h1>
          <p>Sign in to continue exploring trips!</p>
          <button @click=${this.toggleView} class="change-button">
            Sign In Now
          </button>
        </div>
        <div class="left2">
          <div class="form_container">
            <h1>Create Your Account</h1>
            <form @submit=${this.handleAuth}>
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
              <label for="username">Name</label>
              <input
                type="text"
                id="username"
                .value=${this.name}
                @input=${(e: any) => (this.name = e.target.value)}
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
              <div class="button-wrapper">
                <button type="submit">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      overflow: hidden;
    }

    .page {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100vh - 3.5rem - 1px);
      overflow: hidden;
      background-color: var(--background-color);
    }

    .login_form_container {
      height: 520px;
      width: 920px;
      display: flex;
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      background-color: var(--experience-box-color);
    }

    .left,
    .right {
      padding: var(--space-md);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .left {
      flex: 2;
      background-color: var(--secondary-color);
      border-top-left-radius: var(--border-radius);
      border-bottom-left-radius: var(--border-radius);
      align-items: left;
    }

    .right {
      font-family: "Merriweather", serif;
      background-color: var(--primary-color);
      color: var(--background-color);
      border-top-right-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
      padding: var(--space-md);
    }

    .left h1 {
      font-size: 1.75rem;
      margin-bottom: var(--space-md);
      font-family: "Merriweather", serif;
      font-weight: bold;
    }

    .left p {
      font-size: var(--base-font-size);
      text-align: center;
    }

    .left a {
      margin-top: var(--space-md);
      color: var(--background-color);
      text-decoration: none;
      font-weight: bold;
      border: 2px solid var(--background-color);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--border-radius);
      transition: all 0.3s ease;
    }

    .left a:hover {
      background-color: var(--background-color);
      color: var(--primary-color);
    }

    .left2,
    .right2 {
      padding: var(--space-md);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .left2 {
      width: 60%;
      background-color: var(--secondary-color);
      border-top-left-radius: var(--border-radius);
      border-bottom-left-radius: var(--border-radius);
      align-items: left;
    }

    .right2 {
      width: 40%;
      flex: 0 0 auto;
      font-family: "Merriweather", serif;
      background-color: var(--primary-color);
      color: var(--background-color);
      border-top-right-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
      padding: var(--space-md);
    }

    .left2 h1 {
      font-size: 1.75rem;
      margin-bottom: var(--space-md);
      font-family: "Merriweather", serif;
      font-weight: bold;
    }

    .left2 p {
      font-size: var(--base-font-size);
      text-align: center;
    }

    .left2 a {
      margin-top: var(--space-md);
      color: var(--background-color);
      text-decoration: none;
      font-weight: bold;
      border: 2px solid var(--background-color);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--border-radius);
      transition: all 0.3s ease;
    }

    .left2 a:hover {
      background-color: var(--background-color);
      color: var(--primary-color);
    }

    .form_container form {
      margin-top: var(--space-lg);
      display: flex;
      flex-direction: column;
      align-items: left;
      width: 100%;
    }

    input {
      padding: var(--space-sm);
      margin: var(--space-sm) 0px;
      border-radius: var(--border-radius);
      border: 1px solid var(--input-border);
      background-color: var(--experience-box-color);
      color: var(--text-color);
    }

    .button-wrapper {
      margin: 0px 20px;
    }

    button {
      margin-top: var(--space-md);
      padding: var(--space-sm) var(--space-sm);
      border-radius: var(--border-radius);
      background-color: var(--primary-color);
      color: var(--background-color);
      font-weight: bold;
      border: none;
      cursor: pointer;
      width: 100%;
    }

    button:hover {
      background-color: var(--accent-color);
    }

    .change-button {
      color: var(--background-color);
      text-decoration: none;
      border: 2px solid var(--background-color);
      padding: var(--space-sm) var(--space-md);
      margin-top: var(--space-md);
      border-radius: var(--border-radius);
      width: fit-content;
    }

    .change-button:hover {
      background-color: var(--accent-color);
    }

    .error-message {
      color: var(--error-color);
      margin-bottom: var(--space-sm);
    }
  `;
}

define({ "auth-view": AuthViewElement });
