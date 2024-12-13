"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var save_svc_exports = {};
__export(save_svc_exports, {
  default: () => save_svc_default
});
module.exports = __toCommonJS(save_svc_exports);
var import_mongoose = require("mongoose");
const SaveSchema = new import_mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    saved: [{ type: String }]
  },
  { collection: "saves" }
);
const SavedModel = import_mongoose.models.Save || (0, import_mongoose.model)("Save", SaveSchema);
async function getSavedForUser(userId) {
  try {
    const savedDoc = await SavedModel.findOne({ userId }).exec();
    return savedDoc ? savedDoc.saved : [];
  } catch (error) {
    console.error(
      `Error fetching saved experiences for user ${userId}:`,
      error
    );
    throw error;
  }
}
async function addSavedExperience(userId, experienceId) {
  const saveDoc = await SavedModel.findOne({ userId }).exec();
  if (!saveDoc) {
    await SavedModel.create({ userId, saved: [experienceId] });
  } else if (!saveDoc.saved.includes(experienceId)) {
    saveDoc.saved.push(experienceId);
    await saveDoc.save();
  }
}
async function removeSavedExperience(userId, experienceId) {
  const saveDoc = await SavedModel.findOne({ userId }).exec();
  if (saveDoc && saveDoc.saved.includes(experienceId)) {
    saveDoc.saved = saveDoc.saved.filter((id) => id !== experienceId);
    await saveDoc.save();
  }
}
var save_svc_default = {
  SavedModel,
  getSavedForUser,
  addSavedExperience,
  removeSavedExperience
};
