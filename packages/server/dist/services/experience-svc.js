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
var experience_svc_exports = {};
__export(experience_svc_exports, {
  default: () => experience_svc_default
});
module.exports = __toCommonJS(experience_svc_exports);
var import_mongoose = require("mongoose");
const ExperienceSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    rating: { type: Number, required: true },
    user: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true }
  },
  { collection: "experiences" }
);
const ExperienceModel = (0, import_mongoose.model)("Experience", ExperienceSchema);
function index() {
  return ExperienceModel.find();
}
function getExperience(id) {
  return ExperienceModel.findOne({ id }).then((experience) => {
    if (!experience) {
      throw `${id} Not Found`;
    }
    return experience;
  });
}
function create(json) {
  const experience = new ExperienceModel(json);
  return experience.save();
}
function update(id, experience) {
  return ExperienceModel.findOneAndUpdate({ id }, experience, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${id} not updated`;
    return updated;
  });
}
function remove(id) {
  return ExperienceModel.findOneAndDelete({ id }).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}
var experience_svc_default = { index, getExperience, create, update, remove };
