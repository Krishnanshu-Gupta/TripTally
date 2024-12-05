import { Auth, History, Switch, define, Store } from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { HomeViewElement } from "./views/home-view";
import { ExperienceViewElement } from "./views/experience-view";
import { AuthViewElement } from "./views/auth-view";
import { TripHeaderElement } from "./components/trip-header";
import { LoginPageElement } from "./components/login-page";
import { RegistrationPageElement } from "./components/register-page";
import { ExperienceCreateElement } from "./views/experience-create";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";

const routes = [
  {
    path: "/app",
    view: () => html`<home-view></home-view>`,
  },
  {
    path: "/app/experience/:id",
    view: (params: Switch.Params) =>
      html`<experience-view experience-id=${params.id}></experience-view>`,
  },
  {
    path: "/app/add-experience",
    view: () => html`<experience-create></experience-create>`,
  },
  {
    path: "/app/auth",
    view: () => html`<auth-view></auth-view>`,
  },
  {
    path: "/",
    redirect: "/app",
  },
];

class AppElement extends LitElement {
    render() {
      return html`<mu-switch></mu-switch>`;
    }

    connectedCallback() {
      super.connectedCallback();
    }
  }

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "blazing:history", "blazing:auth");
    }
  },
  "home-view": HomeViewElement,
  "experience-view": ExperienceViewElement,
  "trip-header": TripHeaderElement,
  "login-page": LoginPageElement,
  "auth-view": AuthViewElement,
  "register-page": RegistrationPageElement,
  "experience-create": ExperienceCreateElement,
    "trip-app": AppElement,
    "mu-store": class AppStore extends Store.Provider<Model, Msg> {
      constructor() {
        super(update, init, "blazing:auth");
      }
    }
});
