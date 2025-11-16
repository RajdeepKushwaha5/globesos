# 🚀 GlobeSoS Deployment Guide - Lingo.dev Edition

Complete deployment instructions for the fully internationalized GlobeSoS emergency response platform.

## 📋 Pre-Deployment Checklist

### ✅ Environment Setup

1. **Lingo.dev API Key**
   ```env
   LINGO_API_KEY=your_lingo_api_key
   NEXT_PUBLIC_LINGO_API_KEY=your_lingo_api_key
   ```

2. **Supabase Credentials**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Optional: Google AI** (for emergency classification only)
   ```env
   GOOGLE_AI_API_KEY=your_google_ai_key
   ```

### ✅ Translation Setup

1. **Extract all translatable strings**
   ```bash
   npm run lingo:extract
   ```

2. **Translate to all languages**
   ```bash
   npm run lingo:translate
   ```

3. **Verify translations**
   ```bash
   # Check all locale files exist
   ls i18n/locales/
   # Should show: en.json, es.json, fr.json, ru.json, de.json, ja.json, zh.json, ar.json, ko.json
   ```

### ✅ Build Verification

```bash
# Test build locally
npm run build

# Expected output:
# ✓ Compiled successfully
# ✓ Lingo.dev compiler integration active
# ✓ All 9 locales processed
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   vercel login
   vercel link
   ```

2. **Configure Environment Variables**
   ```bash
   vercel env add LINGO_API_KEY
   vercel env add NEXT_PUBLIC_LINGO_API_KEY
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Verify Deployment**
   - Test language switcher
   - Verify all 9 languages load
   - Check RTL for Arabic
   - Test emergency translation

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

2. **Configure Build Settings**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

3. **Set Environment Variables**
   ```bash
   netlify env:set LINGO_API_KEY "your_key"
   netlify env:set NEXT_PUBLIC_LINGO_API_KEY "your_key"
   # ... other variables
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Option 3: Docker

1. **Build Image**
   ```bash
   docker build -t globesos:latest .
   ```

2. **Run Container**
   ```bash
   docker run -d \
     -p 3000:3000 \
     -e LINGO_API_KEY=your_key \
     -e NEXT_PUBLIC_LINGO_API_KEY=your_key \
     -e NEXT_PUBLIC_SUPABASE_URL=your_url \
     -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
     -e SUPABASE_SERVICE_ROLE_KEY=your_key \
     globesos:latest
   ```

## 🔄 CI/CD Setup

### GitHub Actions Auto-Translation

Already configured! On every push to `main`:

1. ✅ Extracts new translation keys
2. ✅ Translates using Lingo.dev API
3. ✅ Validates JSON integrity
4. ✅ Creates PR with translations
5. ✅ Quality checks pass

**Manual trigger:**
```bash
# Via GitHub UI: Actions > Lingo.dev Auto-Translation > Run workflow
```

### Deployment Automation

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install -g pnpm
      - run: pnpm install
      - run: npm run lingo:sync
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 📊 Post-Deployment Verification

### 1. Translation Functionality

```bash
# Test each language
curl https://your-domain.com/api/lingo/translate \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"text":"Help! Fire emergency!","targetLang":"es"}'

# Expected: {"translatedText":"¡Ayuda! Emergencia de incendio!","..."}
```

### 2. Language Detection

```bash
curl https://your-domain.com/api/lingo/detect \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"text":"¡Socorro!"}'

# Expected: {"language":"es","confidence":0.95}
```

### 3. UI Language Switching

- [ ] Language switcher appears in navbar
- [ ] All 9 languages listed
- [ ] Switching changes entire UI
- [ ] Selection persists on refresh
- [ ] Arabic shows RTL layout
- [ ] No console errors

### 4. Performance

```bash
# Lighthouse CI
npm install -g lighthouse
lighthouse https://your-domain.com --view

# Expected scores:
# Performance: >90
# Accessibility: >95
# Best Practices: >90
# SEO: >90
```

## 🐛 Troubleshooting

### Issue: Translations not loading

**Solution:**
```bash
# Verify locale files exist
ls -la i18n/locales/

# Rebuild translations
npm run lingo:sync

# Clear Next.js cache
rm -rf .next
npm run build
```

### Issue: Lingo.dev API errors

**Solution:**
```bash
# Verify API key
echo $LINGO_API_KEY

# Test API directly
curl -H "Authorization: Bearer $LINGO_API_KEY" \
  https://api.lingo.dev/v1/health

# Check rate limits in Lingo.dev dashboard
```

### Issue: Arabic RTL not working

**Solution:**
```bash
# Ensure RTL CSS is loaded
# Check styles/rtl.css exists
ls -la styles/rtl.css

# Verify RTL class is applied
# Inspect <html> tag: should have class="rtl" when Arabic selected
```

## 📈 Monitoring

### Translation Usage

```javascript
// Add to your analytics
window.gtag('event', 'translation', {
  source_lang: 'en',
  target_lang: 'es',
  success: true
})
```

### Error Tracking

```javascript
// Sentry integration (optional)
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

## 🎯 Success Metrics

After deployment, monitor:

- ✅ **Translation Coverage**: All pages in all 9 languages
- ✅ **API Uptime**: 99.9% Lingo.dev API availability
- ✅ **User Engagement**: Language switcher usage
- ✅ **Performance**: <2s page load time
- ✅ **Error Rate**: <0.1% translation failures

## 📚 Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Lingo.dev API Docs](https://lingo.dev/docs/api)
- [Vercel i18n Guide](https://vercel.com/guides/internationalization)

## 🆘 Support

- **Lingo.dev Support**: support@lingo.dev
- **Project Issues**: GitHub Issues
- **Emergency**: Check status page

---

**Ready for Production! 🚀**
