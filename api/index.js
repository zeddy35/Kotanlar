import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

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

// Data
const projects = [
{
  title: "Luxuria Residance",
  slug: "luxeria",
  image: "/images/luxeria/res04.jpg",
  summary: "Luxuria Residance projemize göstermiş olduğunuz yoğun ilgi için teşekkür ederiz. Satışlarımız tamamlanmıştır. Yeni projelerimizde sizlere hi",
  description: `
  <p><strong>Luxuria Residance</strong> projemize göstermiş olduğunuz yoğun ilgi için teşekkür ederiz. Satışlarımız <strong>tamamlanmıştır</strong>. Yeni projelerimizde sizlere hizmet vermekten mutluluk duyarız.</p>

  <h3 class="font-semibold mt-4">Dış Özellikler</h3>
  <ul class="list-disc ml-5">
    <li>Ses ve ısı yalıtımı, su deposu & hidrofor, açık otopark</li>
    <li>Silikon esaslı, TSE belgeli dış cephe boyası</li>
    <li>Merkezi uydu sistemi, bloklara özel posta kutuları</li>
    <li>Mermer bina girişi, granit kaplı asansör çevresi</li>
    <li>Yeşil alanlar ve çevre düzenlemesi</li>
    <li>Radye temel, asmolen döşeme, tam izolasyonlu çatı</li>
    <li>4 kişilik otomatik krom asansör, şifreli bina girişleri</li>
    <li>Geniş cam cephe, cam korkuluklu balkonlar</li>
    <li>Tüm site alanında güvenlik kameraları ve kayıt sistemi</li>
    <li>Açık fitness alanı, çocuk parkı, kamelya, duş & WC alanları</li>
  </ul>

  <h3 class="font-semibold mt-4">İç Özellikler</h3>
  <ul class="list-disc ml-5">
    <li>Alçı üzeri saten boya, kartonpiyer perde alanları</li>
    <li>Seramik zeminli antre, balkon ve teraslar</li>
    <li>90x90 temper cam duş kabinleri, Hilton lavabo ve bataryalar</li>
    <li>1. sınıf asma tavan, havlupan, termosifon tesisatı</li>
    <li>Laminat parke zeminli salon ve odalar</li>
    <li>Çelik dış kapı, yangın alarm sistemi</li>
    <li>Amerikan panel iç kapılar, granit mutfak tezgahı</li>
    <li>1,5 göz inox evye, davlumbaz, alt/üst dolaplar</li>
    <li>Görüntülü diafon, TV, internet, telefon alt yapısı</li>
    <li>PVC doğrama, çift cam, çift açılımlı pencere sistemleri</li>
    <li>Kalorifer tesisatı ve salon klima alt yapısı</li>
    <li>Sadece dublekslerde barbekü ve jakuzi</li>
    <li>Otomatik sensörlü ortak aydınlatma sistemleri</li>
  </ul>

  <h3 class="font-semibold mt-4">Konum</h3>
  <p>Luxuria Residance, Söke-Kuşadası anayoluna sadece 50 metre mesafede yer alır. Proje konumu itibarıyla dolmuş ve toplu taşıma araçlarının tümüne erişim sağlar. Sadece 5 dakikalık yürüyüşle hastane, otogar, AVM’ler, limanlar ve plajlara ulaşabilirsiniz.</p>

  <p><strong>Yakınlıklar:</strong></p>
  <ul class="list-disc ml-5">
    <li>İzmir Havalimanı: 80 km</li>
    <li>Efes Antik Kenti: 17 km – Virgin Mary: 18 km</li>
    <li>Selçuk: 20 km – Didim: 65 km – Bodrum: 95 km</li>
    <li>Tüm Kuşadası plajlarına ve turistik alanlara direkt ulaşım</li>
  </ul>

  <p class="mt-4"><strong>Luxuria Residance — Konfor, konum ve kaliteyi bir araya getiren eşsiz bir yaşam alanıydı.</strong></p>
  `,
  location: "https://www.google.com/maps/embed?pb=!4v1748035205425!6m8!1m7!1s3WHOk7uYWOuFw_JeQMBhLw!2m2!1d37.83723598357309!2d27.26066240787241!3f183.41!4f2.1400000000000006!5f0.7820865974627469"
  },
  {
    
  title: "Nizya",
  slug: "nizya",
  image: "/images/nizya/SP1.jpg",
  summary: "Nizya Projesi’ne göstermiş olduğunuz ilgi için teşekkür ederiz. Bu projemizin satışı tamamlanmıştır. Yeni projelerimizde siz değerli",
  description: `
  <p><strong>Nizya Projesi</strong>’ne göstermiş olduğunuz ilgi için teşekkür ederiz.</p>
  <p>Bu projemizin <strong>satışı tamamlanmıştır</strong>. Yeni projelerimizde siz değerli misafirlerimize hizmet vermekten büyük mutluluk duyarız.</p>
  <p><strong>Bizi tercih ettiğiniz için minnettarız.</strong></p>
  `,
  location: ""
    
  },
  {
      title: "Moonlight",
    slug: "moonlight",
    image: "/images/moonlight/vaz02.jpg",
    summary: "Moonlight Residence, Kotanlar İnşaat’ın modern mimarisiyle hayat bulan, tek bloktan oluşan butik bir konut projesidir. Satışı tamamlanan bu ",
    description: `
    <p><strong>Moonlight Residence</strong>, Kotanlar İnşaat’ın modern mimarisiyle hayat bulan, tek bloktan oluşan butik bir konut projesidir. Satışı tamamlanan bu projeye gösterdiğiniz yoğun ilgi için teşekkür ederiz. Yeni projelerimizde sizleri ağırlamaktan memnuniyet duyarız.</p>

    <h3 class="font-semibold mt-4">Proje Özellikleri</h3>
    <p>Moonlight Residence, site anlayışından uzaklaşıp size özel bir yaşam sunmayı hedefleyen prestijli bir projedir. Proje, Kuşadası’nın merkezi bölgelerinden birinde, sahile ve anayola yürüme mesafesinde konumlanmıştır.</p>

    <h4 class="mt-2 font-medium">Dış Özellikler</h4>
    <ul class="list-disc ml-5">
      <li>Isı ve ses yalıtımı, su deposu & hidrofor</li>
      <li>Açık otopark, güvenlik kameraları, şifreli girişler</li>
      <li>Dış cephede TSE belgeli silikon esaslı boya</li>
      <li>Çocuk oyun alanı, yüzme havuzu, fitness ve sauna</li>
      <li>1. sınıf alüminyum ve temperli cam balkonlar</li>
      <li>4 kişilik krom asansör, mermer ve granit detaylı bina içi</li>
      <li>Şıngıl çatı kaplama, çevre duvarları ve peyzaj</li>
    </ul>

    <h4 class="mt-4 font-medium">İç Özellikler</h4>
    <ul class="list-disc ml-5">
      <li>Alçı üzeri saten boya, laminat parke, seramik zemin</li>
      <li>90x90 temper duş kabinli banyolar, Hilton lavabo, havlupan</li>
      <li>Yangın dedektörü, çelik giriş kapısı, Amerikan iç kapılar</li>
      <li>Alt/üst mutfak dolapları, inox evye, jilet aspiratör</li>
      <li>Görüntülü diafon, TV ve telefon altyapısı</li>
      <li>Çift camlı PVC doğramalar, sineklikli pencereler</li>
      <li>Merkezi klima ve kalorifer tesisatı</li>
      <li>Dublexlerde barbekü-şömine</li>
    </ul>

    <h4 class="mt-4 font-medium">Konum Avantajları</h4>
    <p>Proje, Söke–Kuşadası anayoluna sadece 50 metre mesafededir. Dolmuşla 5 dakikada ulaşabileceğiniz noktalar arasında: hastane, otogar, AVM’ler, plajlar, şehir merkezi ve turistik alanlar yer alır. İzmir Havalimanı 80 km, Ephesus 17 km mesafededir.</p>

    <p class="mt-4"><strong>Moonlight Residence — merkezi konum, maksimum konfor ve benzersiz manzara ile ayrıcalıklı bir yaşam sundu.</strong></p>
    `,
    location: "https://www.google.com/maps/embed?pb=!4v1748035318297!6m8!1m7!1sc_yN3lEdUf56elPNaPauCg!2m2!1d37.83709548363585!2d27.2604857808174!3f233.60036905853332!4f-11.459832257311803!5f0.4791887318228709"
  },
  {
    title: "Ada Siesta",
    slug: "siesta",
    image: "/images/siesta/res1.jpg",
    summary: "Kotanlar Ada Siesta, Kuşadası’nın batısında, AVM’lere, lüks otellere ve şehir merkezine yakınlığıyla öne çıkan Değirmendere Mahallesi, Güzel",
   description: `
    <p><strong>Kotanlar Ada Siesta</strong>, Kuşadası’nın batısında, AVM’lere, lüks otellere ve şehir merkezine yakınlığıyla öne çıkan Değirmendere Mahallesi, Güzellik İçi mevkiinde konumlanmıştır.</p>
    
    <p>Eğimli bir arazi üzerinde yükselen proje, <strong>kesintisiz deniz manzarasına</strong> sahiptir. Bodrum–Kuşadası–İzmir karayoluna olan yakınlığı sayesinde ulaşım oldukça kolaydır. Özel araç olmadan da şehir içi servislerle plajlara, alışveriş merkezlerine, hastaneye ve okullara rahatlıkla ulaşabilirsiniz.</p>

    <p>Proje 5 bloktan oluşmakta olup, tüm daireler deniz manzarasına sahiptir. Toplam 66 daire ve 4 ticari üniteden oluşan projede; 2+1, 3+1 açık ve kapalı mutfak seçenekleri, penthouse daireler sunulmaktadır. Daireler 107 m² ile 200 m² arasında değişmektedir.</p>

    <p>“<em>Deniz manzarasız yaşam düşünemem</em>” diyenler için tasarlanan Ada Siesta, modern mimarisi ve konumu ile yatırımınıza değer katar.</p>

    <p><strong>Sosyal olanaklar:</strong> Açık ve kapalı yüzme havuzu, bay/bayan sauna, fitness salonu, çocuk oyun parkı, peyzajlı alanlar ve kamelyalar yer almaktadır.</p>

    <p><strong>Proje tamamlanmıştır ve teslim edilmeye hazırdır.</strong></p>
    `,
    location: "https://www.google.com/maps/embed?pb=!4v1748035411363!6m8!1m7!1sm2MOLiWqpuRf9Dt1DqNWRQ!2m2!1d37.83225884500645!2d27.25860853691073!3f62.560519676041174!4f20.453092063832884!5f0.7820865974627469"
  },
{
  title: "Manzara Villaları",
  slug: "Manzara",
  image: "/images/Manzara/manzara.jpeg",
  summary: "Manzara Villaları, Kuşadası Davutlar yolu kavşağında, doğa ve deniz manzarasına hâkim 8000 m² alan üzerine inşa edilen prestijli bir villa p",
  description: `
  <p><strong>Manzara Villaları</strong>, Kuşadası Davutlar yolu kavşağında, doğa ve deniz manzarasına hâkim 8000 m² alan üzerine inşa edilen prestijli bir villa projesidir. Kotanlar İnşaat güvencesiyle geliştirilen bu proje, 4+1 dubleks konseptiyle ayrıcalıklı bir yaşam sunar.</p>

  <h3 class="font-semibold mt-4">Dış Özellikler</h3>
  <ul class="list-disc ml-5">
    <li>Deprem yönetmeliğine uygun Radye Temel yapı ve yapı denetim kontrolü</li>
    <li>Mermer ve granit dış cephe kaplama, silikon esaslı Polisan Exelans boya</li>
    <li>PVC doğrama, çift açılım ısıcam, stor ve sürgülü sineklik sistemleri</li>
    <li>Görüntülü diafon, özel uydu sistemi, alarm ve kamera güvenlik ağı</li>
    <li>70 tonluk su deposu & hidrofor sistemi</li>
    <li>200 m² açık yüzme havuzu, çocuk havuzu, güneşlenme terası</li>
    <li>Teraslarda kapalı kiler, merdiven altında gömme dolaplı depo</li>
    <li>Her villa için ön/arka bahçe kullanımı, bordür hizasında yan sınırlar</li>
  </ul>

  <h3 class="font-semibold mt-4">İç Özellikler</h3>
  <ul class="list-disc ml-5">
    <li>Alçı üzeri saten boya, seramik veya parke zeminler</li>
    <li>Hilton banyo tasarımları, granit tezgâh, spot aydınlatmalı aynalar</li>
    <li>1. sınıf bataryalar, duş kabini & jakuzili banyolar</li>
    <li>Çamaşır odasında özel tesisat</li>
    <li>Amerikan panel iç kapılar, çift kilitli çelik dış kapı</li>
    <li>Alt/üst mutfak dolapları, granit tezgâh, çelik evye, döner başlı batarya</li>
    <li>Kalorifer tesisatı ve her odada klima</li>
  </ul>

  <h3 class="font-semibold mt-4">Sosyal Alanlar</h3>
  <p>Projede; fitness salonu, sauna, masaj alanı, çocuk oyun parkı ve yürüyüş yolları gibi sosyal yaşam alanları mevcuttur. Site içi ve dış çevre güvenliği hareketli kameralar ve şifreli geçiş sistemleri ile sağlanmaktadır.</p>

  <h3 class="font-semibold mt-4">Konum</h3>
  <p>Manzara Villaları; Long Beach, Sahil Siteleri, alışveriş merkezleri ve Kuşadası şehir merkezine yalnızca 5 dakika, İzmir Adnan Menderes Havalimanı’na ise 85 km mesafededir.</p>

  <p class="mt-4"><strong>Modern mimari, ferah yaşam alanları ve doğal güzelliklerle çevrili özel konumuyla Manzara Villaları, yüksek yaşam standartlarını arayanlar için tasarlandı.</strong></p>
  `,
  location: "https://www.google.com/maps/embed?pb=!4v1748035453158!6m8!1m7!1scCRBWlK2EH8IkcO1W0waDA!2m2!1d37.79912583266494!2d27.29418635067637!3f327.6!4f3.239999999999995!5f0.7820865974627469"
  },
  {
    title: "Prime Life",
    slug: "Prime Life",
    image: "/images/Prime Life/prime.jpeg",
    description: "Mükemmel manzarası ile sizlerle.",
    summary: "Mükemmel manzarası ile sizlerle.",
    location: "https://www.google.com/maps/embed?pb=!3m2!1str!2str!4v1748035570775!5m2!1str!2str!6m8!1m7!1sm2MOLiWqpuRf9Dt1DqNWRQ!2m2!1d37.83225884500645!2d27.25860853691073!3f61.806086342172705!4f9.731508869898889!5f0.7820865974627469"
  }
];


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
app.get('/buy-en', (req, res) => {
  res.render('buy-en');
});

app.listen(3000, () => {});