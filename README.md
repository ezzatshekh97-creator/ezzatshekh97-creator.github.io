# NEON — بورتفوليو عزت شيخ محمد

موقع ثابت (HTML / CSS / JS) جاهز للرفع على GitHub Pages أو Netlify أو Vercel مجاناً.

## الرفع على GitHub Pages (الأسهل — من المتصفح)
1. افتح مستودعك `Ezzatshaikhmohammed` على GitHub (أو أنشئ مستودعاً جديداً).
2. **Add file → Upload files** واسحب **محتوى** هذا المجلد كاملاً (index.html و css و js و assets و .nojekyll).
3. **Settings → Pages → Branch: main / root → Save**.
4. بعد دقيقة يعمل الموقع على: `https://ezzatshekh-stack.github.io/Ezzatshaikhmohammed/`

## أو من سطر الأوامر
```bash
git init
git add .
git commit -m "NEON portfolio"
git branch -M main
git remote add origin https://github.com/ezzatshekh-stack/Ezzatshaikhmohammed.git
git push -f origin main
```
> `-f` يستبدل محتوى الموقع القديم بالكامل.

## التعديل
- النصوص والروابط: `index.html`
- الألوان والخطوط: أعلى `css/style.css` (`--orange` `--purple` `--lime`)
- إضافة فيديو: ضع ملف mp4 مضغوط (540×960) وصورة webp في `assets/video` وانسخ أي بطاقة `<article class="reel">`.

## المكتبات
GSAP 3.12.5 + ScrollTrigger، Lenis 1.1.13 (من CDN). الخطوط: ثمانية Sans و Serif Display (محلية في assets/fonts).
