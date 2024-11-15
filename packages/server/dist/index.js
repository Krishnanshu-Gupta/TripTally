"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_express = __toESM(require("express"));
var import_experience_svc = __toESM(require("./services/experience-svc"));
var import_experience = require("./pages/experience");
var import_experiences = __toESM(require("./routes/experiences"));
var import_mongo = require("./services/mongo");
(0, import_mongo.connect)("experience");
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
const staticDir = process.env.STATIC || "public";
console.log("Serving static files from ", staticDir);
app.use(import_express.default.static(staticDir));
app.use(import_express.default.json());
app.use("/api/experiences", import_experiences.default);
app.get("/experience/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await import_experience_svc.default.getExperience(id);
    if (!data) {
      res.status(404).send("Experience not found");
      return;
    }
    const page = new import_experience.ExperiencePage(data);
    res.set("Content-Type", "text/html").send(page.render());
  } catch (error) {
    res.status(500).send("Server error");
  }
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});