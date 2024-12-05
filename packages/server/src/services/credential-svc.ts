import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import { Credential } from "../models/credential";

const credentialSchema = new Schema<Credential>(
  {
    username: { type: String,required: true, trim: true},
    name: { type: String,required: true, trim: true},
    hashedPassword: {type: String,required: true}
  },
  { collection: "user_credentials" }
);

const credentialModel = model<Credential>(
  "Credential",
  credentialSchema
);

function create(username: string, name: string, password: string): Promise<Credential> {
  return new Promise<Credential>((resolve, reject) => {
    if (!username || !name || !password) {
      return reject("Must provide username, name, and password");
    }

    credentialModel
      .findOne({ username })
      .then((found) => {
        if (found) {
          throw new Error("Username already exists");
        }
        return bcrypt.genSalt(10);
      })
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        const creds = new credentialModel({ username, name, hashedPassword });
        return creds.save();
      })
      .then((created) => {
        if (created) resolve(created);
        else throw new Error("Failed to create user");
      })
      .catch((error) => reject(error));
  });
}

// Verify credentials
function verify(username: string, password: string): Promise<Credential> {
  return new Promise<Credential>((resolve, reject) => {
    credentialModel
      .findOne({ username })
      .then((credsOnFile) => {
        if (!credsOnFile) {
          throw new Error("Invalid username or password");
        }
        return bcrypt.compare(password, credsOnFile.hashedPassword).then((result) => {
          if (result) {
            resolve(credsOnFile);
          } else {
            throw new Error("Invalid username or password");
          }
        });
      })
      .catch((error) => reject(error));
  });
}


export default { create, verify };