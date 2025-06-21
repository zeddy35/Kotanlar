import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: String,
  title_eng: String,
  slug: String,
  coverImage: String,         // Kapak görseli
  description: String,
  description_eng: String,
  location: String,
  galleryImages: [String]       // Galeri
});

export const Project = mongoose.model("Project", projectSchema);
