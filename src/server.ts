/* eslint-disable no-console */
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { Server } from 'http';
import seedSuperAdmin from './app/DB';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string)
    seedSuperAdmin();
    server = app.listen(config.port, () => {
      console.log(`App is listening on port ${config.port}`)
    });
  } catch (err) {
    console.log(err)
  }
};

main();

process.on('unhandledRejection', () => {
  console.log(`😡 UnhandledPromiseRejection is detected, shutting down the server`)
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  };
  process.exit(1)
});

process.on('uncaughtException', () => {
  console.log(`😡 uncaughtException is detected, shutting down the server`)
  process.exit(1);
});
