# Vercel Blob Storage Setup для Fighter Images

## Проблема, которую мы решили

❌ **Старая версия**: Пыталась сохранять изображения в `public/generated-fighters/`  
✅ **Новая версия**: Использует Vercel Blob Storage в production, OpenAI URLs в development

### Почему была ошибка?

В serverless окружении Vercel (AWS Lambda):
- Файловая система **read-only** (только для чтения)
- Нельзя создавать папки или сохранять файлы в `public/`
- Путь `/var/task/` = Vercel production environment

## ✅ Решение: Vercel Blob Storage

### Как это работает теперь?

1. **Development (localhost):**
   - Генерирует изображение через OpenAI DALL-E 3
   - Возвращает URL напрямую от OpenAI
   - ⚠️ OpenAI URLs действительны 1 час

2. **Production (Vercel):**
   - Генерирует изображение через OpenAI DALL-E 3
   - Загружает изображение в Vercel Blob Storage
   - Возвращает постоянный URL от Vercel Blob
   - ✅ Изображения хранятся постоянно

## 🚀 Настройка (Step-by-Step)

### Шаг 1: Установить пакет (уже сделано)

```bash
npm install @vercel/blob
```

### Шаг 2: Создать Blob Store в Vercel Dashboard

1. Откройте Vercel Dashboard: https://vercel.com/dashboard
2. Выберите ваш проект **ufcaibot**
3. Перейдите в **Storage** → **Create Database**
4. Выберите **Blob**
5. Дайте имя: `fighter-images` (или любое другое)
6. Нажмите **Create**

### Шаг 3: Получить токен

После создания Blob Store, Vercel автоматически создаст переменную окружения:
- `BLOB_READ_WRITE_TOKEN`

Вы увидите её в **Project Settings → Environment Variables**

### Шаг 4: Добавить переменные окружения

#### В Vercel (Production):

1. Откройте https://vercel.com/vanya-vasya/ufcaibot/settings/environment-variables
2. Добавьте (если еще нет):

```
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_API_KEY_HERE
```

3. `BLOB_READ_WRITE_TOKEN` должен быть добавлен автоматически после создания Blob Store

#### В .env.local (Development - опционально):

Для development Blob Storage не обязателен, но если хотите тестировать:

```bash
# .env.local
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx... # Необязательно для dev
```

### Шаг 5: Redeploy проекта

После добавления переменных окружения:

```bash
# Через CLI:
vercel --prod

# Или через Git:
git add .
git commit -m "fix: Use Vercel Blob Storage for fighter images in production"
git push origin feature/ai-fighter-image-generation
```

Vercel автоматически задеплоит при push в GitHub.

## 📊 Как работает код

### API Route Logic

```typescript
// Определяем окружение
const isProduction = process.env.VERCEL === '1';
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

if (isProduction && blobToken) {
  // Production: Сохраняем в Vercel Blob
  const { url } = await put(fileName, blob, {
    access: 'public',
    token: blobToken,
  });
  return url; // Постоянный URL
} else {
  // Development: Используем OpenAI URL напрямую
  return openaiImageURL; // Временный URL (1 час)
}
```

### Окружения:

| Environment | Storage | URL Lifetime | Notes |
|------------|---------|--------------|-------|
| Development | OpenAI direct | 1 hour | Достаточно для dev/testing |
| Production without Blob | OpenAI direct | 1 hour | ⚠️ Изображения исчезнут через час |
| Production with Blob | Vercel Blob | Permanent | ✅ Рекомендуется |

## 💰 Стоимость

### Vercel Blob Pricing (as of 2024):

**Free Tier (Hobby):**
- 1 GB storage
- 100 GB bandwidth/month
- Бесплатно!

**Pro Plan:**
- 100 GB storage included
- 1 TB bandwidth included
- $0.05 per additional GB storage
- $0.15 per additional GB bandwidth

### Примерный расчет для UFC AI Bot:

- Каждое изображение: ~2 MB
- 500 изображений = ~1 GB (Free tier)
- 5,000 изображений = ~10 GB ($0.50/month)

