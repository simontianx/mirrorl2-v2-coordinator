import { AddressInfo } from 'net';
import { app } from './app';
import { connect } from './db/ormconfig';
import * as contract from './lib/contract';
import * as depositService from './services/deposit';
import * as eventService from './services/event';
import * as nodeService from './services/node';

(async () => {
  await connect();
  await contract.init();
  await eventService.init();
  await nodeService.init();
  await depositService.init();
  console.log('init ok');
})()
  .then(() => {
    const server = app.listen(5000, '0.0.0.0', () => {
      const { port, address } = server.address() as AddressInfo;

      console.log(`Server listening on: http://${address}:${port}`);
    });
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
