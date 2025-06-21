import express from 'express';
import { Project } from '../models/Projects.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

// __dirname alternatifi (ESM uyumlu)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Anasayfa
router.get('/', async (req, res) => {
  const projects = await Project.find();
  res.render('index', { projects });
});
// Anasayfa İngilizce
router.get('/en', async (req, res) => {
  const projects = await Project.find();
  res.render('index-en', { projects });
});

// Satın Alma Opsiyonları TR/ENG
router.get('/buy', async (req, res) => {
  res.render('buy');
});

router.get('/buy-en', async (req, res) => {
  res.render('buy-en');
});

// Proje listesi (Türkçe)
router.get('/projects', async (req, res) => {
  const projects = await Project.find();
  res.render('projects', { projects });
});

// Proje listesi (İngilizce)
router.get('/projects-en', async (req, res) => {
  const projects = await Project.find();
  res.render('projects-en', { projects });
});

// Proje detay sayfası (Türkçe)
router.get('/projects/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).send("Proje bulunamadı");

    const projects = await Project.find(); // Diğer projeleri gösterme için

    const folderName = project.slug;
    const imageDir = path.join(__dirname, '../public/images', folderName);
    let galleryImages = [];

    try {
      galleryImages = fs.readdirSync(imageDir)
        .filter(file => /\.(jpe?g|png|webp|gif)$/i.test(file))
        .map(file => `/images/${folderName}/${file}`);
    } catch (err) {
      console.warn("Galeri klasörü okunamadı:", err.message);
    }

    res.render('project-detail', {
      project: { ...project._doc, gallery: galleryImages },
      projects // 👈 EJS tarafına gönderiyoruz
    });

  } catch (err) {
    console.error("Detay sayfası hatası:", err.message);
    res.status(500).send("Sunucu hatası");
  }
});

// Proje detay sayfası (İngilizce)
router.get('/projects-en/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).send("Project not found");

    const projects = await Project.find();

    const folderName = project.slug;
    const imageDir = path.join(__dirname, '../public/images', folderName);
    let galleryImages = [];

    try {
      galleryImages = fs.readdirSync(imageDir)
        .filter(file => /\.(jpe?g|png|webp|gif)$/i.test(file))
        .map(file => `/images/${folderName}/${file}`);
    } catch (err) {
      console.warn("Gallery folder read error:", err.message);
    }

    res.render('project-detail-en', {
      project: { ...project._doc, gallery: galleryImages },
      projects
    });

  } catch (err) {
    console.error("Detail page error:", err.message);
    res.status(500).send("Server error");
  }
});

export default router;
