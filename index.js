// ✅ index.js (ana sunucu dosyan)
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import session from 'express-session';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import adminRoutes from './routes/admin.js';
import mainRoutes from './routes/main.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB bağlantısı başarılı'))
  .catch(err => console.error('❌ MongoDB bağlantı hatası:', err));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'çok-gizli-bir-string',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // HTTPS sunucuda true yapabilirsin
}));

// Güvenlik + rate limit (form)
app.use(helmet());
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use('/submit', limiter);

// Routes
app.use('/', mainRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`));
