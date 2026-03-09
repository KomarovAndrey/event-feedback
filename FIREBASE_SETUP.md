# Настройка Firebase Firestore для проекта

Пошаговая инструкция: создание проекта, включение Firestore, получение конфига и подстановка в приложение.

---

## 1. Создание проекта Firebase

1. Откройте [Firebase Console](https://console.firebase.google.com/).
2. Войдите через Google-аккаунт.
3. Нажмите **«Создать проект»** (или **Add project**).
4. Введите имя проекта (например, `event-feedback`) и при необходимости отключите Google Analytics — нажмите **«Продолжить»** и дождитесь создания.

---

## 2. Регистрация веб-приложения и получение конфига

1. В обзорном экране проекта нажмите иконку **Web** (`</>`).
2. Укажите название приложения (например, `event-feedback-web`) и при необходимости отметьте Firebase Hosting — нажмите **«Зарегистрировать приложение»**.
3. На экране появятся объект `firebaseConfig` и вызов `firebase.initializeApp(firebaseConfig)`. Скопируйте значения из `firebaseConfig`:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
4. Эти же значения нужно будет подставить в **index.html** и **report.html** (см. шаг 4).

---

## 3. Включение Firestore и правила доступа

1. В левом меню выберите **«Сбор данных»** → **«Firestore Database»** (или **Build** → **Firestore Database**).
2. Нажмите **«Создать базу данных»**.
3. Выберите **«Начать в тестовом режиме»** (доступ на чтение/запись на 30 дней для отладки). Для продакшена позже настройте правила вручную.
4. Выберите регион (например, `europe-west1`) и подтвердите создание.

**Правила для тестового режима** выглядят так (доступны по вкладке «Правила»):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 4, 6);
    }
  }
}
```

Для постоянного доступа только к коллекции `feedback` (чтение и запись для всех) можно использовать:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /feedback/{docId} {
      allow read, write: if true;
    }
  }
}
```

> В реальном проекте ограничьте доступ (например, по домену или через Auth).

---

## 4. Коллекция `feedback` и формат данных

Коллекцию создавать вручную не обязательно: она появится при первой записи из приложения.

- **Коллекция:** `feedback`
- **Документ:** создаётся автоматически (авто-ID).
- **Поле:** `rating` (строка). Значения: `good`, `neutral`, `bad` (соответствуют кнопкам «Отлично», «Нормально», «Плохо»).

---

## 5. Подстановка конфига в проект

В обоих файлах — **index.html** и **report.html** — найдите объект `firebaseConfig` и замените плейсхолдеры на значения из консоли Firebase:

```javascript
const firebaseConfig = {
  apiKey: "ваш_apiKey",
  authDomain: "ваш_projectId.firebaseapp.com",
  projectId: "ваш_projectId",
  storageBucket: "ваш_projectId.appspot.com",
  messagingSenderId: "ваш_messagingSenderId",
  appId: "ваш_appId"
};
```

После сохранения:

- **index.html** будет записывать каждую оценку в Firestore (коллекция `feedback`, поле `rating`).
- **report.html** будет загружать все документы из `feedback` и показывать статистику по значениям `good` / `neutral` / `bad`.

Если конфиг не подставлен (оставлен `YOUR_PROJECT_ID`), приложение продолжит работать с **localStorage**: данные хранятся только в браузере, отчёт показывает локальную статистику.
