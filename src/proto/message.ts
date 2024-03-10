/* eslint-disable */
import { util, configure, Writer, Reader } from 'protobufjs/minimal';
import * as Long from 'long';

export const protobufPackage = 'message';

export interface Request {
  data: Uint8Array;
  signature: Uint8Array;
}

export interface Operation {
  nodeId: string;
  heartbeat: Heartbeat | undefined;
  depositSignature: DepositSignature | undefined;
  withdrawRequest: WithdrawRequest | undefined;
  withdrawSignature: WithdrawSignature | undefined;
  refundRequest: RefundRequest | undefined;
  refundSignature: RefundSignature | undefined;
}

export interface Heartbeat {
  clientInfo: string;
  btcPubKey: Uint8Array;
  email: string;
  groupNum?: number | undefined;
  syncMinutes?: number | undefined;
}

export interface OnlineProof {
  timestamp: number;
  signature: string;
}

export interface DepositSignature {
  receiptId: string;
  txId: string;
  blockHeight: number;
  signature: Uint8Array;
}

export interface WithdrawRequest {
  receiptId: string;
}

export interface Withdraw {
  psbt: string;
}

export interface WithdrawSignature {
  receiptId: string;
  psbt: string;
}

export interface RefundRequest {
  txId: string;
}

export interface Refund {
  psbt: string;
}

export interface RefundSignature {
  txId: string;
  psbt: string;
}

const baseRequest: object = {};

