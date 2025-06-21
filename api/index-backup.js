import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import mongoose from "mongoose";
import dotenv from "dotenv";
import adminRoutes from './routes/admin.js';

dotenv.config();

// MongoDB Bağlantısı
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB bağlantısı başarılı'))
  .catch(err => console.error('❌ MongoDB bağlantı hatası:', err));


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// Static Files
app.use(express.static(path.join(__dirname, '../public')))

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Projeleri Listeleme
import { Project } from './models/Project.js';
app.get('/projects', async (req, res) => {
  const projects = await Project.find();
  res.render('projects', { projects });
});

app.get('/projects/:slug', async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project) return res.status(404).send('Proje bulunamadı');
  res.render('project_detail', { project });
});



// Data
const projects = [
  {
    "title": "Luxuria Rezidansları",
    "title_eng": "Luxuria Residance",
    "slug": "luxeria",
    "image": "/images/luxeria/res04.jpg",
    "description": "<p><strong>Luxuria Residance</strong> projemize göstermiş olduğunuz yoğun ilgi için teşekkür ederiz. Satışlarımız <strong>tamamlanmıştır</strong>. Yeni projelerimizde sizlere hizmet vermekten mutluluk duyarız.</p>\n\n<h3 class=\"font-semibold mt-4\">Dış Özellikler</h3>\n<ul class=\"list-disc ml-5\">\n  <li>Ses ve ısı yalıtımı, su deposu & hidrofor, açık otopark</li>\n  <li>Silikon esaslı, TSE belgeli dış cephe boyası</li>\n  <li>Merkezi uydu sistemi, bloklara özel posta kutuları</li>\n  <li>Mermer bina girişi, granit kaplı asansör çevresi</li>\n  <li>Yeşil alanlar ve çevre düzenlemesi</li>\n  <li>Radye temel, asmolen döşeme, tam izolasyonlu çatı</li>\n  <li>4 kişilik otomatik krom asansör, şifreli bina girişleri</li>\n  <li>Geniş cam cephe, cam korkuluklu balkonlar</li>\n  <li>Tüm site alanında güvenlik kameraları ve kayıt sistemi</li>\n  <li>Açık fitness alanı, çocuk parkı, kamelya, duş & WC alanları</li>\n</ul>\n\n<h3 class=\"font-semibold mt-4\">İç Özellikler</h3>\n<ul class=\"list-disc ml-5\">\n  <li>Alçı üzeri saten boya, kartonpiyer perde alanları</li>\n  <li>Seramik zeminli antre, balkon ve teraslar</li>\n  <li>90x90 temper cam duş kabinleri, Hilton lavabo ve bataryalar</li>\n  <li>1. sınıf asma tavan, havlupan, termosifon tesisatı</li>\n  <li>Laminat parke zeminli salon ve odalar</li>\n  <li>Çelik dış kapı, yangın alarm sistemi</li>\n  <li>Amerikan panel iç kapılar, granit mutfak tezgahı</li>\n  <li>1,5 göz inox evye, davlumbaz, alt/üst dolaplar</li>\n  <li>Görüntülü diafon, TV, internet, telefon alt yapısı</li>\n  <li>PVC doğrama, çift cam, çift açılımlı pencere sistemleri</li>\n  <li>Kalorifer tesisatı ve salon klima alt yapısı</li>\n  <li>Sadece dublekslerde barbekü ve jakuzi</li>\n  <li>Otomatik sensörlü ortak aydınlatma sistemleri</li>\n</ul>\n\n<h3 class=\"font-semibold mt-4\">Konum</h3>\n<p>Luxuria Residance, Söke-Kuşadası anayoluna sadece 50 metre mesafede yer alır. Proje konumu itibarıyla dolmuş ve toplu taşıma araçlarının tümüne erişim sağlar. Sadece 5 dakikalık yürüyüşle hastane, otogar, AVM’ler, limanlar ve plajlara ulaşabilirsiniz.</p>\n\n<p><strong>Yakınlıklar:</strong></p>\n<ul class=\"list-disc ml-5\">\n  <li>İzmir Havalimanı: 80 km</li>\n  <li>Efes Antik Kenti: 17 km – Virgin Mary: 18 km</li>\n  <li>Selçuk: 20 km – Didim: 65 km – Bodrum: 95 km</li>\n  <li>Tüm Kuşadası plajlarına ve turistik alanlara direkt ulaşım</li>\n</ul>\n\n<p class=\"mt-4\"><strong>Luxuria Residance — Konfor, konum ve kaliteyi bir araya getiren eşsiz bir yaşam alanıydı.</strong></p>",
    "description-eng": "<p>Thank you for your strong interest in our <strong>Luxuria Residance</strong> project. Sales have been <strong>completed</strong>. We would be happy to serve you in our new projects.</p>\n\n<h3 class=\"font-semibold mt-4\">Exterior Features</h3>\n<ul class=\"list-disc ml-5\">\n  <li>Sound and heat insulation, water tank & hydrophone, open parking</li>\n  <li>Silicone-based, TSE-certified exterior paint</li>\n  <li>Central satellite system, block-specific mailboxes</li>\n  <li>Marble building entrance, granite-covered elevator surroundings</li>\n  <li>Green areas and landscaping</li>\n  <li>Raft foundation, hollow-core slab flooring, fully insulated roof</li>\n  <li>4-person automatic chrome elevator, password-protected building entrances</li>\n  <li>Wide glass facade, glass-railed balconies</li>\n  <li>Security cameras and recording system throughout the entire site</li>\n  <li>Open fitness area, children's park, gazebo, shower & WC areas</li>\n</ul>\n\n<h3 class=\"font-semibold mt-4\">Interior Features</h3>\n<ul class=\"list-disc ml-5\">\n  <li>Satin paint on plaster, cornice curtain areas</li>\n  <li>Ceramic-floored entrance, balcony, and terraces</li>\n  <li>90x90 tempered glass shower cabins, Hilton sink and faucets</li>\n  <li>1st-class suspended ceiling, towel rack, water heater plumbing</li>\n  <li>Laminate parquet flooring in living rooms and bedrooms</li>\n  <li>Steel exterior door, fire alarm system</li>\n  <li>American panel interior doors, granite kitchen countertop</li>\n  <li>1.5-compartment stainless steel sink, hood, upper/lower cabinets</li>\n  <li>Video intercom, TV, internet, telephone infrastructure</li>\n  <li>PVC frames, double-glazed, dual-opening window systems</li>\n  <li>Heating system and living room air conditioning infrastructure</li>\n  <li>Barbecue and Jacuzzi only in duplexes</li>\n  <li>Automatic sensor-controlled common lighting systems</li>\n</ul>\n\n<h3 class=\"font-semibold mt-4\">Location</h3>\n<p>Luxuria Residance is located just 50 meters from the Söke-Kuşadası main road. Due to its location, it provides access to all minibuses and public transportation. Within just a 5-minute walk, you can reach hospitals, bus stations, shopping malls, ports, and beaches.</p>\n\n<p><strong>Proximities:</strong></p>\n<ul class=\"list-disc ml-5\">\n  <li>Izmir Airport: 80 km</li>\n  <li>Ephesus Ancient City: 17 km – Virgin Mary: 18 km</li>\n  <li>Selçuk: 20 km – Didim: 65 km – Bodrum: 95 km</li>\n  <li>Direct access to all Kuşadası beaches and tourist areas</li>\n</ul>\n\n<p class=\"mt-4\"><strong>Luxuria Residance — A unique living space that combined comfort, location, and quality.</strong></p>",
    "location": "https://www.google.com/maps/embed?pb=!4v1748035205425!6m8!1m7!1s3WHOk7uYWOuFw_JeQMBhLw!2m2!1d37.83723598357309!2d27.26066240787241!3f183.41!4f2.1400000000000006!5f0.7820865974627469"
  },
  {
    "title": "Nizya",
    "title_eng": "Nizya",
    "slug": "nizya",
    "image": "/images/nizya/SP1.jpg",
    "description": "<p><strong>Nizya Projesi</strong>’ne göstermiş olduğunuz ilgi için teşekkür ederiz.</p>\n<p>Bu projemizin <strong>satışı tamamlanmıştır</strong>. Yeni projelerimizde siz değerli misafirlerimize hizmet vermekten büyük mutluluk duyarız.</p>\n<p><strong>Bizi tercih ettiğiniz için minnettarız.</strong></p>",
    "description-eng": "<p>Thank you for your interest in the <strong>Nizya Project</strong>.</p>\n<p>Sales for this project have been <strong>completed</strong>. We are delighted to serve you in our new projects.</p>\n<p><strong>We are grateful for your preference.</strong></p>",
    "location": ""
  },
  {
    "title": "Moonlight",
    "title_eng": "Moonlight",
    "slug": "moonlight",
    "image": "/images/moonlight/vaz02.jpg",
    "description": "<p><strong>Moonlight Residence</strong>, Kotanlar İnşaat’ın modern mimarisiyle hayat bulan, tek bloktan oluşan butik bir konut projesidir. Satışı tamamlanan bu projeye gösterdiğiniz yoğun ilgi için teşekkür ederiz. Yeni projelerimizde sizleri ağırlamaktan memnuniyet duyarız.</p>\n\n<h3 class=\"font-semibold mt-4\">Proje Özellikleri</h3>\n<p>Moonlight Residence, site anlayışından uzaklaşıp size özel bir yaşam sunmayı hedefleyen prestijli bir projedir. Proje, Kuşadası’nın merkezi bölgelerinden birinde, sahile ve anayola yürüme mesafesinde konumlanmıştır.</p>\n\n<h4 class=\"mt-2 font-medium\">Dış Özellikler</h4>\n<ul class=\"list-disc ml-5\">\n  <li>Isı ve ses yalıtımı, su deposu & hidrofor</li>\n  <li>Açık otopark, güvenlik kameraları, şifreli girişler</li>\n  <li>Dış cephede TSE belgeli silikon esaslı boya</li>\n  <li>Çocuk oyun alanı, yüzme havuzu, fitness ve sauna</li>\n  <li>1. sınıf alüminyum ve temperli cam balkonlar</li>\n  <li>4 kişilik krom asansör, mermer ve granit detaylı bina içi</li>\n  <li>Şıngıl çatı kaplama, çevre duvarları ve peyzaj</li>\n</ul>\n\n<h4 class=\"mt-4 font-medium\">İç Özellikler</h4>\n<ul class=\"list-disc ml-5\">\n  <li>Alçı üzeri saten boya, laminat parke, seramik zemin</li>\n  <li>90x90 temper duş kabinli banyolar, Hilton lavabo, havlupan</li>\n  <li>Yangın dedektörü, çelik giriş kapısı, Amerikan iç kapılar</li>\n  <li>Alt/üst mutfak dolapları, inox evye, jilet aspiratör</li>\n  <li>Görüntülü diafon, TV ve telefon altyapısı</li>\n  <li>Çift camlı PVC doğramalar, sineklikli pencereler</li>\n  <li>Merkezi klima ve kalorifer tesisatı</li>\n  <li>Dublexlerde barbekü-şömine</li>\n</ul>\n\n<h4 class=\"mt-4 font-medium\">Konum Avantajları</h4>\n<p>Proje, Söke–Kuşadası anayoluna sadece 50 metre mesafededir. Dolmuşla 5 dakikada ulaşabileceğiniz noktalar arasında: hastane, otogar, AVM’ler, plajlar, şehir merkezi ve turistik alanlar yer alır. İzmir Havalimanı 80 km, Ephesus 17 km mesafededir.</p>\n\n<p class=\"mt-4\"><strong>Moonlight Residence — offered a privileged life with its central location, maximum comfort, and unique views.</strong></p>",
    "description-eng": "<p><strong>Moonlight Residence</strong> is a boutique residential project brought to life by Kotanlar İnşaat’s modern architecture, consisting of a single block. Thank you for your strong interest in this sold-out project. We are pleased to host you in our new projects.</p>\n\n<h3 class=\"font-semibold mt-4\">Project Features</h3>\n<p>Moonlight Residence is a prestigious project that moves away from the concept of a housing complex and aims to offer a private lifestyle. The project is located in one of Kuşadası’s central areas, within walking distance to the beach and main road.</p>\n\n<h4 class=\"mt-2 font-medium\">Exterior Features</h4>\n<ul class=\"list-disc ml-5\">\n  <li>Heat and sound insulation, water tank & hydrophone</li>\n  <li>Open parking, security cameras, password-protected entrances</li>\n  <li>TSE-certified silicone-based exterior paint</li>\n  <li>Children's playground, swimming pool, fitness, and sauna</li>\n  <li>1st-class aluminum and tempered glass balconies</li>\n  <li>4-person chrome elevator, marble and granite interior details</li>\n  <li>Shingle roof covering, perimeter walls, and landscaping</li>\n</ul>\n\n<h4 class=\"mt-4 font-medium\">Interior Features</h4>\n<ul class=\"list-disc ml-5\">\n  <li>Satin paint on plaster, laminate flooring, ceramic floors</li>\n  <li>90x90 tempered glass shower cabins, Hilton sink, towel rack</li>\n  <li>Fire detector, steel entrance door, American interior doors</li>\n  <li>Upper/lower kitchen cabinets, stainless steel sink, razor hood</li>\n  <li>Video intercom, TV and telephone infrastructure</li>\n  <li>Double-glazed PVC frames, screened windows</li>\n  <li>Central air conditioning and heating system</li>\n  <li>Barbecue-fireplace in duplexes</li>\n</ul>\n\n<h4 class=\"mt-4 font-medium\">Location Advantages</h4>\n<p>The project is just 50 meters from the Söke-Kuşadası main road. Within a 5-minute ride by minibus, you can reach: hospitals, bus stations, shopping malls, beaches, the city center, and tourist areas. Izmir Airport is 80 km away, and Ephesus is 17 km away.</p>\n\n<p class=\"mt-4\"><strong>Moonlight Residence — offered a privileged life with its central location, maximum comfort, and unique views.</strong></p>",
    "location": "https://www.google.com/maps/embed?pb=!4v1748035318297!6m8!1m7!1sc_yN3lEdUf56elPNaPauCg!2m2!1d37.83709548363585!2d27.2604857808174!3f233.60036905853332!4f-11.459832257311803!5f0.4791887318228709"
  },
  {
    "title": "Ada Siesta",
    "title_eng": "Ada Siesta",
    "slug": "siesta",
    "image": "/images/siesta/res1.jpg",
    "description": "<p><strong>Kotanlar Ada Siesta</strong>, Kuşadası’nın batısında, AVM’lere, lüks otellere ve şehir merkezine yakınlığıyla öne çıkan Değirmendere Mahallesi, Güzellik İçi mevkiinde konumlanmıştır.</p>\n    \n<p>Eğimli bir arazi üzerinde yükselen proje, <strong>kesintisiz deniz manzarasına</strong> sahiptir. Bodrum–Kuşadası–İzmir karayoluna olan yakınlığı sayesinde ulaşım oldukça kolaydır. Özel araç olmadan da şehir içi servislerle plajlara, alışveriş merkezlerine, hastaneye ve okullara rahatlıkla ulaşabilirsiniz.</p>\n\n<p>Proje 5 bloktan oluşmakta olup, tüm daireler deniz manzarasına sahiptir. Toplam 66 daire ve 4 ticari üniteden oluşan projede; 2+1, 3+1 açık ve kapalı mutfak seçenekleri, penthouse daireler sunulmaktadır. Daireler 107 m² ile 200 m² arasında değişmektedir.</p>\n\n<p>“<em>Deniz manzarasız yaşam düşünemem</em>” diyenler için tasarlanan Ada Siesta, modern mimarisi ve konumu ile yatırımınıza değer katar.</p>\n\n<p><strong>Sosyal olanaklar:</strong> Açık ve kapalı yüzme havuzu, bay/bayan sauna, fitness salonu, çocuk oyun parkı, peyzajlı alanlar ve kamelyalar yer almaktadır.</p>\n\n<p><strong>Proje tamamlanmıştır ve teslim edilmeye hazırdır.</strong></p>",
    "description-eng": "<p><strong>Kotanlar Ada Siesta</strong> is located in Değirmendere Neighborhood, Güzellik İçi area, on the west side of Kuşadası, notable for its proximity to shopping malls, luxury hotels, and the city center.</p>\n    \n<p>Built on a sloping terrain, the project boasts <strong>uninterrupted sea views</strong>. Thanks to its proximity to the Bodrum-Kuşadası-İzmir highway, transportation is very convenient. Even without a private vehicle, you can easily reach beaches, shopping centers, hospitals, and schools via city shuttles.</p>\n\n<p>The project consists of 5 blocks, with all apartments offering sea views. It includes a total of 66 apartments and 4 commercial units, featuring 2+1 and 3+1 open/closed kitchen options, as well as penthouses. Apartments range from 107 m² to 200 m².</p>\n\n<p>Designed for those who say, <em>“I can’t imagine life without a sea view,”</em> Ada Siesta adds value to your investment with its modern architecture and location.</p>\n\n<p><strong>Amenities:</strong> Open and indoor swimming pools, men’s/women’s saunas, fitness center, children’s playground, landscaped areas, and gazebos.</p>\n\n<p><strong>The project is completed and ready for delivery.</strong></p>",
    "location": "https://www.google.com/maps/embed?pb=!4v1748035411363!6m8!1m7!1sm2MOLiWqpuRf9Dt1DqNWRQ!2m2!1d37.83225884500645!2d27.25860853691073!3f62.560519676041174!4f20.453092063832884!5f0.7820865974627469"
  },
  {
    "title": "Manzara Villaları",
    "title_eng": "Manzara Villas",
    "slug": "Manzara",
    "image": "/images/Manzara/manzara1.jpeg",
    "description": "<p><strong>Manzara Villaları</strong>, Kuşadası Davutlar yolu kavşağında, doğa ve deniz manzarasına hâkim 8000 m² alan üzerine inşa edilen prestijli bir villa projesidir. Kotanlar İnşaat güvencesiyle geliştirilen bu proje, 4+1 dubleks konseptiyle ayrıcalıklı bir yaşam sunar.</p>\n\n<h3 class=\"font-semibold mt-4\">Dış Özellikler</h3>\n<ul class=\"list-disc ml-5\">\n  <li>Deprem yönetmeliğine uygun Radye Temel yapı ve yapı denetim kontrolü</li>\n  <li>Mermer ve granit dış cephe kaplama, silikon esaslı Polisan Exelans boya</li>\n  <li>PVC doğrama, çift açılım ısıcam, stor ve sürgülü sineklik sistemleri</li>\n  <li>Görüntülü diafon, özel uydu sistemi, alarm ve kamera güvenlik ağı</li>\n  <li>70 tonluk su deposu & hidrofor sistemi</li>\n  <li>200 m² açık yüzme havuzu, çocuk havuzu, güneşlenme terası</li>\n  <li>Teraslarda kapalı kiler, merdiven altında gömme dolaplı depo</li>\n  <li>Her villa için ön/arka bahçe kullanımı, bordür hizasında yan sınırlar</li>\n</ul>\n\n<h3 class=\"font-semibold mt-4\">İç Özellikler</h3>\n<ul class=\"list-disc ml-5\">\n  <li>Alçı üzeri saten boya, seramik veya parke zeminler</li>\n  <li>Hilton banyo tasarımları, granit tezgâh, spot aydınlatmalı aynalar</li>\n  <li>1. sınıf bataryalar, duş kabini & jakuzili banyolar</li>\n  <li>Çamaşır odasında özel tesisat</li>\n  <li>Amerikan panel iç kapılar, çift kilitli çelik dış kapı</li>\n  <li>Alt/üst mutfak dolapları, granit tezgâh, çelik evye, döner başlı batarya</li>\n  <li>Kalorifer tesisatı ve her odada klima</li>\n</ul>\n\n<h3 class=\"font-semibold mt-4\">Sosyal Alanlar</h3>\n<p>Projede; fitness salonu, sauna, masaj alanı, çocuk oyun parkı ve yürüyüş yolları gibi sosyal yaşam alanları mevcuttur. Site içi ve dış çevre güvenliği hareketli kameralar ve şifreli geçiş sistemleri ile sağlanmaktadır.</p>\n\n<h3 class=\"font-semibold mt-4\">Konum</h3>\n<p>Manzara Villaları; Long Beach, Sahil Siteleri, alışveriş merkezleri ve Kuşadası şehir merkezine yalnızca 5 dakika, İzmir Adnan Menderes Havalimanı’na ise 85 km mesafededir.</p>\n\n<p class=\"mt-4\"><strong>Modern mimari, ferah yaşam alanları ve doğal güzelliklerle çevrili özel konumuyla Manzara Villaları, yüksek yaşam standartlarını arayanlar için tasarlandı.</strong></p>",
    "description-eng": "<p><strong>Manzara Villaları</strong> is a prestigious villa project built on an 8,000 m² area overlooking nature and sea views at the Kuşadası-Davutlar road junction. Developed under Kotanlar İnşaat’s guarantee, this project offers a privileged lifestyle with a 4+1 duplex concept.</p>\n\n<h3 class=\"font-semibold mt-4\">Exterior Features</h3>\n<ul class=\"list-disc ml-5\">\n  <li>Earthquake-compliant raft foundation and construction audit control</li>\n  <li>Marble and granite exterior cladding, silicone-based Polisan Exelans paint</li>\n  <li>PVC frames, double-opening thermal glass, roller and sliding mosquito screens</li>\n  <li>Video intercom, private satellite system, alarm and camera security network</li>\n  <li>70-ton water tank & hydrophone system</li>\n  <li>200 m² open swimming pool, children’s pool, sunbathing terrace</li>\n  <li>Closed pantry on terraces, built-in storage under stairs</li>\n  <li>Front/back garden usage for each villa, side boundaries at curb level</li>\n</ul>\n\n<h3 class=\"font-semibold mt-4\">Interior Features</h3>\n<ul class=\"list-disc ml-5\">\n  <li>Satin paint on plaster, ceramic or parquet floors</li>\n  <li>Hilton bathroom designs, granite countertops, mirror spot lighting</li>\n  <li>1st-class faucets, shower cabins & Jacuzzi-equipped bathrooms</li>\n  <li>Special plumbing in laundry room</li>\n  <li>American panel interior doors, double-locked steel exterior door</li>\n  <li>Upper/lower kitchen cabinets, granite countertop, steel sink, swivel faucet</li>\n  <li>Heating system and air conditioning in every room</li>\n</ul>\n\n<h3 class=\"font-semibold mt-4\">Social Areas</h3>\n<p>The project includes social living spaces such as a fitness center, sauna, massage area, children’s playground, and walking paths. On-site and perimeter security is ensured via motion-sensor cameras and password-protected access systems.</p>\n\n<h3 class=\"font-semibold mt-4\">Location</h3>\n<p>Manzara Villaları is just 5 minutes from Long Beach, coastal sites, shopping malls, and Kuşadası city center, and 85 km from Izmir Adnan Menderes Airport.</p>\n\n<p class=\"mt-4\"><strong>With its modern architecture, spacious living areas, and unique location surrounded by natural beauty, Manzara Villaları was designed for those seeking high living standards.</strong></p>",
    "location": "https://www.google.com/maps/embed?pb=!4v1748035453158!6m8!1m7!1scCRBWlK2EH8IkcO1W0waDA!2m2!1d37.79912583266494!2d27.29418635067637!3f327.6!4f3.239999999999995!5f0.7820865974627469"
  },
  {
    "title": "Prime Life",
    "title_eng": "Prime Life",
    "slug": "Prime Life",
    "image": "/images/Prime Life/prime.jpeg",
    "description": "Mükemmel manzarası ile sizlerle.",
    "description-eng": "With its perfect view, it’s now with you.",
    "location": "https://www.google.com/maps/embed?pb=!3m2!1str!2str!4v1748035570775!5m2!1str!2str!6m8!1m7!1sm2MOLiWqpuRf9Dt1DqNWRQ!2m2!1d37.83225884500645!2d27.25860853691073!3f61.806086342172705!4f9.731508869898889!5f0.7820865974627469"
  }
]


