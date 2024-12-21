import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

  

  // The ValidationPipe is a built-in pipe provided by NestJS that uses the class-validator library to automatically validate payloads.
  // When you use the ValidationPipe, NestJS will automatically validate payloads that are passed to your route handlers.
  // If the payload is invalid, the ValidationPipe will throw an error with details about the validation failure.

  // When you use the ValidationPipe, you can also pass in a configuration object to the constructor.
  // This object can contain a variety of options, such as:
  // - transform: If set to true, the ValidationPipe will automatically transform payloads to the correct type.
  // - whitelist: If set to true, the ValidationPipe will strip any properties that do not have any decorators.
  // - forbidNonWhitelisted: If set to true, the ValidationPipe will throw an error if any properties are not decorated.
  // - transformOptions: An object that can contain options for the class-transformer library.

  // app.useGlobalPipes(new ValidationPipe({
  //   transform: true,
  //   whitelist: true,
  //   forbidNonWhitelisted: true,
  // }));


  // the global filter will catch all exceptions that are not caught by the application's exception filters.
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
