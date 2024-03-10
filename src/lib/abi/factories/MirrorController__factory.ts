/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides, Signer, utils } from "ethers";
import type { PromiseOrValue } from "../../../common";
import type {
  MirrorController,
  MirrorControllerInterface,
} from "../../../contracts/system/MirrorController";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_mbtc",
        type: "address",
      },
      {
        internalType: "address",
        name: "_coordinator",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "receiptId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "withdrawBtcAddress",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "BurnRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "receiptId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "groupBtcAddress",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "BurnVerified",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    inputs: [],
    name: "AMOUNT_IN_SATOSHI",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnMBTC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "coordinator",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract MBTC",
        name: "_mbtc",
        type: "address",
      },
      {
        internalType: "address",
        name: "_coordinator",
        type: "address",
      },
      {
        internalType: "contract ISwapRewarder",
        name: "_rewarder",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "mbtc",
    outputs: [
      {
        internalType: "contract MBTC",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mintMBTC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mintReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "receiptId",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "withdrawBtcAddress",
        type: "string",
      },
    ],
    name: "requestBurn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewarder",
    outputs: [
      {
        internalType: "contract ISwapRewarder",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "receiptId",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "group",
        type: "string",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "verified",
        type: "bool",
      },
    ],
    name: "verifyOrRevokeBurn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620011cc380380620011cc833981016040819052620000349162000146565b600180546001600160a01b038085166001600160a01b03199283161790925560038054928416929091169190911790556200007160003362000079565b50506200017e565b62000085828262000089565b5050565b6000828152602081815260408083206001600160a01b038516845290915290205460ff1662000085576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055620000e53390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b80516001600160a01b03811681146200014157600080fd5b919050565b600080604083850312156200015a57600080fd5b620001658362000129565b9150620001756020840162000129565b90509250929050565b61103e806200018e6000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c80637b4bb1c6116100a2578063a217fddf11610071578063a217fddf14610256578063ab20e8131461025e578063c0c53b8b14610271578063d547741f14610284578063dcc3e06e1461029757600080fd5b80637b4bb1c61461020a57806391d148541461021d57806398990305146102305780639a49090e1461024357600080fd5b80633095d6f7116100e95780633095d6f7146101b457806336568abe146101c757806346749cd3146101da5780635f890657146101ed578063696f41631461020057600080fd5b806301ffc9a71461011b5780630a00909714610143578063248a9ca31461016e5780632f2ff15d1461019f575b600080fd5b61012e610129366004610b6e565b6102aa565b60405190151581526020015b60405180910390f35b600354610156906001600160a01b031681565b6040516001600160a01b03909116815260200161013a565b61019161017c366004610b98565b60009081526020819052604090206001015490565b60405190815260200161013a565b6101b26101ad366004610bd6565b6102e1565b005b6101b26101c2366004610c35565b61030b565b6101b26101d5366004610bd6565b610464565b6101b26101e8366004610d11565b6104e2565b6101b26101fb366004610d3d565b610588565b610191620186a081565b600154610156906001600160a01b031681565b61012e61022b366004610bd6565b610647565b6101b261023e366004610b98565b610670565b6101b2610251366004610d11565b6106f4565b610191600081565b6101b261026c366004610d11565b610757565b6101b261027f366004610db9565b6107ba565b6101b2610292366004610bd6565b610845565b600254610156906001600160a01b031681565b60006001600160e01b03198216637965db0b60e01b14806102db57506301ffc9a760e01b6001600160e01b03198316145b92915050565b6000828152602081905260409020600101546102fc8161086a565b6103068383610877565b505050565b6003546001600160a01b0316331461033e5760405162461bcd60e51b815260040161033590610e04565b60405180910390fd5b80156103e357600154604051630852cd8d60e31b8152620186a060048201526001600160a01b03909116906342966c6890602401600060405180830381600087803b15801561038c57600080fd5b505af11580156103a0573d6000803e3d6000fd5b50505050837fd90232357c1ad1e207410849ce0a0374bac4c22771453838f285ceca745547e384846040516103d6929190610e8b565b60405180910390a261045e565b60015460405163a9059cbb60e01b81526001600160a01b038481166004830152620186a060248301529091169063a9059cbb906044016020604051808303816000875af1158015610438573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061045c9190610eb5565b505b50505050565b6001600160a01b03811633146104d45760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610335565b6104de82826108fb565b5050565b6003546001600160a01b0316331461050c5760405162461bcd60e51b815260040161033590610e04565b6002546001600160a01b0316156104de576002546040516346749cd360e01b81526001600160a01b03848116600483015260248201849052909116906346749cd3906044015b600060405180830381600087803b15801561056c57600080fd5b505af1158015610580573d6000803e3d6000fd5b505050505050565b6001546040516323b872dd60e01b8152336004820152306024820152620186a060448201526001600160a01b03909116906323b872dd906064016020604051808303816000875af11580156105e1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106059190610eb5565b50827faf29f62ec7927fddacdb365e839988b657d4af70b4cbae582c2d4cb52509285983833360405161063a93929190610ed2565b60405180910390a2505050565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b6003546001600160a01b0316331461069a5760405162461bcd60e51b815260040161033590610e04565b600154604051630852cd8d60e31b8152600481018390526001600160a01b03909116906342966c6890602401600060405180830381600087803b1580156106e057600080fd5b505af115801561045c573d6000803e3d6000fd5b6003546001600160a01b0316331461071e5760405162461bcd60e51b815260040161033590610e04565b600254604051634d24848760e11b81526001600160a01b0384811660048301526024820184905290911690639a49090e90604401610552565b6003546001600160a01b031633146107815760405162461bcd60e51b815260040161033590610e04565b6001546040516340c10f1960e01b81526001600160a01b03848116600483015260248201849052909116906340c10f1990604401610552565b6107c5600033610647565b6108065760405162461bcd60e51b8152602060048201526012602482015271726571756972652061646d696e20726f6c6560701b6044820152606401610335565b600180546001600160a01b039485166001600160a01b031991821617909155600380549385169382169390931790925560028054919093169116179055565b6000828152602081905260409020600101546108608161086a565b61030683836108fb565b6108748133610960565b50565b6108818282610647565b6104de576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556108b73390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6109058282610647565b156104de576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b61096a8282610647565b6104de57610977816109b9565b6109828360206109cb565b604051602001610993929190610f13565b60408051601f198184030181529082905262461bcd60e51b825261033591600401610f88565b60606102db6001600160a01b03831660145b606060006109da836002610fb1565b6109e5906002610fc8565b67ffffffffffffffff8111156109fd576109fd610c06565b6040519080825280601f01601f191660200182016040528015610a27576020820181803683370190505b509050600360fc1b81600081518110610a4257610a42610fdb565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110610a7157610a71610fdb565b60200101906001600160f81b031916908160001a9053506000610a95846002610fb1565b610aa0906001610fc8565b90505b6001811115610b18576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110610ad457610ad4610fdb565b1a60f81b828281518110610aea57610aea610fdb565b60200101906001600160f81b031916908160001a90535060049490941c93610b1181610ff1565b9050610aa3565b508315610b675760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610335565b9392505050565b600060208284031215610b8057600080fd5b81356001600160e01b031981168114610b6757600080fd5b600060208284031215610baa57600080fd5b5035919050565b6001600160a01b038116811461087457600080fd5b8035610bd181610bb1565b919050565b60008060408385031215610be957600080fd5b823591506020830135610bfb81610bb1565b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b801515811461087457600080fd5b8035610bd181610c1c565b60008060008060808587031215610c4b57600080fd5b84359350602085013567ffffffffffffffff80821115610c6a57600080fd5b818701915087601f830112610c7e57600080fd5b813581811115610c9057610c90610c06565b604051601f8201601f19908116603f01168101908382118183101715610cb857610cb8610c06565b816040528281528a6020848701011115610cd157600080fd5b826020860160208301376000602084830101528097505050505050610cf860408601610bc6565b9150610d0660608601610c2a565b905092959194509250565b60008060408385031215610d2457600080fd5b8235610d2f81610bb1565b946020939093013593505050565b600080600060408486031215610d5257600080fd5b83359250602084013567ffffffffffffffff80821115610d7157600080fd5b818601915086601f830112610d8557600080fd5b813581811115610d9457600080fd5b876020828501011115610da657600080fd5b6020830194508093505050509250925092565b600080600060608486031215610dce57600080fd5b8335610dd981610bb1565b92506020840135610de981610bb1565b91506040840135610df981610bb1565b809150509250925092565b6020808252601d908201527f4d6972726f72526f757465723a206e6f7420636f6f7264696e61746f72000000604082015260600190565b60005b83811015610e56578181015183820152602001610e3e565b50506000910152565b60008151808452610e77816020860160208601610e3b565b601f01601f19169290920160200192915050565b604081526000610e9e6040830185610e5f565b905060018060a01b03831660208301529392505050565b600060208284031215610ec757600080fd5b8151610b6781610c1c565b6040815282604082015282846060830137600060608483018101919091526001600160a01b03929092166020820152601f909201601f191690910101919050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351610f4b816017850160208801610e3b565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351610f7c816028840160208801610e3b565b01602801949350505050565b602081526000610b676020830184610e5f565b634e487b7160e01b600052601160045260246000fd5b80820281158282048414176102db576102db610f9b565b808201808211156102db576102db610f9b565b634e487b7160e01b600052603260045260246000fd5b60008161100057611000610f9b565b50600019019056fea264697066735822122082f0a74565ab4c8c02355ab14dc6aeeab644c04916fdac89341d1228d780f2bc64736f6c63430008180033";

type MirrorControllerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MirrorControllerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MirrorController__factory extends ContractFactory {
  constructor(...args: MirrorControllerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _mbtc: PromiseOrValue<string>,
    _coordinator: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MirrorController> {
    return super.deploy(
      _mbtc,
      _coordinator,
      overrides || {}
    ) as Promise<MirrorController>;
  }
  override getDeployTransaction(
    _mbtc: PromiseOrValue<string>,
    _coordinator: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_mbtc, _coordinator, overrides || {});
  }
  override attach(address: string): MirrorController {
    return super.attach(address) as MirrorController;
  }
  override connect(signer: Signer): MirrorController__factory {
    return super.connect(signer) as MirrorController__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MirrorControllerInterface {
    return new utils.Interface(_abi) as MirrorControllerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MirrorController {
    return new Contract(address, _abi, signerOrProvider) as MirrorController;
  }
}