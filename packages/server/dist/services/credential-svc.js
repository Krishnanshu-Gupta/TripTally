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
var credential_svc_exports = {};
__export(credential_svc_exports, {
  default: () => credential_svc_default
});
module.exports = __toCommonJS(credential_svc_exports);
var import_bcryptjs = __toESM(require("bcryptjs"));
var import_mongoose = require("mongoose");
const credentialSchema = new import_mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    hashedPassword: { type: String, required: true }
  },
  { collection: "user_credentials" }
);
const credentialModel = (0, import_mongoose.model)(
  "Credential",
  credentialSchema
);
function create(username, name, password) {
  return new Promise((resolve, reject) => {
    if (!username || !name || !password) {
      return reject("Must provide username, name, and password");
    }
    credentialModel.findOne({ username }).then((found) => {
      if (found) {
        throw new Error("Username already exists");
      }
      return import_bcryptjs.default.genSalt(10);
    }).then((salt) => import_bcryptjs.default.hash(password, salt)).then((hashedPassword) => {
      const creds = new credentialModel({ username, name, hashedPassword });
      return creds.save();
    }).then((created) => {
      if (created) resolve(created);
      else throw new Error("Failed to create user");
    }).catch((error) => reject(error));
  });
}
function verify(username, password) {
  return new Promise((resolve, reject) => {
    credentialModel.findOne({ username }).then((credsOnFile) => {
      if (!credsOnFile) {
        throw new Error("Invalid username or password");
      }
      return import_bcryptjs.default.compare(password, credsOnFile.hashedPassword).then((result) => {
        if (result) {
          resolve(credsOnFile);
        } else {
          throw new Error("Invalid username or password");
        }
      });
    }).catch((error) => reject(error));
  });
}
var credential_svc_default = { create, verify };
