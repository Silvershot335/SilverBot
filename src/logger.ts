import { createLogger, format, transports } from 'winston';

process.env.NODE_ENV =
  process.argv[2] === 'production' ? 'production' : 'development';

const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

export const logger = createLogger({
  level: 'info',
  transports: [

    new transports.File({
      filename: 'error.log',
      level: 'error',
      format: fileFormat
    }),
    new transports.File({
      filename: 'combined.log',
      format: fileFormat
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    })
  );
}
