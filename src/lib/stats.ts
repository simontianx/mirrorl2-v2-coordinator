import {Gauge} from 'prom-client';

const nodeGauge = new Gauge({
  name: 'node',
  help: 'node stats',
  labelNames: ['type', 'id'],
});

export const nodeStats = (tp: string, id: string, val?: number) => {
  if (val !== undefined) {
    nodeGauge.set({type: tp, id}, val);
  } else {
    nodeGauge.remove({type: tp, id});
  }
};
