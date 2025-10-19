# 📸 Руководство по добавлению скриншотов

## Структура папок создана

```
website/images/
├── hero/              # Главный скриншот для Hero section
├── screenshots/       # Остальные скриншоты
└── gallery/          # Для галереи (опционально)
```

## Какие скриншоты нужны

### Обязательные (минимум):

1. **Главное окно** (уже есть!) 
   - Сохраните как: `website/images/hero/main-window.png`
   - Используется в Hero section

2. **Quick Recorder**
   - Окно с микрофоном для голосовой записи
   - Сохраните как: `website/images/screenshots/quick-recorder.png`

### Дополнительные (для полноты):

3. **Advanced Creator**
   - Детальное создание напоминания
   - Сохраните как: `website/images/screenshots/advanced-creator.png`

4. **Settings (Настройки)**
   - Окно настроек
   - Сохраните как: `website/images/screenshots/settings.png`

5. **Notifications (Уведомления)**
   - Пример custom toast уведомления
   - Сохраните как: `website/images/screenshots/notification.png`

6. **Темы**
   - Light theme: `website/images/screenshots/theme-light.png` (уже есть!)
   - Dark theme: `website/images/screenshots/theme-dark.png`
   - Blue theme: `website/images/screenshots/theme-blue.png`

## Как добавить скриншоты

### Способ 1: Через Finder
1. Откройте Finder
2. Перейдите в `/Users/levan/Documents/APP_Cursor/Aurely_Website/website/images/hero/`
3. Перетащите главный скриншот и назовите его `main-window.png`
4. Повторите для других скриншотов в папке `screenshots/`

### Способ 2: Через терминал
```bash
# Скопируйте ваши скриншоты
cp ~/Desktop/main-window.png website/images/hero/
cp ~/Desktop/quick-recorder.png website/images/screenshots/
# и т.д.
```

## После добавления скриншотов

Я обновлю HTML файлы, чтобы они использовали реальные изображения вместо плейсхолдеров.

## Текущий статус

- ✅ Папки созданы
- ✅ Главное окно (Light theme) - получен
- ⬜ Quick Recorder
- ⬜ Advanced Creator  
- ⬜ Settings
- ⬜ Notifications
- ⬜ Dark theme
- ⬜ Blue theme

## Формат изображений

- **Формат:** PNG (предпочтительно) или JPG
- **Разрешение:** Оригинальное (не уменьшайте)
- **Размер:** Любой (я оптимизирую при необходимости)

## Что дальше?

1. Добавьте скриншоты в папки
2. Дайте мне знать, какие добавили
3. Я обновлю HTML с правильными путями

---

**Пока можем работать с тем, что есть! Главный скриншот уже отлично смотрится! 🎨**
