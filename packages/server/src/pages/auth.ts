const staticParts = {
  styles: [
    `
      article {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background-color: var(--background-color);
        color: var(--text-color);
        transition: background-color 0.3s ease, color 0.3s ease;
      }

      blz-header {
        flex-shrink: 0;
      }

      main.page {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
      }

      .login_form_container {
        width: 920px;
        height: 520px;
        display: flex;
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        background-color: var(--experience-box-color);
        transition: background-color 0.3s ease, box-shadow 0.3s ease;
      }

      .left {
        flex: 3;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: var(--secondary-color);
        border-top-left-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
        padding: var(--space-md);
        transition: background-color 0.3s ease;
      }

      .form_container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .form_container h3 {
        font-size: 1.5rem;
        margin-bottom: var(--space-md);
        font-weight: bold;
        font-family: var(--font-primary);
        color: var(--text-color);
      }

      .form_container input {
        outline: none;
        border: 1px solid var(--secondary-color);
        width: 360px;
        padding: var(--space-sm);
        border-radius: var(--border-radius);
        background-color: var(--experience-box-color);
        color: var(--text-color);
        margin: var(--space-sm) 0;
        font-size: var(--base-font-size);
        transition: all 0.3s ease;
      }

      .form_container input:focus {
        border-color: var(--primary-color);
        background-color: var(--background-color);
      }

      .form_container button {
        border: none;
        outline: none;
        padding: var(--space-sm) var(--space-md);
        background-color: var(--primary-color);
        color: var(--background-color);
        border-radius: var(--border-radius);
        font-weight: bold;
        font-size: var(--base-font-size);
        cursor: pointer;
        margin-top: var(--space-md);
        box-shadow: var(--box-shadow);
        transition: background-color 0.3s ease, transform 0.2s ease;
      }

      .form_container button:hover {
        background-color: var(--accent-color);
        transform: translateY(-2px);
      }

      .form_container button:active {
        transform: translateY(0);
      }

      .right {
        flex: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: var(--primary-color);
        border-top-right-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
        color: var(--background-color);
        padding: var(--space-md);
        transition: background-color 0.3s ease, color 0.3s ease;
      }

      .right h1 {
        font-size: 1.75rem;
        margin-bottom: var(--space-sm);
        font-family: var(--font-primary);
        font-weight: bold;
      }

      .right p {
        font-size: var(--base-font-size);
        text-align: center;
      }

      .right a {
        margin-top: var(--space-md);
        color: var(--background-color);
        text-decoration: none;
        font-weight: bold;
        border: 2px solid var(--background-color);
        padding: var(--space-sm) var(--space-md);
        border-radius: var(--border-radius);
        transition: all 0.3s ease;
      }

      .right a:hover {
        background-color: var(--background-color);
        color: var(--primary-color);
      }

      /* Dark Mode Specific Styles */
      body.dark-mode .login_form_container {
        background-color: var(--experience-box-color);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      }

      body.dark-mode .left {
        background-color: var(--secondary-color);
      }

      body.dark-mode .form_container input {
        background-color: var(--secondary-color);
        color: var(--text-color);
      }

      body.dark-mode .form_container input:focus {
        background-color: var(--experience-box-color);
      }

      body.dark-mode .right {
        background-color: var(--primary-color);
        color: var(--background-color);
      }

      body.dark-mode .right a {
        color: var(--background-color);
        border-color: var(--background-color);
      }

      body.dark-mode .right a:hover {
        background-color: var(--background-color);
        color: var(--primary-color);
      }
      `,
  ],
};

export class LoginPage {
  static render() {
    return {
      ...staticParts,
      scripts: [
        `
          import { define, Auth } from "@calpoly/mustang";
          import { LoginForm } from "/scripts/login-form.js";
          import { RegistrationForm } from "/scripts/registration-form.js";

          define({
            "mu-auth": Auth.Provider,
            "login-form": LoginForm,
            "registration-form": RegistrationForm,
          })
          `,
      ],
      body: `<body>
          <mu-auth provides="blazing:auth">
            <article>
              <blz-header></blz-header>
              <main class="page">
                <div class="login_form_container">
                  <div class="left">
                    <div class="form_container">
                      <login-form api="/auth/login">
                        <h3 slot="title">Sign in and go places!</h3>
                      </login-form>
                    </div>
                  </div>
                  <div class="right">
                    <h1>New Here?</h1>
                    <p>Register now to start viewing trips!</p>
                    <a href="./register">Register Now</a>
                  </div>
                </div>
              </main>
            </article>
          </mu-auth>
        </body>`,
    };
  }
}

