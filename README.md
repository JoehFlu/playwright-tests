# Playwright Test Automation Framework

Автоматизация тестирования веб-приложений с использованием **Playwright** и **TypeScript**.

## 🎯 Тестируемое приложение
Все тесты выполняются на учебном сайте **[DemoQA](https://demoqa.com)** - платформа для практики автоматизации тестирования.

### Элементы для тестирования:
- Text Boxes
- Checkboxes
- Radio Buttons
- И другие элементы UI

## 📋 Содержание

- [Требования](#-требования)
- [Установка](#-установка)
- [Структура проекта](#-структура-проекта)
- [Запуск тестов](#-запуск-тестов)
- [Конфигурация](#-конфигурация)
- [Отчёты](#-отчёты)
- [Полезные команды](#-полезные-команды)

## 📦 Требования

- **Node.js** (версия 18 или выше)
- **npm** или **yarn**

## 🔧 Установка

**1. Клонирование репозитория:**
```bash
git clone https://github.com/JoehFlu/playwright-tests.git
cd playwright-tests
```
**2. Установка зависимостей**
```bash
npm install
```
**3. Установка браузеров Playwright**
```bash
npx playwright install
```
## 📁 Структура проекта

| Файл/Папка | Описание |
|------------|----------|
| `node_modules/` | Зависимости (не коммитить) |
| `playwright-report/` | HTML отчёты (не коммитить) |
| `test-results/` | Результаты тестов (не коммитить) |
| `tests/` | Тестовые файлы |
| `text-box.spec.ts` | Пример теста |
| `.gitignore` | Игнорируемые файлы |
| `package.json` | Зависимости и скрипты |
| `package-lock.json` | Lock файл |
| `playwright.config.ts` | Конфигурация Playwright |
| `README.md` | Документация |

## 🚀 Запуск тестов

**Запуск всех тестов**
```bash
npm test
```
**Запуск в режиме UI**
```bash
npx playwright test --ui
```

**Запуск конкретного теста**
```bash
npx playwright test tests/text-box.spec.ts
```

**Запуск в headed режиме (с открытием браузера)**
```bash
npx playwright test --headed
```
**Запуск с отладкой**
```bash
npx playwright test --debug
```
**Запуск тестов по тегам**
```bash
npx playwright test --grep "@smoke"
```
## ⚙️ Конфигурация

Конфигурация находится в файле **playwright.config.ts**. 

**Основные настройки:**
- **Браузеры:** Chromium, Firefox, WebKit
- **Режимы:** headless/headed
- **Таймауты:** настройка времени ожидания
- **Отчёты:** HTML, JSON и другие форматы

## 📊 Отчёты
После запуска тестов HTML отчёт генерируется автоматически:
```bash
npx playwright test --grep "@smoke"
```
Отчёты сохраняются в папке **playwright-report/**.

## 📝 Полезные команды

**Открыть HTML отчёт**
```bash
npx playwright show-report
```
**Генератор кода**
```bash
npx playwright codegen
```