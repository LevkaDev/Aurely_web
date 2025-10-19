# Руководство по развертыванию Aurely Website

## 📦 Подготовка к развертыванию

### 1. Проверка перед публикацией

- [ ] Все ссылки работают корректно
- [ ] Изображения загружаются (или заменены плейсхолдерами)
- [ ] Мобильная версия работает корректно
- [ ] FAQ аккордеон открывается/закрывается
- [ ] Интерактивная демонстрация парсера работает
- [ ] Все анимации плавные
- [ ] Нет ошибок в консоли браузера

### 2. Оптимизация (опционально)

#### Минификация CSS
```bash
# Установите cssnano
npm install -g cssnano-cli

# Минифицируйте CSS
cssnano css/main.css css/main.min.css
cssnano css/glassmorphism.css css/glassmorphism.min.css
cssnano css/animations.css css/animations.min.css
cssnano css/responsive.css css/responsive.min.css
```

#### Минификация JavaScript
```bash
# Установите terser
npm install -g terser

# Минифицируйте JS
terser js/main.js -o js/main.min.js -c -m
terser js/parser-demo.js -o js/parser-demo.min.js -c -m
terser js/animations.js -o js/animations.min.js -c -m
```

#### Оптимизация изображений
```bash
# Конвертируйте в WebP
cwebp images/hero/main-window.png -o images/hero/main-window.webp -q 80
```

## 🚀 Варианты развертывания

### Вариант 1: Netlify (Рекомендуется)

**Преимущества:**
- Бесплатный SSL
- Автоматический CDN
- Простое развертывание
- Continuous deployment

**Шаги:**

1. **Через веб-интерфейс (Drag & Drop)**
   - Перейдите на https://app.netlify.com/drop
   - Перетащите папку `website`
   - Готово!

2. **Через Git (автоматическое развертывание)**
   ```bash
   # Создайте репозиторий
   git init
   git add .
   git commit -m "Initial commit"
   
   # Подключите к GitHub
   git remote add origin https://github.com/yourusername/aurely-website.git
   git push -u origin main
   
   # На Netlify:
   # - New site from Git
   # - Выберите ваш репозиторий
   # - Build command: (оставьте пустым)
   # - Publish directory: .
   ```

3. **Через Netlify CLI**
   ```bash
   # Установите Netlify CLI
   npm install -g netlify-cli
   
   # Войдите
   netlify login
   
   # Разверните
   cd website
   netlify deploy --prod
   ```

**Настройка custom domain:**
```bash
# В Netlify Dashboard:
# Domain settings → Add custom domain → aurely.app
# Добавьте DNS записи у вашего регистратора
```

### Вариант 2: Vercel

**Преимущества:**
- Отличная производительность
- Бесплатный SSL
- Автоматический CDN

**Шаги:**

```bash
# Установите Vercel CLI
npm install -g vercel

# Войдите
vercel login

# Разверните
cd website
vercel

# Для production
vercel --prod
```

**Конфигурация (vercel.json):**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### Вариант 3: GitHub Pages

**Преимущества:**
- Бесплатный хостинг
- Интеграция с GitHub
- Простая настройка

**Шаги:**

```bash
# Создайте репозиторий на GitHub
# Загрузите код
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/aurely-website.git
git push -u origin main

# В настройках репозитория:
# Settings → Pages → Source: main branch → Save
```

**Custom domain:**
- Создайте файл `CNAME` с вашим доменом:
  ```
  aurely.app
  ```
- Настройте DNS у регистратора:
  ```
  A     @     185.199.108.153
  A     @     185.199.109.153
  A     @     185.199.110.153
  A     @     185.199.111.153
  CNAME www   yourusername.github.io
  ```

### Вариант 4: AWS S3 + CloudFront

**Преимущества:**
- Масштабируемость
- Полный контроль
- Интеграция с AWS сервисами

**Шаги:**

1. **Создайте S3 bucket**
   ```bash
   aws s3 mb s3://aurely-website
   ```

2. **Настройте static website hosting**
   ```bash
   aws s3 website s3://aurely-website --index-document index.html
   ```

3. **Загрузите файлы**
   ```bash
   cd website
   aws s3 sync . s3://aurely-website --acl public-read
   ```

4. **Настройте CloudFront**
   - Создайте CloudFront distribution
   - Origin: ваш S3 bucket
   - Включите HTTPS
   - Настройте custom domain

### Вариант 5: Традиционный хостинг (cPanel)

**Шаги:**

1. Подключитесь к хостингу через FTP/SFTP
2. Загрузите все файлы из папки `website` в `public_html`
3. Убедитесь, что `index.html` в корне
4. Настройте SSL сертификат (Let's Encrypt)

## 🔧 Настройка после развертывания

### 1. SSL/HTTPS
Убедитесь, что SSL сертификат установлен и работает.

### 2. DNS настройки
```
A     @     [IP вашего хостинга]
CNAME www   [ваш домен]
```

### 3. Редиректы
Настройте редирект с www на без www (или наоборот):

**Netlify (_redirects файл):**
```
https://www.aurely.app/* https://aurely.app/:splat 301!
```

**Vercel (vercel.json):**
```json
{
  "redirects": [
    {
      "source": "https://www.aurely.app/:path*",
      "destination": "https://aurely.app/:path*",
      "permanent": true
    }
  ]
}
```

### 4. Кэширование
Настройте правильные заголовки кэширования:

**Netlify (_headers файл):**
```
/css/*
  Cache-Control: public, max-age=31536000, immutable

/js/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

## 📊 Мониторинг и аналитика

### Google Analytics (опционально)
Добавьте перед закрывающим `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Plausible Analytics (privacy-friendly)
```html
<script defer data-domain="aurely.app" src="https://plausible.io/js/script.js"></script>
```

## ✅ Чеклист после развертывания

- [ ] Сайт открывается по основному домену
- [ ] HTTPS работает (зеленый замок)
- [ ] Все страницы загружаются
- [ ] Мобильная версия работает
- [ ] Все ссылки работают
- [ ] Формы отправляются (если есть)
- [ ] Нет ошибок в консоли
- [ ] Скорость загрузки < 3 секунд
- [ ] Google Search Console настроен
- [ ] Sitemap отправлен
- [ ] robots.txt настроен

## 🔍 SEO после развертывания

### 1. Google Search Console
```bash
# Создайте sitemap.xml
# Отправьте в Google Search Console
```

### 2. Sitemap.xml
Создайте файл `sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://aurely.app/</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

### 3. robots.txt
Создайте файл `robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://aurely.app/sitemap.xml
```

## 🚨 Troubleshooting

### Проблема: Сайт не открывается
- Проверьте DNS настройки (может занять до 48 часов)
- Убедитесь, что файлы загружены правильно
- Проверьте логи хостинга

### Проблема: CSS/JS не загружаются
- Проверьте пути к файлам (относительные vs абсолютные)
- Убедитесь, что файлы загружены
- Проверьте MIME types на сервере

### Проблема: Медленная загрузка
- Оптимизируйте изображения
- Включите кэширование
- Используйте CDN
- Минифицируйте CSS/JS

## 📞 Поддержка

Если возникли проблемы:
- Проверьте документацию хостинга
- Обратитесь в поддержку хостинга
- Создайте issue на GitHub

---

**Удачного развертывания! 🚀**
