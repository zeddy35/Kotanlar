import fs from 'fs';
import path from 'path';
import data from '../data/dataWithGallery.js';

const missingImages = [];

data.forEach(project => {
  // Cover image kontrolü
  const coverPath = path.join('public', project.coverImage || project.image);
  if (!fs.existsSync(coverPath)) {
    missingImages.push({ type: 'coverImage', path: project.coverImage, project: project.slug });
  }

  // Gallery images kontrolü
  project.galleryImages.forEach(img => {
    const imgPath = path.join('public', img);
    if (!fs.existsSync(imgPath)) {
      missingImages.push({ type: 'galleryImage', path: img, project: project.slug });
    }
  });
});

if (missingImages.length === 0) {
  console.log('✅ Tüm görseller mevcut.');
} else {
  console.log('❌ Eksik görseller bulundu:');
  missingImages.forEach(m => {
    console.log(`[${m.type}] ${m.project}: ${m.path}`);
  });
}
console.log('Kontrol tamamlandı.');
