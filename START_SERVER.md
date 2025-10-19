# 🚀 Как запустить сервер

## Простой способ (копируй и вставляй)

### Шаг 1: Открой Терминал
- Нажми **Cmd+Space**
- Введи "Terminal"
- Нажми Enter

### Шаг 2: Скопируй и вставь эти команды

```bash
cd /Users/levan/Documents/APP_Cursor/Aurely_Website/website
python3 -m http.server 8000
```

### Шаг 3: Открой в браузере
После запуска сервера открой: **http://localhost:8000**

## Что ты увидишь в терминале

```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

Это значит, что сервер работает! ✅

## Как остановить сервер

Нажми **Ctrl+C** в терминале

## Альтернативный способ (еще проще)

### Вариант 1: Через скрипт
```bash
cd /Users/levan/Documents/APP_Cursor/Aurely_Website/website
./start-server.sh
```

### Вариант 2: Через Node.js (если установлен)
```bash
cd /Users/levan/Documents/APP_Cursor/Aurely_Website/website
npx serve
```

## Если не работает

### Проблема: "python3: command not found"
Попробуй:
```bash
python -m http.server 8000
```

### Проблема: "Address already in use"
Порт 8000 занят. Используй другой:
```bash
python3 -m http.server 8001
```
Затем открой: http://localhost:8001

### Проблема: "Permission denied"
Дай права на выполнение:
```bash
chmod +x start-server.sh
```

## Проверка

После запуска сервера и открытия http://localhost:8000 ты должен увидеть:
- ✅ Темный градиентный фон
- ✅ Красивые прозрачные карточки
- ✅ Все секции с контентом
- ✅ Работающие ссылки

## Быстрая команда (одна строка)

```bash
cd /Users/levan/Documents/APP_Cursor/Aurely_Website/website && python3 -m http.server 8000
```

Скопируй эту строку целиком и вставь в терминал!

---

**После запуска сервера сайт будет работать идеально! 🎉**
