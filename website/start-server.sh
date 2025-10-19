#!/bin/bash

echo "🚀 Запуск локального сервера для Aurely Website..."
echo ""
echo "Сервер будет доступен по адресу: http://localhost:8000"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo ""
echo "----------------------------------------"
echo ""

# Запуск сервера
python3 -m http.server 8000
