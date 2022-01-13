# Верстка лендинга цифрового агентства

Адаптивная верстка макета лендинга для устройств с шириной экрана от 320px.

## Сборка проекта

```bash
1. git clone https://github.com/Dimeliora/digital-agency-landing
2. cd digital-agency-landing
3. npm install
```

Для сборки проекта используется планировщик задач Gulp.
Скрипты для сборки:

-   serve - сборка в development-режиме и запуск dev-server
-   build - сборка в development-режиме
-   prod - сборка в production-режиме

В режиме production осуществляется минификация HTML, CSS и JS кода без записи source-map, создание и подключение favicon.

### ВНИМАНИЕ

Для работы скрипта генерации favicon необходимо наличие файла **_favicon.png_** в директории _src/favicon_, там же расположен файл **_favicon-design.json_** для описания правил отображения иконок на разных устройствах.
