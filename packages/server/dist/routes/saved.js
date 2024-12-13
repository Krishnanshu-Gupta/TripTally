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
var saved_exports = {};
__export(saved_exports, {
  default: () => saved_default
});
module.exports = __toCommonJS(saved_exports);
var import_express = __toESM(require("express"));
var import_save_svc = __toESM(require("../services/save-svc"));
const router = import_express.default.Router();
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const savedExperiences = await import_save_svc.default.getSavedForUser(userId);
    res.status(200).json(savedExperiences);
  } catch (err) {
    res.status(500).json({ error: `Error fetching saved experiences: ${err}` });
  }
});
router.post("/:userId", (req, res) => {
  const { userId } = req.params;
  const { experienceId } = req.body;
  import_save_svc.default.addSavedExperience(userId, experienceId).then(
    () => res.status(201).json({ message: "Experience saved successfully" })
  ).catch(
    (err) => res.status(500).json({ error: `Error saving experience: ${err}` })
  );
});
router.delete("/:userId", (req, res) => {
  const { userId } = req.params;
  const { experienceId } = req.body;
  import_save_svc.default.removeSavedExperience(userId, experienceId).then(
    () => res.status(200).json({ message: "Experience removed successfully" })
  ).catch(
    (err) => res.status(500).json({ error: `Error removing experience: ${err}` })
  );
});
var saved_default = router;
