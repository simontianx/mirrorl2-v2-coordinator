import { Event } from 'ethers';
import { cfg } from '../config';
import * as contract from '../lib/contract';
import * as time from '../lib/time';
import * as groupService from './group';
import * as nodeService from './node';

const handleEvents = async (events: contract.AnyEventType[]) => {
  for (const e of events) {
    if (e.removed) {
      continue;
    }

    try {
      const parsed = contract.mirrorSystem.interface.parseLog(e);
      e.event = parsed.name;
      (e as Event).args = parsed.args;

      switch (e.event as contract.AllEvents) {
        case 'GroupAdded':
          await groupService.onGroupAdded(
            e as contract.EventType<'GroupAdded'>
          );
          break;
        case 'GroupDeleted':
          await groupService.onGroupDeleted(
            e as contract.EventType<'GroupDeleted'>
          );
          break;
      }
    } catch (err) {
      console.error(err);
    }
  }
};

const run = async () => {
  const mirrorSystem = contract.mirrorSystem;
  let fromBlock = cfg.eth.mirrorSystemStartBlock;
  let curBlock = 0;

  contract.nodeReward.on(
    contract.nodeReward.filters.Accuse(null, null, null, null),
    async id => {
      try {
        await nodeService.onAccuse(id);
      } catch (err) {
        console.log(err);
      }
    }
  );

  for (; ;) {
    try {
      if (curBlock === 0 || fromBlock > curBlock) {
        curBlock = await mirrorSystem.provider.getBlockNumber();
      }

      if (fromBlock <= curBlock) {
        const toBlock = Math.min(fromBlock + 5000 - 1, curBlock);
        const events = await mirrorSystem.queryFilter(
          {
            address: mirrorSystem.address,
            topics: [
              [
                mirrorSystem.interface.getEventTopic('GroupAdded'),
                mirrorSystem.interface.getEventTopic('GroupDeleted'),
              ],
            ],
          },
          fromBlock,
          toBlock
        );

        if (events.length > 0) {
          console.log(
            `blocks: ${fromBlock} - ${toBlock}, num: ${events.length}`
          );
        }

        await handleEvents(events);
        fromBlock = toBlock + 1;
      }
    } catch (err) {
      console.error('queryFilter err: ', err);
    }

    await time.sleep(60);
  }
};

export const init = async () => {
  setTimeout(run, 0);
};
