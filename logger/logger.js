const {format, createLogger, transports} = require('winston');
const { Console } = require('winston/lib/winston/transports');
require('winston-daily-rotate-file');
require('winston-mongodb');

require('dotenv').config();

const {combine, timestamp, label, prettyPrint} = format

const fileRotateTransport = new transports.DailyRotateFile({
    level:"info",
    filename:"logs/info-%DATE%.log",
    datePattern:"DD-MM-YYYY",
    maxFiles:"10d",
})

const logger = createLogger({
    level : "debug",
    format: combine (
        label({label: "Logs to for Users Products App"}),
        timestamp({
            format:"DD-MM-YYYY HH:mm:ss"
        }),
        format.json(),
        //prettuPrint()
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename:"logs/example.log"
        }),
        new transports.File({
            level:"error",
            filename:"logs/error.log"
        }),
        new transports.File({
            level:"info",
            filename:"logs/info.log"
        }),
        fileRotateTransport,
        new transports.MongoDB({
            level:"info",
            db: process.env.MongoDB_URI,
            options:{
                useUnifiedTopology:true
            },
            collection: "server_logs",
            format: format.combine(
                format.timestamp(),
                format.json()
            )
        })
    ]
})

module.exports = logger;