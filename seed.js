import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Project } from './models/Projects.js';
import projects from './data/data.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log("✅ MongoDB bağlantısı başarılı");

  await Project.deleteMany();
  await Project.insertMany(projects);

  console.log("✅ Veriler başarıyla yüklendi");
  process.exit();
}).catch((err) => {
  console.error("❌ MongoDB bağlantı hatası:", err.message);
  process.exit(1);
});
