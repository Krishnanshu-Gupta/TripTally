import { Schema, model } from "mongoose";
import { Experience } from "../models";

const ExperienceSchema = new Schema<Experience>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    rating: { type: Number, required: true },
    user: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { collection: "experiences" }
);

const ExperienceModel = model<Experience>("Experience", ExperienceSchema);

function index(): Promise<Experience[]> {
  return ExperienceModel.find();
}

function getExperience(id: string): Promise<Experience> {
  return ExperienceModel.findOne({ id }).then((experience) => {
    if (!experience) {
      throw `${id} Not Found`;
    }
    return experience;
  });
}

function create(json: Experience): Promise<Experience> {
  const experience = new ExperienceModel(json);
  return experience.save();
}

function update(id: string, experience: Experience): Promise<Experience> {
  return ExperienceModel.findOneAndUpdate({ id }, experience, {
    new: true,
  }).then((updated) => {
    if (!updated) throw `${id} not updated`;
    return updated as Experience;
  });
}

function remove(id: string): Promise<void> {
  return ExperienceModel.findOneAndDelete({ id }).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}

export default { index, getExperience, create, update, remove };