# Хранение статистики на Vercel (Redis)

Ответы сохраняются через Serverless API и **Upstash Redis**. Без Redis приложение работает с localStorage (данные только в браузере).

---

## 1. Деплой проекта на Vercel

Если ещё не задеплоили:

- Подключите репозиторий в [Vercel](https://vercel.com) (Import Git Repository).
- Деплой пройдёт автоматически: статика (HTML/CSS) и папка `api/` станут Serverless Functions.

---

## 2. Подключение Redis (Upstash)

1. Откройте проект в [Vercel Dashboard](https://vercel.com/dashboard).
2. Перейдите в **Storage** (или **Integrations** / **Marketplace**).
3. Найдите **Upstash Redis** и нажмите **Add** / **Connect**.
4. Создайте новую базу (или выберите существующую), укажите имя и регион.
5. Привяжите хранилище к проекту **event-feedback** (выберите проект в списке).
6. После подключения Vercel добавит в проект переменные окружения:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

Их не нужно копировать вручную — они подставляются при сборке.

---

## 3. Повторный деплой

После добавления Redis сделайте новый деплой:

- **Redeploy** последнего деплоя в Vercel,  
  или  
- новый **git push** в ветку, с которой связан проект.

После деплоя API `/api/feedback` и `/api/stats` начнут использовать Redis.

---

## 4. Как это устроено

| Действие | Что происходит |
|----------|-----------------|
| Пользователь нажимает кнопку оценки | `index.html` отправляет **POST** на `/api/feedback` с `{ "rating": "good" \| "neutral" \| "bad" }`. |
| API `api/feedback.js` | Увеличивает счётчик в Redis: `feedback:good`, `feedback:neutral` или `feedback:bad`. |
| Открытие отчёта | `report.html` запрашивает **GET** `/api/stats`. |
| API `api/stats.js` | Читает три счётчика из Redis и возвращает `{ good, neutral, bad, total }`. |

Если Redis не подключён или API недоступен (например, локальный `npx serve`), форма сохраняет оценки в **localStorage**, а отчёт показывает локальную статистику.

---

## 5. Локальная проверка API (опционально)

Установите зависимости и запустите [Vercel CLI](https://vercel.com/docs/cli) в каталоге проекта:

```bash
npm install
npx vercel dev
```

В браузере откройте указанный локальный адрес. Чтобы работал Redis, в этом же каталоге создайте файл `.env.local` и добавьте переменные из Vercel (Settings → Environment Variables):

```
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

Тогда `api/feedback` и `api/stats` будут использовать Redis и локально.
