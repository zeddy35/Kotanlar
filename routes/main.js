import express from 'express';
import { Project } from '../models/Projects.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mail ayarları
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendFormMail = async ({ name, email, phone, message }) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: 'infokotanlaryapi@gmail.com',
    subject: 'Yeni, Websiteden Gelen İletişim Formu Mesajı',
    html: `
      <h2>Yeni Mesaj Geldi</h2>
      <p><strong>Ad:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefon:</strong> ${phone || '-'}</p>
      <p><strong>Mesaj:</strong> ${message}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Ana sayfa ve projeler
router.get('/', async (req, res) => {
  const projects = await Project.find();
  res.render('index', { projects });
});

router.get('/en', async (req, res) => {
  const projects = await Project.find();
  res.render('index-en', { projects });
});

router.get('/buy', (req, res) => res.render('buy'));
router.get('/buy-en', (req, res) => res.render('buy-en'));

router.get('/projects', async (req, res) => {
  const projects = await Project.find();
  res.render('projects', { projects });
});

router.get('/projects-en', async (req, res) => {
  const projects = await Project.find();
  res.render('projects-en', { projects });
});

router.get('/projects/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).send("Proje bulunamadı");

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
      projects: await Project.find()
    });
  } catch (err) {
    res.status(500).send("Sunucu hatası");
  }
});

router.get('/projects-en/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).send("Project not found");

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

    res.render('project-detail-en', {
      project: { ...project._doc, gallery: galleryImages },
      projects: await Project.find()
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// İletişim formu
router.post('/submit',
  [
    body('name').notEmpty().withMessage('Ad boş olamaz'),
    body('email').isEmail().withMessage('Geçerli bir email girin'),
    body('phone').optional({ checkFalsy: true }).isMobilePhone().withMessage('Geçerli telefon girin'),
    body('message').notEmpty().withMessage('Mesaj boş olamaz'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    if (req.body.website) return res.status(400).send("Bot algılandı");

    const { name, email, phone, message } = req.body;

    try {
      await sendFormMail({ name, email, phone, message });
      res.status(200).json({ success: true, msg: "Mail başarıyla gönderildi" });
    } catch (err) {
      res.status(500).json({ success: false, msg: "Mail gönderilemedi" });
    }
  }
);

export default router;