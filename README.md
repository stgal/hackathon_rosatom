# BACKEND


Этапы развёртывания сервера

    - Установить Node.js версии 10.16.0 и выше
        - Скачать и установить Node с оф.сайта (https://nodejs.dev/)

    - Установить менеджер процессов PM2
        - npm install pm2 -g
    
    - Установить все пакеты npm
        - npm install
        
    - Создать config.json в корневой директории (пример ниже)
    
    - В папку ./audio/acoustic-model - разархивировть ru-Ru.zip
        
    
    
>прим конфига:
>{
  "mysql": {
    "connectionLimit" : 50,
    "connectTimeout"  : 60000,
    "acquireTimeout"  : 60000,
    "host"     : "192.168.1.50", //хост сервера БД
    "port"     : "3306", //порт сервера БД
    "user"        : "hackathon", //пользователь под которым будет происходит авторизация на сервер БД
    "password"    : "hackathon", //пароль от базы данных
    "database"    : "hackathon", пользователь БД, к которой будет происходить подключение
    "dateStrings" : "TIMESTAMP"
  },
  "port": 8090 //порт, на которой запускается приложение
}
