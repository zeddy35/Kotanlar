// routes/admin.js
import express from 'express';
import { Project } from '../models/Projects.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const router = express.Router();

const ADMIN_USER = process.env.ADMIN_USER || 'YDKotan';
const ADMIN_PASS = process.env.ADMIN_PASS || '4af1a-rqwe3-adfgR4';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Çok fazla istek! Lütfen sonra tekrar deneyin.'
});

router.use('/submit', limiter);

function isAuthenticated(req, res, next) {
  if (req.session && req.session.admin) return next();
  return res.redirect('/admin/login');
}

router.get('/login', (req, res) => {
  const error = req.session.loginError || null;
  req.session.loginError = null;
  res.render('admin/login', { error });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.admin = true;
    return res.redirect('/admin/projects');
  } else {
    req.session.loginError = 'Hatalı kullanıcı adı veya şifre';
    return res.redirect('/admin/login');
  }
});

// LogOut
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

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
    const fileName = fieldName === 'coverImage' ? `coverImage${ext}` : `${slug}_${index}${ext}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage });

router.get('/projects', isAuthenticated, async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.render('admin/list', { projects });
});

router.get('/add', isAuthenticated, (req, res) => {
  res.render('admin/add');
});

router.post('/add', isAuthenticated, upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 30 }
]), async (req, res) => {
  try {
    const { title, title_eng, location, client, category, description, description_eng } = req.body;
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
    console.error('Proje ekleme hatası:', error);
    res.status(500).send('Sunucu hatası');
  }
});

// Projeyi getirme (edit sayfası)
router.get('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send('Proje bulunamadı');
    if (!project.galleryImages) project.galleryImages = [];
    res.render('admin/edit', { project });
  } catch (err) {
    res.status(500).send('Sunucu hatası');
  }
});

// Projeyi güncelleme (POST)
router.post('/edit/:id', isAuthenticated, upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 }
]), async (req, res) => {
  try {
      console.log("REQ.BODY:", req.body);
      const {
        title,
        title_eng,
        location,
        client,
        category,
        description,
        description_eng,
        removedGalleryImages
    } = req.body;

    const newSlug = slugify(title || 'proje', { lower: true, strict: true });
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send('Proje bulunamadı');

    const oldSlug = project.slug;
    let updatedGalleryImages = [...(project.galleryImages || [])];

    // Eğer slug değiştiyse klasörü taşı ve yolları güncelle
    if (oldSlug !== newSlug) {
      const oldPath = path.join('public', 'images', oldSlug);
      const newPath = path.join('public', 'images', newSlug);

      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
      }

      // cover ve gallery yollarını slug’a göre güncelle
      if (project.coverImage) {
        project.coverImage = `/images/${newSlug}/${path.basename(project.coverImage)}`;
      }
      updatedGalleryImages = updatedGalleryImages.map(img => `/images/${newSlug}/${path.basename(img)}`);

      // eski klasör boşsa sil
      if (oldSlug !== newSlug) {
        const oldPath = path.join('public', 'images', oldSlug);
        if (fs.existsSync(oldPath)) {
          const files = fs.readdirSync(oldPath);
          if (files.length === 0) fs.rmdirSync(oldPath);
        }
      }
    }

    // Cover Image varsa güncelle
    let coverImage = project.coverImage;
    if (req.files['coverImage']?.[0]) {
      coverImage = `/images/${newSlug}/${req.files['coverImage'][0].filename}`;
    }

    // Yeni gallery ekle
    const newGallery = req.files['galleryImages']?.map(file => `/images/${newSlug}/${file.filename}`) || [];
    updatedGalleryImages.push(...newGallery);

  // Silinecek galerileri işleme
  if (removedGalleryImages) {
    const toRemove = removedGalleryImages
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
      .map(imgPath => {
        // Eğer eski slug ile geldiyse, bunu da normalize et
        const filename = path.basename(imgPath);
        return `/images/${newSlug}/${filename}`;
      });

    updatedGalleryImages = updatedGalleryImages.filter(img => !toRemove.includes(img));

    toRemove.forEach(imgPath => {
      const fullPath = path.join('public', imgPath.startsWith('/') ? imgPath : `/${imgPath}`);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });
  }

    // Güncelle ve kaydet
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
    console.error('Güncelleme hatası:', err);
    res.status(500).send('Sunucu hatası');
  }
});

router.post('/delete/:id', isAuthenticated, async (req, res) => {
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
    res.status(500).send('Silinemedi');
  }
});

export default router;