export const Request = {
  encode(message: Request, writer: Writer = Writer.create()): Writer {
    if (message.data.length !== 0) {
      writer.uint32(10).bytes(message.data);
    }
    if (message.signature.length !== 0) {
      writer.uint32(18).bytes(message.signature);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Request {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseRequest } as Request;
    message.data = new Uint8Array();
    message.signature = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.data = reader.bytes();
          break;
        case 2:
          message.signature = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Request {
    const message = { ...baseRequest } as Request;
    message.data = new Uint8Array();
    message.signature = new Uint8Array();
    if (object.data !== undefined && object.data !== null) {
      message.data = bytesFromBase64(object.data);
    }
    if (object.signature !== undefined && object.signature !== null) {
      message.signature = bytesFromBase64(object.signature);
    }
    return message;
  },

  toJSON(message: Request): unknown {
    const obj: any = {};
    message.data !== undefined &&
      (obj.data = base64FromBytes(
        message.data !== undefined ? message.data : new Uint8Array()
      ));
    message.signature !== undefined &&
      (obj.signature = base64FromBytes(
        message.signature !== undefined ? message.signature : new Uint8Array()
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<Request>): Request {
    const message = { ...baseRequest } as Request;
    if (object.data !== undefined && object.data !== null) {
      message.data = object.data;
    } else {
      message.data = new Uint8Array();
    }
    if (object.signature !== undefined && object.signature !== null) {
      message.signature = object.signature;
    } else {
      message.signature = new Uint8Array();
    }
    return message;
  },
};

const baseOperation: object = { nodeId: '' };

export const Operation = {
  encode(message: Operation, writer: Writer = Writer.create()): Writer {
    if (message.nodeId !== '') {
      writer.uint32(10).string(message.nodeId);
    }
    if (message.heartbeat !== undefined) {
      Heartbeat.encode(message.heartbeat, writer.uint32(90).fork()).ldelim();
    }
    if (message.depositSignature !== undefined) {
      DepositSignature.encode(
        message.depositSignature,
        writer.uint32(98).fork()
      ).ldelim();
    }
    if (message.withdrawRequest !== undefined) {
      WithdrawRequest.encode(
        message.withdrawRequest,
        writer.uint32(106).fork()
      ).ldelim();
    }
    if (message.withdrawSignature !== undefined) {
      WithdrawSignature.encode(
        message.withdrawSignature,
        writer.uint32(114).fork()
      ).ldelim();
    }
    if (message.refundRequest !== undefined) {
      RefundRequest.encode(
        message.refundRequest,
        writer.uint32(122).fork()
      ).ldelim();
    }
    if (message.refundSignature !== undefined) {
      RefundSignature.encode(
        message.refundSignature,
        writer.uint32(130).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Operation {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseOperation } as Operation;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.nodeId = reader.string();
          break;
        case 11:
          message.heartbeat = Heartbeat.decode(reader, reader.uint32());
          break;
        case 12:
          message.depositSignature = DepositSignature.decode(
            reader,
            reader.uint32()
          );
          break;
        case 13:
          message.withdrawRequest = WithdrawRequest.decode(
            reader,
            reader.uint32()
          );
          break;
        case 14:
          message.withdrawSignature = WithdrawSignature.decode(
            reader,
            reader.uint32()
          );
          break;
        case 15:
          message.refundRequest = RefundRequest.decode(reader, reader.uint32());
          break;
        case 16:
          message.refundSignature = RefundSignature.decode(
            reader,
            reader.uint32()
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Operation {
    const message = { ...baseOperation } as Operation;
    if (object.nodeId !== undefined && object.nodeId !== null) {
      message.nodeId = String(object.nodeId);
    } else {
      message.nodeId = '';
    }
    if (object.heartbeat !== undefined && object.heartbeat !== null) {
      message.heartbeat = Heartbeat.fromJSON(object.heartbeat);
    } else {
      message.heartbeat = undefined;
    }
    if (
      object.depositSignature !== undefined &&
      object.depositSignature !== null
    ) {
      message.depositSignature = DepositSignature.fromJSON(
        object.depositSignature
      );
    } else {
      message.depositSignature = undefined;
    }
    if (
      object.withdrawRequest !== undefined &&
      object.withdrawRequest !== null
    ) {
      message.withdrawRequest = WithdrawRequest.fromJSON(
        object.withdrawRequest
      );
    } else {
      message.withdrawRequest = undefined;
    }
    if (
      object.withdrawSignature !== undefined &&
      object.withdrawSignature !== null
    ) {
      message.withdrawSignature = WithdrawSignature.fromJSON(
        object.withdrawSignature
      );
    } else {
      message.withdrawSignature = undefined;
    }
    if (object.refundRequest !== undefined && object.refundRequest !== null) {
      message.refundRequest = RefundRequest.fromJSON(object.refundRequest);
    } else {
      message.refundRequest = undefined;
    }
    if (
      object.refundSignature !== undefined &&
      object.refundSignature !== null
    ) {
      message.refundSignature = RefundSignature.fromJSON(
        object.refundSignature
      );
    } else {
      message.refundSignature = undefined;
    }
    return message;
  },

  toJSON(message: Operation): unknown {
    const obj: any = {};
    message.nodeId !== undefined && (obj.nodeId = message.nodeId);
    message.heartbeat !== undefined &&
      (obj.heartbeat = message.heartbeat
        ? Heartbeat.toJSON(message.heartbeat)
        : undefined);
    message.depositSignature !== undefined &&
      (obj.depositSignature = message.depositSignature
        ? DepositSignature.toJSON(message.depositSignature)
        : undefined);
    message.withdrawRequest !== undefined &&
      (obj.withdrawRequest = message.withdrawRequest
        ? WithdrawRequest.toJSON(message.withdrawRequest)
        : undefined);
    message.withdrawSignature !== undefined &&
      (obj.withdrawSignature = message.withdrawSignature
        ? WithdrawSignature.toJSON(message.withdrawSignature)
        : undefined);
    message.refundRequest !== undefined &&
      (obj.refundRequest = message.refundRequest
        ? RefundRequest.toJSON(message.refundRequest)
        : undefined);
    message.refundSignature !== undefined &&
      (obj.refundSignature = message.refundSignature
        ? RefundSignature.toJSON(message.refundSignature)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Operation>): Operation {
    const message = { ...baseOperation } as Operation;
    if (object.nodeId !== undefined && object.nodeId !== null) {
      message.nodeId = object.nodeId;
    } else {
      message.nodeId = '';
    }
    if (object.heartbeat !== undefined && object.heartbeat !== null) {
      message.heartbeat = Heartbeat.fromPartial(object.heartbeat);
    } else {
      message.heartbeat = undefined;
    }
    if (
      object.depositSignature !== undefined &&
      object.depositSignature !== null
    ) {
      message.depositSignature = DepositSignature.fromPartial(
        object.depositSignature
      );
    } else {
      message.depositSignature = undefined;
    }
    if (
      object.withdrawRequest !== undefined &&
      object.withdrawRequest !== null
    ) {
      message.withdrawRequest = WithdrawRequest.fromPartial(
        object.withdrawRequest
      );
    } else {
      message.withdrawRequest = undefined;
    }
    if (
      object.withdrawSignature !== undefined &&
      object.withdrawSignature !== null
    ) {
      message.withdrawSignature = WithdrawSignature.fromPartial(
        object.withdrawSignature
      );
    } else {
      message.withdrawSignature = undefined;
    }
    if (object.refundRequest !== undefined && object.refundRequest !== null) {
      message.refundRequest = RefundRequest.fromPartial(object.refundRequest);
    } else {
      message.refundRequest = undefined;
    }
    if (
      object.refundSignature !== undefined &&
      object.refundSignature !== null
    ) {
      message.refundSignature = RefundSignature.fromPartial(
        object.refundSignature
      );
    } else {
      message.refundSignature = undefined;
    }
    return message;
  },
};

const baseHeartbeat: object = { clientInfo: '', email: '' };

export const Heartbeat = {
  encode(message: Heartbeat, writer: Writer = Writer.create()): Writer {
    if (message.clientInfo !== '') {
      writer.uint32(10).string(message.clientInfo);
    }
    if (message.btcPubKey.length !== 0) {
      writer.uint32(18).bytes(message.btcPubKey);
    }
    if (message.email !== '') {
      writer.uint32(26).string(message.email);
    }
    if (message.groupNum !== undefined) {
      writer.uint32(32).uint64(message.groupNum);
    }
    if (message.syncMinutes !== undefined) {
      writer.uint32(40).uint64(message.syncMinutes);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Heartbeat {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseHeartbeat } as Heartbeat;
    message.btcPubKey = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.clientInfo = reader.string();
          break;
        case 2:
          message.btcPubKey = reader.bytes();
          break;
        case 3:
          message.email = reader.string();
          break;
        case 4:
          message.groupNum = longToNumber(reader.uint64() as Long);
          break;
        case 5:
          message.syncMinutes = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Heartbeat {
    const message = { ...baseHeartbeat } as Heartbeat;
    message.btcPubKey = new Uint8Array();
    if (object.clientInfo !== undefined && object.clientInfo !== null) {
      message.clientInfo = String(object.clientInfo);
    } else {
      message.clientInfo = '';
    }
    if (object.btcPubKey !== undefined && object.btcPubKey !== null) {
      message.btcPubKey = bytesFromBase64(object.btcPubKey);
    }
    if (object.email !== undefined && object.email !== null) {
      message.email = String(object.email);
    } else {
      message.email = '';
    }
    if (object.groupNum !== undefined && object.groupNum !== null) {
      message.groupNum = Number(object.groupNum);
    } else {
      message.groupNum = undefined;
    }
    if (object.syncMinutes !== undefined && object.syncMinutes !== null) {
      message.syncMinutes = Number(object.syncMinutes);
    } else {
      message.syncMinutes = undefined;
    }
    return message;
  },

  toJSON(message: Heartbeat): unknown {
    const obj: any = {};
    message.clientInfo !== undefined && (obj.clientInfo = message.clientInfo);
    message.btcPubKey !== undefined &&
      (obj.btcPubKey = base64FromBytes(
        message.btcPubKey !== undefined ? message.btcPubKey : new Uint8Array()
      ));
    message.email !== undefined && (obj.email = message.email);
    message.groupNum !== undefined && (obj.groupNum = message.groupNum);
    message.syncMinutes !== undefined &&
      (obj.syncMinutes = message.syncMinutes);
    return obj;
  },

  fromPartial(object: DeepPartial<Heartbeat>): Heartbeat {
    const message = { ...baseHeartbeat } as Heartbeat;
    if (object.clientInfo !== undefined && object.clientInfo !== null) {
      message.clientInfo = object.clientInfo;
    } else {
      message.clientInfo = '';
    }
    if (object.btcPubKey !== undefined && object.btcPubKey !== null) {
      message.btcPubKey = object.btcPubKey;
    } else {
      message.btcPubKey = new Uint8Array();
    }
    if (object.email !== undefined && object.email !== null) {
      message.email = object.email;
    } else {
      message.email = '';
    }
    if (object.groupNum !== undefined && object.groupNum !== null) {
      message.groupNum = object.groupNum;
    } else {
      message.groupNum = undefined;
    }
    if (object.syncMinutes !== undefined && object.syncMinutes !== null) {
      message.syncMinutes = object.syncMinutes;
    } else {
      message.syncMinutes = undefined;
    }
    return message;
  },
};

const baseOnlineProof: object = { timestamp: 0, signature: '' };

export const OnlineProof = {
  encode(message: OnlineProof, writer: Writer = Writer.create()): Writer {
    if (message.timestamp !== 0) {
      writer.uint32(8).uint64(message.timestamp);
    }
    if (message.signature !== '') {
      writer.uint32(18).string(message.signature);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): OnlineProof {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseOnlineProof } as OnlineProof;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.timestamp = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.signature = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): OnlineProof {
    const message = { ...baseOnlineProof } as OnlineProof;
    if (object.timestamp !== undefined && object.timestamp !== null) {
      message.timestamp = Number(object.timestamp);
    } else {
      message.timestamp = 0;
    }
    if (object.signature !== undefined && object.signature !== null) {
      message.signature = String(object.signature);
    } else {
      message.signature = '';
    }
    return message;
  },

  toJSON(message: OnlineProof): unknown {
    const obj: any = {};
    message.timestamp !== undefined && (obj.timestamp = message.timestamp);
    message.signature !== undefined && (obj.signature = message.signature);
    return obj;
  },

  fromPartial(object: DeepPartial<OnlineProof>): OnlineProof {
    const message = { ...baseOnlineProof } as OnlineProof;
    if (object.timestamp !== undefined && object.timestamp !== null) {
      message.timestamp = object.timestamp;
    } else {
      message.timestamp = 0;
    }
    if (object.signature !== undefined && object.signature !== null) {
      message.signature = object.signature;
    } else {
      message.signature = '';
    }
    return message;
  },
};

const baseDepositSignature: object = { receiptId: '', txId: '', blockHeight: 0 };

export const DepositSignature = {
  encode(message: DepositSignature, writer: Writer = Writer.create()): Writer {
    if (message.receiptId !== '') {
      writer.uint32(10).string(message.receiptId);
    }
    if (message.txId !== '') {
      writer.uint32(18).string(message.txId);
    }
    if (message.blockHeight !== 0) {
      writer.uint32(24).uint64(message.blockHeight);
    }
    if (message.signature.length !== 0) {
      writer.uint32(34).bytes(message.signature);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): DepositSignature {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDepositSignature } as DepositSignature;
    message.signature = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.receiptId = reader.string();
          break;
        case 2:
          message.txId = reader.string();
          break;
        case 3:
          message.blockHeight = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.signature = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DepositSignature {
    const message = { ...baseDepositSignature } as DepositSignature;
    message.signature = new Uint8Array();
    if (object.receiptId !== undefined && object.receiptId !== null) {
      message.receiptId = String(object.receiptId);
    } else {
      message.receiptId = '';
    }
    if (object.txId !== undefined && object.txId !== null) {
      message.txId = String(object.txId);
    } else {
      message.txId = '';
    }
    if (object.blockHeight !== undefined && object.blockHeight !== null) {
      message.blockHeight = Number(object.blockHeight);
    } else {
      message.blockHeight = 0;
    }
    if (object.signature !== undefined && object.signature !== null) {
      message.signature = bytesFromBase64(object.signature);
    }
    return message;
  },

  toJSON(message: DepositSignature): unknown {
    const obj: any = {};
    message.receiptId !== undefined && (obj.receiptId = message.receiptId);
    message.txId !== undefined && (obj.txId = message.txId);
    message.blockHeight !== undefined &&
      (obj.blockHeight = message.blockHeight);
    message.signature !== undefined &&
      (obj.signature = base64FromBytes(
        message.signature !== undefined ? message.signature : new Uint8Array()
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<DepositSignature>): DepositSignature {
    const message = { ...baseDepositSignature } as DepositSignature;
    if (object.receiptId !== undefined && object.receiptId !== null) {
      message.receiptId = object.receiptId;
    } else {
      message.receiptId = '';
    }
    if (object.txId !== undefined && object.txId !== null) {
      message.txId = object.txId;
    } else {
      message.txId = '';
    }
    if (object.blockHeight !== undefined && object.blockHeight !== null) {
      message.blockHeight = object.blockHeight;
    } else {
      message.blockHeight = 0;
    }
    if (object.signature !== undefined && object.signature !== null) {
      message.signature = object.signature;
    } else {
      message.signature = new Uint8Array();
    }
    return message;
  },
};

const baseWithdrawRequest: object = { receiptId: '' };

export const WithdrawRequest = {
  encode(message: WithdrawRequest, writer: Writer = Writer.create()): Writer {
    if (message.receiptId !== '') {
      writer.uint32(10).string(message.receiptId);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): WithdrawRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseWithdrawRequest } as WithdrawRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.receiptId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): WithdrawRequest {
    const message = { ...baseWithdrawRequest } as WithdrawRequest;
    if (object.receiptId !== undefined && object.receiptId !== null) {
      message.receiptId = String(object.receiptId);
    } else {
      message.receiptId = '';
    }
    return message;
  },

  toJSON(message: WithdrawRequest): unknown {
    const obj: any = {};
    message.receiptId !== undefined && (obj.receiptId = message.receiptId);
    return obj;
  },

  fromPartial(object: DeepPartial<WithdrawRequest>): WithdrawRequest {
    const message = { ...baseWithdrawRequest } as WithdrawRequest;
    if (object.receiptId !== undefined && object.receiptId !== null) {
      message.receiptId = object.receiptId;
    } else {
      message.receiptId = '';
    }
    return message;
  },
};

const baseWithdraw: object = { psbt: '' };

export const Withdraw = {
  encode(message: Withdraw, writer: Writer = Writer.create()): Writer {
    if (message.psbt !== '') {
      writer.uint32(10).string(message.psbt);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Withdraw {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseWithdraw } as Withdraw;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.psbt = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Withdraw {
    const message = { ...baseWithdraw } as Withdraw;
    if (object.psbt !== undefined && object.psbt !== null) {
      message.psbt = String(object.psbt);
    } else {
      message.psbt = '';
    }
    return message;
  },

  toJSON(message: Withdraw): unknown {
    const obj: any = {};
    message.psbt !== undefined && (obj.psbt = message.psbt);
    return obj;
  },

  fromPartial(object: DeepPartial<Withdraw>): Withdraw {
    const message = { ...baseWithdraw } as Withdraw;
    if (object.psbt !== undefined && object.psbt !== null) {
      message.psbt = object.psbt;
    } else {
      message.psbt = '';
    }
    return message;
  },
};

const baseWithdrawSignature: object = { receiptId: '', psbt: '' };

export const WithdrawSignature = {
  encode(message: WithdrawSignature, writer: Writer = Writer.create()): Writer {
    if (message.receiptId !== '') {
      writer.uint32(10).string(message.receiptId);
    }
    if (message.psbt !== '') {
      writer.uint32(18).string(message.psbt);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): WithdrawSignature {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseWithdrawSignature } as WithdrawSignature;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.receiptId = reader.string();
          break;
        case 2:
          message.psbt = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): WithdrawSignature {
    const message = { ...baseWithdrawSignature } as WithdrawSignature;
    if (object.receiptId !== undefined && object.receiptId !== null) {
      message.receiptId = String(object.receiptId);
    } else {
      message.receiptId = '';
    }
    if (object.psbt !== undefined && object.psbt !== null) {
      message.psbt = String(object.psbt);
    } else {
      message.psbt = '';
    }
    return message;
  },

  toJSON(message: WithdrawSignature): unknown {
    const obj: any = {};
    message.receiptId !== undefined && (obj.receiptId = message.receiptId);
    message.psbt !== undefined && (obj.psbt = message.psbt);
    return obj;
  },

  fromPartial(object: DeepPartial<WithdrawSignature>): WithdrawSignature {
    const message = { ...baseWithdrawSignature } as WithdrawSignature;
    if (object.receiptId !== undefined && object.receiptId !== null) {
      message.receiptId = object.receiptId;
    } else {
      message.receiptId = '';
    }
    if (object.psbt !== undefined && object.psbt !== null) {
      message.psbt = object.psbt;
    } else {
      message.psbt = '';
    }
    return message;
  },
};

const baseRefundRequest: object = { txId: '' };

export const RefundRequest = {
  encode(message: RefundRequest, writer: Writer = Writer.create()): Writer {
    if (message.txId !== '') {
      writer.uint32(10).string(message.txId);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): RefundRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseRefundRequest } as RefundRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.txId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RefundRequest {
    const message = { ...baseRefundRequest } as RefundRequest;
    if (object.txId !== undefined && object.txId !== null) {
      message.txId = String(object.txId);
    } else {
      message.txId = '';
    }
    return message;
  },

  toJSON(message: RefundRequest): unknown {
    const obj: any = {};
    message.txId !== undefined && (obj.txId = message.txId);
    return obj;
  },

  fromPartial(object: DeepPartial<RefundRequest>): RefundRequest {
    const message = { ...baseRefundRequest } as RefundRequest;
    if (object.txId !== undefined && object.txId !== null) {
      message.txId = object.txId;
    } else {
      message.txId = '';
    }
    return message;
  },
};

const baseRefund: object = { psbt: '' };

export const Refund = {
  encode(message: Refund, writer: Writer = Writer.create()): Writer {
    if (message.psbt !== '') {
      writer.uint32(10).string(message.psbt);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Refund {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseRefund } as Refund;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.psbt = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Refund {
    const message = { ...baseRefund } as Refund;
    if (object.psbt !== undefined && object.psbt !== null) {
      message.psbt = String(object.psbt);
    } else {
      message.psbt = '';
    }
    return message;
  },

  toJSON(message: Refund): unknown {
    const obj: any = {};
    message.psbt !== undefined && (obj.psbt = message.psbt);
    return obj;
  },

  fromPartial(object: DeepPartial<Refund>): Refund {
    const message = { ...baseRefund } as Refund;
    if (object.psbt !== undefined && object.psbt !== null) {
      message.psbt = object.psbt;
    } else {
      message.psbt = '';
    }
    return message;
  },
};

const baseRefundSignature: object = { txId: '', psbt: '' };

export const RefundSignature = {
  encode(message: RefundSignature, writer: Writer = Writer.create()): Writer {
    if (message.txId !== '') {
      writer.uint32(10).string(message.txId);
    }
    if (message.psbt !== '') {
      writer.uint32(18).string(message.psbt);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): RefundSignature {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseRefundSignature } as RefundSignature;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.txId = reader.string();
          break;
        case 2:
          message.psbt = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RefundSignature {
    const message = { ...baseRefundSignature } as RefundSignature;
    if (object.txId !== undefined && object.txId !== null) {
      message.txId = String(object.txId);
    } else {
      message.txId = '';
    }
    if (object.psbt !== undefined && object.psbt !== null) {
      message.psbt = String(object.psbt);
    } else {
      message.psbt = '';
    }
    return message;
  },

  toJSON(message: RefundSignature): unknown {
    const obj: any = {};
    message.txId !== undefined && (obj.txId = message.txId);
    message.psbt !== undefined && (obj.psbt = message.psbt);
    return obj;
  },

  fromPartial(object: DeepPartial<RefundSignature>): RefundSignature {
    const message = { ...baseRefundSignature } as RefundSignature;
    if (object.txId !== undefined && object.txId !== null) {
      message.txId = object.txId;
    } else {
      message.txId = '';
    }
    if (object.psbt !== undefined && object.psbt !== null) {
      message.psbt = object.psbt;
    } else {
      message.psbt = '';
    }
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof self !== 'undefined') return self;
  if (typeof window !== 'undefined') return window;
  if (typeof global !== 'undefined') return global;
  throw 'Unable to locate global object';
})();

const atob: (b64: string) => string =
  globalThis.atob ||
  (b64 => globalThis.Buffer.from(b64, 'base64').toString('binary'));
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  (bin => globalThis.Buffer.from(bin, 'binary').toString('base64'));
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  for (let i = 0; i < arr.byteLength; ++i) {
    bin.push(String.fromCharCode(arr[i]));
  }
  return btoa(bin.join(''));
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error('Value is larger than Number.MAX_SAFE_INTEGER');
  }
  return long.toNumber();
}

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