export class RegistrationPage {
  static render() {
    return {
      styles: [
        `
          article {
            display: flex;
            flex-direction: column;
            height: 100vh;
            background-color: var(--background-color);
            color: var(--text-color);
            transition: background-color 0.3s ease, color 0.3s ease;
          }

          blz-header {
            flex-shrink: 0;
          }

          main.page {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-grow: 1;
          }

          .registration_form_container {
            width: 920px;
            height: 520px;
            display: flex;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            background-color: var(--experience-box-color);
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
          }

          .left {
            flex: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: var(--primary-color);
            border-top-left-radius: var(--border-radius);
            border-bottom-left-radius: var(--border-radius);
            color: var(--background-color);
            padding: var(--space-md);
            transition: background-color 0.3s ease, color 0.3s ease;
          }

          .left h1 {
            font-size: 1.75rem;
            margin-bottom: var(--space-sm);
            font-family: var(--font-primary);
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

          .right {
            flex: 3;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: var(--secondary-color);
            border-top-right-radius: var(--border-radius);
            border-bottom-right-radius: var(--border-radius);
            padding: var(--space-md);
            transition: background-color 0.3s ease;
          }

          .form_container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .form_container h3 {
            font-size: 1.5rem;
            margin-bottom: var(--space-md);
            font-weight: bold;
            font-family: var(--font-primary);
            color: var(--text-color);
          }

          .form_container input {
            outline: none;
            border: 1px solid var(--secondary-color);
            width: 360px;
            padding: var(--space-sm);
            border-radius: var(--border-radius);
            background-color: var(--experience-box-color);
            color: var(--text-color);
            margin: var(--space-sm) 0;
            font-size: var(--base-font-size);
            transition: all 0.3s ease;
          }

          .form_container input:focus {
            border-color: var(--primary-color);
            background-color: var(--background-color);
          }

          .form_container button {
            border: none;
            outline: none;
            padding: var(--space-sm) var(--space-md);
            background-color: var(--primary-color);
            color: var(--background-color);
            border-radius: var(--border-radius);
            font-weight: bold;
            font-size: var(--base-font-size);
            cursor: pointer;
            margin-top: var(--space-md);
            box-shadow: var(--box-shadow);
            transition: background-color 0.3s ease, transform 0.2s ease;
          }

          .form_container button:hover {
            background-color: var(--accent-color);
            transform: translateY(-2px);
          }

          .form_container button:active {
            transform: translateY(0);
          }

          /* Dark Mode Specific Styles */
          body.dark-mode .registration_form_container {
            background-color: var(--experience-box-color);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          }

          body.dark-mode .left {
            background-color: var(--primary-color);
            color: var(--background-color);
          }

          body.dark-mode .left a {
            color: var(--background-color);
            border-color: var(--background-color);
          }

          body.dark-mode .left a:hover {
            background-color: var(--background-color);
            color: var(--primary-color);
          }

          body.dark-mode .right {
            background-color: var(--secondary-color);
          }

          body.dark-mode .form_container input {
            background-color: var(--secondary-color);
            color: var(--text-color);
          }

          body.dark-mode .form_container input:focus {
            background-color: var(--experience-box-color);
          }
          `,
      ],
      scripts: [
        `
          import { define, Auth } from "@calpoly/mustang";
          import { RegistrationForm } from "/scripts/registration-form.js";

          define({
            "mu-auth": Auth.Provider,
            "registration-form": RegistrationForm
          })
          `,
      ],
      body: `<body>
          <mu-auth provides="blazing:auth">
            <article>
              <blz-header></blz-header>
              <main class="page">
                <div class="registration_form_container">
                  <div class="left">
                    <h1>Welcome Back!</h1>
                    <p>Already have an account? Log in now to continue viewing trips.</p>
                    <a href="./login">Log In</a>
                  </div>
                  <div class="right">
                    <div class="form_container">
                      <registration-form api="/auth/register">
                        <h3 slot="title">Create Your Account</h3>
                      </registration-form>
                    </div>
                  </div>
                </div>
              </main>
            </article>
          </mu-auth>
        </body>`,
    };
  }
}
