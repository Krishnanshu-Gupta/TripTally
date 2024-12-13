"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var experience_exports = {};
__export(experience_exports, {
  ExperiencePage: () => ExperiencePage
});
module.exports = __toCommonJS(experience_exports);
var import_server = require("@calpoly/mustang/server");
var import_renderPage = __toESM(require("./renderPage"));
class ExperiencePage {
  data;
  constructor(data) {
    this.data = data;
  }
  render() {
    return (0, import_renderPage.default)({
      body: this.renderBody(),
      stylesheets: ["/styles/experience.css"],
      scripts: []
    });
  }
  renderBody() {
    const { id, title, category, location, rating, user, description } = this.data;
    return import_server.html`
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
  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = import_server.html`
      ${Array(fullStars).fill(0).map(
      () => import_server.html`<svg class="icon gold">
              <use href="/icons/sprite.svg#starfill"></use>
            </svg>`
    )}
      ${halfStar ? import_server.html`<svg class="icon half-star">
            <use href="/icons/sprite.svg#starfill"></use>
          </svg>` : ""}
    `;
    return stars;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ExperiencePage
});