// TR Routes
app.get('/', (req, res) => res.render('index', { projects }));
app.get('/buy', (req, res) => res.render('buy'));
app.get('/projects', (req, res) => res.render('projects', { projects }));
app.get('/projects/:slug', (req, res) => {
  const project = projects.find(p => p.slug === req.params.slug);
  if (!project) return res.status(404).send('Proje bulunamadı');

  const folderName = project.slug; // Slug kullanmak boşluk karakteri gibi sorunları engeller
  const imageDir = path.join(__dirname, '../public/images', folderName);

  let galleryImages = [];
  try {
    galleryImages = fs.readdirSync(imageDir)
      .filter(file => /\.(jpe?g|png|webp|gif)$/i.test(file))
      .map(file => `/images/${folderName}/${file}`);
  } catch (err) {
    console.error("Galeri okunamadı:", err.message);
  }

  res.render('project-detail', { project: { ...project, gallery: galleryImages }, projects });
});

// ENGLISH ROUTES
app.get('/en', (req, res) => res.render('index-en', { projects }));
app.get('/buy-en', (req, res) => {res.render('buy-en');});
// English Project Routes
app.get('/projects-en', (req, res) => res.render('projects-en', { 
  projects,
  lang: 'en' 
}));

app.get('/projects-en/:slug', (req, res) => {
  const project = projects.find(p => p.slug === req.params.slug);
  if (!project) return res.status(404).render('404-en', { message: 'Project not found' });

  try {
    const folderName = project.slug;
    const imageDir = path.join(__dirname, '../public/images', folderName);
    
    let galleryImages = [];
    if (fs.existsSync(imageDir)) {
      galleryImages = fs.readdirSync(imageDir)
        .filter(file => /\.(jpe?g|png|webp|gif)$/i.test(file))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map(file => `/images/${folderName}/${file}`);
    }

    res.render('project-detail-en', { 
      project: { 
        ...project, 
        gallery: galleryImages 
      },
      projects,
      lang: 'en'
    });
  } catch (err) {
    console.error("Error loading project:", err);
    res.status(500).render('500-en', { error: err });
  }
});



app.listen(3000, () => {});