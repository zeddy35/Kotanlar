// updateDataWithGallery.js
import fs from 'fs';
import path from 'path';

const dataPath = './data/dataWithGallery.js'; // orijinal dosyan
const imagesRoot = './public/images';

// Eski verileri oku
const rawData = fs.readFileSync(dataPath, 'utf-8');

// dataWithGallery.js bir JS dosyası olduğu için eval gibi bir yol izlenir (güvenli değil ama işimizi görür)
const extractArray = rawData.match(/export default\s+(\[.*\]);/s);
const projectArray = eval(extractArray[1]); // tehlikeli ama tek seferlik

// Yeni arrayi oluştur
const updatedProjects = projectArray.map(project => {
  const slug = project.slug;
  const folder = path.join(imagesRoot, slug);
  const files = fs.existsSync(folder) ? fs.readdirSync(folder) : [];

  const cover = files.find(f => f.startsWith('coverImage'));
  const gallery = files
    .filter(f => f.startsWith(`${slug}_`))
    .sort((a, b) => a.localeCompare(b));

  return {
    ...project,
    coverImage: cover ? `/images/${slug}/${cover}` : '',
    galleryImages: gallery.map(g => `/images/${slug}/${g}`)
  };
});

// Yeni dosyayı oluştur
const output = `export default ${JSON.stringify(updatedProjects, null, 2)};`;

fs.writeFileSync('./data/data.js', output);
console.log("✅ Yeni data dosyası oluşturuldu: data.js");
