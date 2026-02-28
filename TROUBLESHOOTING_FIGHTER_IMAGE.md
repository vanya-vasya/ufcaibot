# Troubleshooting: Fighter Image Not Displaying

## Проблема
Изображение бойцов не отображается между header и ODDS ANALYSIS

## Возможные причины и решения

### 1. ⚠️ Сервер не был перезапущен после добавления OPENAI_API_KEY

**Решение:**
```bash
# Остановите сервер (Ctrl+C) и перезапустите:
cd /Users/vladi/Documents/Projects/webapps/ufcaibot
npm run dev
```

### 2. 🔍 Проверьте консоль браузера

Откройте DevTools (F12) → Console

**Ожидаемые сообщения при успехе:**
```
Generating fighter image...
Fighter image generated successfully: /generated-fighters/maddalena-vs-makhachev-1234567890.png
```

**Если видите ошибку:**
```
Failed to generate fighter image: [детали ошибки]
```

### 3. 📡 Проверьте Network запросы

1. Откройте DevTools (F12) → Network
2. Введите имена бойцов и нажмите VS
3. Найдите запрос к `generate-fighter-image`
4. Проверьте:
   - Статус: должен быть 200 OK
   - Response: должен содержать imageUrl
   - Preview: проверьте данные ответа

### 4. 🔑 Проверьте API ключ

**Проверка в терминале:**
```bash
cd /Users/vladi/Documents/Projects/webapps/ufcaibot
grep "OPENAI_API_KEY" .env.local
```

**Должно показать:**
```
OPENAI_API_KEY=sk-proj-D52a...
```

### 5. 🧪 Протестируйте API напрямую

**Создайте тестовый файл:**
```bash
curl -X POST http://localhost:3000/api/generate-fighter-image \
  -H "Content-Type: application/json" \
  -d '{"fighterA":"Maddalena","fighterB":"Makhachev"}'
```

**Ожидаемый ответ:**
```json
{
  "success": true,
  "imageUrl": "/generated-fighters/maddalena-vs-makhachev-1234567890.png",
  "prompt": "Two professional UFC fighters...",
  "filePath": "/generated-fighters/..."
}
```

### 6. 📁 Проверьте директорию

**Проверьте что папка существует:**
```bash
ls -la /Users/vladi/Documents/Projects/webapps/ufcaibot/public/generated-fighters/
```

**Должна быть доступна для записи**

### 7. 🌐 OpenAI API статус

**Возможные ошибки от OpenAI:**
- Rate limit exceeded (превышен лимит запросов)
- Invalid API key (неверный ключ)
- Insufficient quota (недостаточно средств на счете)
- Content policy violation (нарушение политики контента)

**Проверьте:**
- https://platform.openai.com/account/usage
- https://platform.openai.com/account/billing

### 8. 💰 Проверьте баланс OpenAI

Генерация изображений стоит ~$0.08 за изображение.
Убедитесь что на счете OpenAI есть средства:
- https://platform.openai.com/account/billing/overview

## Быстрая проверка (шаг за шагом)

### Шаг 1: Откройте консоль браузера
1. F12 → Console
2. Очистите консоль (Clear console)
3. Введите бойцов и нажмите VS
4. Смотрите на сообщения

### Шаг 2: Проверьте что изображение передается в компонент
Добавьте в консоли после запроса:
```javascript
// В UFCArticle.tsx - можно добавить временно:
console.log("Image URL received:", imageUrl);
```

### Шаг 3: Проверьте API route
Посмотрите логи сервера Next.js в терминале где запущен `npm run dev`

## Временное решение для тестирования

Если нужно протестировать UI без реальной генерации:

### Вариант 1: Используйте существующее изображение
```typescript
// В dashboard/page.tsx замените:
imageUrl = "/generated-fighters/sample-fighters-demo.png";
```

### Вариант 2: Используйте placeholder
```typescript
imageUrl = "https://via.placeholder.com/1536x1024/000000/d4af37?text=Maddalena+VS+Makhachev";
```

## Проверка что все файлы на месте

```bash
# Проверьте наличие всех файлов:
ls -la app/api/generate-fighter-image/route.ts
ls -la components/dashboard/UFCArticle.tsx
ls -la public/generated-fighters/
```

## Типичные ошибки

### Ошибка 1: "Cannot read properties of undefined"
**Причина:** imageUrl не передан в UFCArticle
**Решение:** Проверьте что imageUrl добавлен в ArticleData

### Ошибка 2: "404 Not Found" на /api/generate-fighter-image
**Причина:** API route не найден
**Решение:** Перезапустите dev сервер

### Ошибка 3: "OPENAI_API_KEY not found"
**Причина:** Env переменная не загружена
**Решение:** Перезапустите сервер после добавления в .env.local

### Ошибка 4: Изображение не загружается (broken image)
**Причина:** Файл не был сохранен или путь неверный
**Решение:** Проверьте права на запись в public/generated-fighters/

## Логирование для отладки

Добавьте дополнительное логирование:

### В dashboard/page.tsx:
```typescript
console.log("About to generate image for:", fighterA, "vs", fighterB);
console.log("Image generation response:", imageData);
console.log("Setting article with imageUrl:", imageUrl);
```

### В UFCArticle.tsx:
```typescript
useEffect(() => {
  console.log("UFCArticle received imageUrl:", imageUrl);
}, [imageUrl]);
```

### В API route (route.ts):
```typescript
console.log("Received request for fighters:", fighterA, fighterB);
console.log("Calling OpenAI API with prompt:", prompt);
console.log("Image saved to:", filePath);
```

## Контакты для помощи

Если проблема не решается:
1. Проверьте логи сервера Next.js
2. Проверьте логи браузера (Console и Network)
3. Проверьте статус OpenAI API
4. Проверьте что все файлы закоммичены и синхронизированы

## Быстрый тест работоспособности

Выполните этот JavaScript в консоли браузера (когда открыта страница):
```javascript
fetch('/api/generate-fighter-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ fighterA: 'Test Fighter A', fighterB: 'Test Fighter B' })
})
.then(r => r.json())
.then(d => console.log('API Response:', d))
.catch(e => console.error('API Error:', e));
```

Если видите успешный ответ - API работает!
Если ошибка - смотрите детали в сообщении.

