import { Schema, model, models } from "mongoose";
import { Save } from "../models";

const SaveSchema = new Schema<Save>(
  {
    userId: { type: String, required: true, unique: true },
    saved: [{ type: String }],
  },
  { collection: "saves" }
);

const SavedModel = models.Save || model<Save>("Save", SaveSchema);

async function getSavedForUser(userId: string): Promise<string[]> {
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

async function addSavedExperience(
  userId: string,
  experienceId: string
): Promise<void> {
  const saveDoc = await SavedModel.findOne({ userId }).exec();

  if (!saveDoc) {
    await SavedModel.create({ userId, saved: [experienceId] });
  } else if (!saveDoc.saved.includes(experienceId)) {
    saveDoc.saved.push(experienceId);
    await saveDoc.save();
  }
}

async function removeSavedExperience(
  userId: string,
  experienceId: string
): Promise<void> {
  const saveDoc = await SavedModel.findOne({ userId }).exec();

  if (saveDoc && saveDoc.saved.includes(experienceId)) {
    saveDoc.saved = saveDoc.saved.filter((id: string) => id !== experienceId);
    await saveDoc.save();
  }
}

export default {
  SavedModel,
  getSavedForUser,
  addSavedExperience,
  removeSavedExperience,
};
