import fs from 'fs';
import path from 'path';

const baseDir = './public/images'; // Ana klasör

fs.readdirSync(baseDir).forEach(slug => {
  const folderPath = path.join(baseDir, slug);
  if (fs.lstatSync(folderPath).isDirectory()) {
    const files = fs.readdirSync(folderPath);
    files.forEach((file, index) => {
      const ext = path.extname(file);
      const newName = index === 0 ? 'coverImage' + ext : `${slug}_${index}` + ext;
      fs.renameSync(
        path.join(folderPath, file),
        path.join(folderPath, newName)
      );
    });
    console.log(`✅ ${slug} klasöründeki dosyalar yeniden adlandırıldı.`);
  }
});
