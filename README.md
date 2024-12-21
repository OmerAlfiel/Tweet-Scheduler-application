# Tweet-Scheduler-application
This project is a Tweet Scheduler application built using the NestJS framework. The application allows users to schedule tweets to be posted at a later time. It integrates with the Twitter API to post tweets and uses various modules to manage different aspects of the application, such as user management, scheduling, and database interactions.
This project is a Tweet Scheduler application built using the NestJS framework. The application allows users to schedule tweets to be posted at a later time. It integrates with the Twitter API to post tweets and uses various modules to manage different aspects of the application, such as user management, scheduling, and database interactions.

### Project Structure

1. **App Module (`app.module.ts`)**
   - The main module of the application that imports and configures all other modules.
   - Uses `ConfigModule` to load environment variables from a `.env` file.
   - Configures `BullModule` for managing queues with Redis.
   - Imports other modules like `TwitterModule`, `SchedulerModule`, `DatabaseModule`, and `UserModule`.

2. **Twitter Module (`twitter.module.ts`)**
   - Manages interactions with the Twitter API.
   - Contains services and utilities for handling Twitter API requests.

3. **Scheduler Module (`scheduler.module.ts`)**
   - Manages the scheduling of tweets.
   - Uses `BullModule` to handle job queues for scheduled tweets.
   - Imports `ScheduleModule` for cron-like scheduling capabilities.

4. **Database Module (`database.module.ts`)**
   - Manages database interactions using TypeORM.
   - Configures database connection settings using environment variables.
   - Defines entities like `AccountEntity` and `HistoryEntity`.

5. **User Module (`user.module.ts`)**
   - Manages user-related functionalities.
   - Imports `TypeOrmModule` to interact with user-related entities.
   - Uses `forwardRef` to handle circular dependencies with `TwitterModule`.

6. **Main Entry Point (`main.ts`)**
   - The entry point of the application.
   - Initializes the NestJS application and sets up global filters and pipes.

### Environment Variables

The application uses a `.env` file to manage configuration settings. Key environment variables include:

- `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `ACCESS_TOKEN`, `ACCESS_TOKEN_SECRET`, `Bearer_Token`: Twitter API credentials.
- `REDIS_HOST`, `REDIS_PORT`: Redis server configuration for Bull queues.
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: PostgreSQL database configuration.

### Key Features

- **Tweet Scheduling**: Users can schedule tweets to be posted at a later time using the Twitter API.
- **User Management**: Handles user-related functionalities, including storing user data in the database.
- **Database Integration**: Uses PostgreSQL for storing user accounts and tweet history.
- **Job Queues**: Uses Bull and Redis to manage job queues for scheduled tweets.
- **Exception Handling**: Implements global exception filters to handle errors gracefully.

### Running the Application

1. **Install Dependencies**: Run `npm install` to install all required dependencies.
2. **Set Up Environment Variables**: Create a `.env` file in the root directory with the necessary environment variables.
3. **Start the Application**: Run `npm run start` to start the NestJS application.

This project demonstrates a comprehensive use of NestJS features, including modules, services, dependency injection, and integration with external APIs and databases.
