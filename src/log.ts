import { appendFileSync } from 'fs';
import { ILogObject, Logger } from 'tslog';

function logToFile(logObject: ILogObject) {
  const picked = (({ date, logLevel, argumentsArray }) => ({
    date,
    logLevel,
    argumentsArray,
  }))(logObject);
  appendFileSync('log.txt', JSON.stringify(picked) + '\n');
}

export function initLogger() {
  const logger = new Logger({
    displayLogLevel: false,
    displayFilePath: 'hidden',
    displayFunctionName: false,
    exposeErrorCodeFrame: false,
    overwriteConsole: true,
    dateTimeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  logger.attachTransport(
    {
      silly: logToFile,
      debug: logToFile,
      trace: logToFile,
      info: logToFile,
      warn: logToFile,
      error: logToFile,
      fatal: logToFile,
    },
    'silly'
  );
}
