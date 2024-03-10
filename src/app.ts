import * as express from 'express';
import * as prom from 'prom-client';
import { initLogger } from './log';

import { cfg } from './config';
import * as addressController from './controllers/address';
import * as apiController from './controllers/api';
import * as depositController from './controllers/deposit';
import * as groupController from './controllers/group';
import * as nodeController from './controllers/node';
import * as withdrawController from './controllers/withdraw';

initLogger();

prom.register.setDefaultLabels({ machine: cfg.machine });
prom.collectDefaultMetrics();

const app = express();
app.use(
  express.json({
    limit: '50mb',
    verify(req: any, res, buf, encoding) {
      req.rawBody = buf;
    },
  })
);
app.use(express.raw({ type: 'application/x-protobuf' }));
app.get('/', (req, res) => res.send('Hello World!'));
app.get('/metrics', async (req, res) => {
  res.send(await prom.register.metrics());
});

// address endpoints
app.post('/address/multisig', addressController.generateMultisig);

// node endpoints
app.get('/nodes/:status', nodeController.findNodes);
app.get('/nodes', nodeController.findNodes);
app.get('/node/info/:id', nodeController.getNodeInfo);
app.get('/node/in-whitelist/:id', nodeController.nodeInWhitelist);
app.get('/node/whitelist-num', nodeController.whitelistNum);
app.get('/node/find-by-pubkey/:pubkey', nodeController.findNodeByPubKey);
app.post('/node/online-proof', nodeController.findOnlineProof);

// group endpoints
app.get('/groups', groupController.allGroups);
app.get('/group/:id', groupController.getGroup);

// deposit endpoints
app.get('/deposit/status/:id', depositController.depositStatus);
app.post('/deposit/send', depositController.sendDepositSignature);

// withdraw endpoints
app.get('/withdraw/status/:id', withdrawController.withdrawStatus);
app.get('/withdraw/estimate-fee', withdrawController.estimateWithdrawFee);
app.post('/withdraw/send', withdrawController.sendWithdrawSignature);

// node api endpoints
app.post('/api/operation', apiController.operation);

export { app };