### OpenAI Costs:

- DALL-E 3 Standard (1792x1024): **$0.08 per image**
- Это основная стоимость

## 🧪 Тестирование

### Test в Development:

```bash
# 1. Запустите dev сервер
npm run dev

# 2. В браузере откройте http://localhost:3000
# 3. Введите имена бойцов
# 4. Нажмите VS
# 5. Изображение появится (используя OpenAI URL)
```

### Test в Production:

```bash
# 1. Deploy на Vercel
vercel --prod

# 2. Откройте production URL
# 3. Тестируйте генерацию
# 4. Проверьте Vercel Blob Dashboard - файлы должны появиться
```

### Проверка Vercel Blob Dashboard:

1. https://vercel.com/dashboard
2. Выберите проект
3. **Storage** → Ваш Blob Store
4. Должны видеть список загруженных изображений

## 🔍 Отладка

### Логи в Production:

Vercel Logs: https://vercel.com/vanya-vasya/ufcaibot/logs

Смотрите на:
```
[Image Generation] Request received for: Fighter A vs Fighter B
[Image Generation] Image generated by OpenAI: https://...
[Image Generation] Uploading to Vercel Blob Storage...
[Image Generation] Uploaded to Vercel Blob: https://...
[Image Generation] Success! Image available at: https://...
```

### Типичные ошибки:

#### 1. "BLOB_READ_WRITE_TOKEN is not defined"

**Решение:**
- Создайте Blob Store в Vercel Dashboard
- Токен добавится автоматически
- Redeploy проект

#### 2. Изображение исчезает через час

**Причина:** Используется OpenAI URL напрямую (нет Blob Storage)

**Решение:** Настройте Vercel Blob Storage

#### 3. "Upload failed"

**Проверьте:**
- BLOB_READ_WRITE_TOKEN установлен
- Blob Store создан
- Правильные права доступа

## 📝 Environment Variables Checklist

### Development (.env.local):

```bash
✅ OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
⚪ BLOB_READ_WRITE_TOKEN=vercel_blob_YOUR_TOKEN_HERE # Опционально
```

### Production (Vercel):

```bash
✅ OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
✅ BLOB_READ_WRITE_TOKEN=vercel_blob_YOUR_TOKEN_HERE # Обязательно!
✅ VERCEL=1 # Автоматически устанавливается Vercel
```

## 🎯 Quick Start для Production

### Вариант 1: С Blob Storage (Рекомендуется)

```bash
# 1. Создайте Blob Store в Vercel Dashboard
# 2. Добавьте OPENAI_API_KEY в environment variables
# 3. Deploy
vercel --prod
```

### Вариант 2: Без Blob Storage (временные изображения)

```bash
# Просто добавьте OPENAI_API_KEY и deploy
# Изображения будут работать 1 час
vercel --prod
```

## 🔗 Полезные ссылки

- Vercel Blob Docs: https://vercel.com/docs/storage/vercel-blob
- Vercel Blob Quickstart: https://vercel.com/docs/storage/vercel-blob/quickstart
- OpenAI DALL-E Pricing: https://openai.com/pricing
- Vercel Dashboard: https://vercel.com/dashboard

## ✅ Проверка что всё работает

1. ✅ `@vercel/blob` установлен
2. ✅ Код обновлен для использования Blob Storage
3. ✅ Blob Store создан в Vercel (или готовы использовать временные URLs)
4. ✅ Environment variables добавлены
5. ✅ Проект задеплоен

## 🚀 Next Steps

1. **Создайте Blob Store** в Vercel Dashboard
2. **Добавьте OPENAI_API_KEY** в production environment variables
3. **Redeploy** проект:
   ```bash
   git add .
   git commit -m "fix: Use Vercel Blob Storage for production"
   git push
   ```
4. **Тестируйте** на production URL
5. **Проверьте** Blob Storage dashboard - изображения должны появляться

---

**Готово! Теперь fighter images будут работать в production! 🎉**

