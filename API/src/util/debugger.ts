// Impoting main package
import winston from 'winston';

// defineing the loger object
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.printf(({ level, message }) => {
      return `${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});
// exporting the loger function
export default logger;