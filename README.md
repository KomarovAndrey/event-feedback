# Event Feedback (Supabase + Vercel)

Простое веб‑приложение для оценки мероприятия:

- **Страница оценки**: текст «Оцените мероприятие» и три смайлика (зелёный/жёлтый/красный).
- **Поведение**: при клике — «Спасибо за обратную связь», через пару секунд возврат к экрану оценки.
- **Хранение**: ответы сохраняются в таблицу `feedback` в Supabase.
- **Отчёт**: страница `report.html` показывает количество ответов по каждому варианту.
- **Git**: проект готов к `git init`, коммитам и публикации на GitHub.
- **Деплой**: легко разворачивается как статический сайт на Vercel.

---

## 1. Структура проекта

В каталоге `event-feedback`:

- `index.html` — основная страница для участников (оценка).
- `report.html` — страница отчётности.
- `styles.css` — общие стили.
- `package.json` — удобный скрипт для локального запуска.
- `.gitignore` — базовая конфигурация для git.
- `README.md` — это описание.

---

## 2. Настройка Supabase

### 2.1. Создание проекта

1. Зайдите на сайт Supabase.
2. Создайте новый проект (New project).
3. Дождитесь, пока база развернётся.

### 2.2. Создание таблицы `feedback`

В Supabase Console:

1. Откройте вкладку **Table editor**.
2. Нажмите **New table**.
3. Имя таблицы: `feedback`.
4. Поля:
   - `id` — тип `uuid`, **Primary key**, Default value: `uuid_generate_v4()`.
   - `created_at` — тип `timestamp with time zone`, Default value: `now()`.
   - `rating` — тип `text`, **Not null**.
5. Сохраните таблицу.

### 2.3. Включение RLS и политики

1. В таблице `feedback` откройте вкладку **Auth → RLS** (Row Level Security).
2. Включите RLS (Enable RLS).
3. Добавьте политику для вставки:
   - Название: `Allow insert for all`.
   - Действие: `INSERT`.
   - Использовать простой шаблон: **Enable insert for all users**.
4. Добавьте политику для чтения:
   - Название: `Allow select for all`.
   - Действие: `SELECT`.
   - Шаблон: **Enable read access for all users**.

Так как это анонимные оценки без личных данных, общий доступ к SELECT допустим.

### 2.4. Получение URL и anon key

1. В Supabase Console откройте **Settings → API**.
2. Найдите:
   - `Project URL` — это будет `https://YOUR_PROJECT_ID.supabase.co`.
   - `anon public` key — публичный ключ (его можно использовать на клиенте).
3. Скопируйте эти значения.

---

## 3. Вставка ключей Supabase в проект

Откройте файлы `index.html` и `report.html` и замените:

```js
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_PUBLIC_KEY";
```

на реальные значения из вашего проекта Supabase.

> **Важно:** anon key всё равно виден в браузере, так устроен Supabase. Не размещайте здесь никакие секретные сервисные ключи.

---

## 4. Локальный запуск

### Установка Node.js (если ещё нет)

1. Скачайте установщик Node.js с официального сайта и установите.
2. После установки в терминале `powershell` проверьте:

```bash
node -v
npm -v
```

### Установка зависимостей (ничего не нужно)

В этом проекте зависимости указаны только для удобного запуска:

- Скрипт в `package.json`:

```json
"scripts": {
  "start": "npx serve ."
}
```

То есть можно просто использовать `npx serve` без предварительной установки.

### Запуск

В `powershell`:

```bash
cd C:\Users\Student\event-feedback
npm run start
```

Откроется локальный сервер (обычно `http://localhost:3000` или подобный). Зайдите в браузере:

- `http://localhost:3000/` — страница оценки (`index.html`).
- `http://localhost:3000/report.html` — страница отчёта.

---

## 5. Настройка git и GitHub

### 5.1. Инициализация git

В корне проекта:

```bash
cd C:\Users\Student\event-feedback
git init
git add .
git commit -m "Initial commit: event feedback app"
```

### 5.2. Создание репозитория на GitHub

1. Зайдите на GitHub и создайте новый репозиторий (без README, чтобы не мешало).
2. Следуйте подсказкам на GitHub, пример команд:

```bash
git remote add origin https://github.com/ВАШ_ЛОГИН/event-feedback.git
git branch -M main
git push -u origin main
```

После этого проект полностью находится в git и на GitHub.

---

## 6. Деплой на Vercel

### Вариант 1: через GitHub (рекомендуется)

1. Зайдите на Vercel и подключите свой GitHub‑аккаунт.
2. Нажмите **New Project** → выберите репозиторий `event-feedback`.
3. Настройки:
   - Framework: **Other** / **Static** (так как просто HTML).
   - Build command: оставить пустым.
   - Output directory: `.` (текущая папка).
4. Нажмите **Deploy**.

После деплоя:

- `https://ВАШ-ПРОЕКТ.vercel.app/` — страница оценки.
- `https://ВАШ-ПРОЕКТ.vercel.app/report.html` — отчёт.

### Вариант 2: напрямую из папки

Если не хотите через GitHub:

1. Установите Vercel CLI:

```bash
npm i -g vercel
```

2. В корне проекта:

```bash
cd C:\Users\Student\event-feedback
vercel
```

3. Следуйте шагам (project name, scope, и т.д.), укажите, что это **Static Site**, Output directory — `.`.

---

## 7. Как это работает

- В `index.html` при клике на смайлик вызывается функция `sendRating(rating)`:
  - Отправляется запись в таблицу `feedback` через `supabaseClient.from("feedback").insert([{ rating }])`.
  - При успехе показывается экран «Спасибо за обратную связь» на 2.5 секунды, затем интерфейс возвращается в исходное состояние.
- В `report.html` при загрузке страницы выполняется `select("rating")`:
  - Все записи таблицы `feedback` загружаются на клиент.
  - JS-код считает, сколько раз встречается `good`, `neutral`, `bad`, и рисует числа на экране.

---

## 8. Что вы настраиваете сами

- Создание проекта в Supabase.
- Таблица `feedback` и политики RLS.
- Подмена `SUPABASE_URL` и `SUPABASE_ANON_KEY` в двух HTML-файлах.
- Инициализация git, создание репозитория GitHub и деплой на Vercel.

После этого всё будет работать: оценки сохраняются в базе, а статистика доступна на странице отчёта.

