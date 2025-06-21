import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { Project } from '../models/Projects.js';

await mongoose.connect(process.env.MONGODB_URI);

const allProjects = await Project.find({});
console.log("Veritabanındaki proje sayısı:", allProjects.length);
console.log(allProjects.map(p => p.title));

await mongoose.disconnect();
