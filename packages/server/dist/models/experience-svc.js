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
  getExperience: () => getExperience
});
module.exports = __toCommonJS(experience_svc_exports);
const experiences = {
  hiking: {
    id: "hiking",
    title: "Hiking Adventure",
    category: "Adventure",
    location: "Grand Canyon, USA",
    rating: 4.5,
    user: "John Doe",
    description: "Hike through the majestic Grand Canyon."
  },
  skydiving: {
    id: "skydiving",
    title: "Skydiving",
    category: "Adventure",
    location: "Rocky Mountains, USA",
    rating: 3.8,
    user: "Jane Smith",
    description: "An exhilarating skydive experience."
  },
  foodtour: {
    id: "foodtour",
    title: "Food Tasting Tour",
    category: "Cultural",
    location: "Paris, France",
    rating: 4.2,
    user: "Jane Smith",
    description: "Explore Paris through its incredible cuisine."
  }
};
function getExperience(id) {
  return experiences[id] || experiences["hiking"];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getExperience
});
