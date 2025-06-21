import express from 'express';
import { Project } from '../models/Projects.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

const router = express.Router();

// Multer storage ayarı
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const slug = req.body.slug || slugify(req.body.title || 'proje', { lower: true, strict: true });
    const dir = `./public/images/${slug}`;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const slug = req.body.slug || slugify(req.body.title || 'proje', { lower: true, strict: true });

    if (!req.fileIndex) req.fileIndex = { coverImage: 0, galleryImages: 0 };

    const fieldName = file.fieldname;
    const index = req.fileIndex[fieldName]++;

    const fileName =
      fieldName === 'coverImage'
        ? `coverImage${ext}`
        : `${slug}_${index}${ext}`;

    cb(null, fileName);
  }
});

const upload = multer({ storage });

// Admin Panel - Listeleme
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.render('admin/list', { projects });
  } catch (err) {
    res.status(500).send("Sunucu hatası");
  }
});

// Yeni proje formu
router.get('/add', (req, res) => {
  res.render('admin/add');
});

// Yeni proje kaydet
router.post('/add', upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 30 }
]), async (req, res) => {
  try {
    const {
      title, title_eng, location, client, category, description, description_eng
    } = req.body;

    const slug = slugify(title || 'proje', { lower: true, strict: true });
    const cover = req.files['coverImage']?.[0]?.filename || '';
    const gallery = req.files['galleryImages']?.map(file => file.filename) || [];

    const newProject = new Project({
      title,
      title_eng,
      slug,
      coverImage: `/images/${slug}/${cover}`,
      galleryImages: gallery.map(img => `/images/${slug}/${img}`),
      location,
      client,
      category,
      description,
      description_eng
    });

    await newProject.save();
    res.redirect('/admin/projects');
  } catch (error) {
    console.error("Proje ekleme hatası:", error);
    res.status(500).send("Sunucu hatası");
  }
});

// Düzenleme sayfası
router.get('/edit/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send("Proje bulunamadı");

    if (!project.galleryImages) project.galleryImages = [];
    res.render('admin/edit', { project });
  } catch (err) {
    res.status(500).send("Sunucu hatası");
  }
});

// Proje güncelle
router.post('/edit/:id', upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 }
]), async (req, res) => {
  try {
    const {
      title, title_eng, location, client, category, description, description_eng, removedGalleryImages
    } = req.body;

    const newSlug = slugify(title || 'proje', { lower: true, strict: true });
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send("Proje bulunamadı");

    const oldSlug = project.slug;
    let updatedGalleryImages = [...(project.galleryImages || [])];

    // Eski slug farklıysa klasörü yeniden adlandır
    if (oldSlug !== newSlug) {
      const oldPath = path.join('public', 'images', oldSlug);
      const newPath = path.join('public', 'images', newSlug);
      if (fs.existsSync(oldPath)) fs.renameSync(oldPath, newPath);

      updatedGalleryImages = updatedGalleryImages.map(img =>
        img.replace(`/images/${oldSlug}/`, `/images/${newSlug}/`)

      );

      // Eğer slug değiştiyse eski klasör varsa ve artık boşsa sil
      setTimeout(() => {
      if (fs.existsSync(oldPath) && fs.readdirSync(oldPath).length === 0) {
          fs.rmdirSync(oldPath);
        }
      }, 500);

      // Yeni yüklenen coverImage
      let coverImage = project.coverImage;

      if (req.files['coverImage']?.[0]) {
        // Yeni görsel yüklenmişse doğrudan yeni path
        coverImage = `/images/${newSlug}/${req.files['coverImage'][0].filename}`;
      } else if (oldSlug !== newSlug && coverImage.includes(`/images/${oldSlug}/`)) {
        // Yeni görsel yüklenmediyse ve slug değiştiyse cover image path'ini güncelle
        const oldCoverPath = path.join('public', coverImage);
        const newCoverPath = oldCoverPath.replace(`/images/${oldSlug}/`, `/images/${newSlug}/`);
        const newCoverDir = path.dirname(newCoverPath);
        if (!fs.existsSync(newCoverDir)) fs.mkdirSync(newCoverDir, { recursive: true });
        if (fs.existsSync(oldCoverPath)) fs.renameSync(oldCoverPath, newCoverPath);
        coverImage = coverImage.replace(`/images/${oldSlug}/`, `/images/${newSlug}/`);
      }

    }

    // Yeni yüklenen coverImage
    if (req.files['coverImage']?.[0]) {
      coverImage = `/images/${newSlug}/${req.files['coverImage'][0].filename}`;
    }

    // Yeni galeri görselleri
    const newGallery = req.files['galleryImages']?.map(file => `/images/${newSlug}/${file.filename}`) || [];
    updatedGalleryImages.push(...newGallery);

    // Silinen görseller
    if (removedGalleryImages) {
      const toRemove = removedGalleryImages.split(',');
      updatedGalleryImages = updatedGalleryImages.filter(img => !toRemove.includes(img));
      toRemove.forEach(imgPath => {
        const fullPath = path.join('public', imgPath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }

    // Güncelle
    await Project.findByIdAndUpdate(req.params.id, {
      title,
      title_eng,
      slug: newSlug,
      location,
      client,
      category,
      description,
      description_eng,
      coverImage,
      galleryImages: updatedGalleryImages
    });

    res.redirect('/admin/projects');
  } catch (err) {
    console.error("Güncelleme hatası:", err);
    res.status(500).send("Sunucu hatası");
  }
});

// Sil
router.post('/delete/:id', async (req, res) => {
  //Proje Silindiğinde Görsel Klasörünü Sil
  const project = await Project.findById(req.params.id);
  if (project) {
    const slugFolder = path.join('public', 'images', project.slug);
    if (fs.existsSync(slugFolder)) {
      fs.rmSync(slugFolder, { recursive: true, force: true });
    }
  }

  try {
    await Project.findByIdAndDelete(req.params.id);
    res.redirect('/admin/projects');
  } catch (err) {
    res.status(500).send("Silinemedi");
  }
});

export default router;
