import * as secp from "@noble/secp256k1";
import { sha256, sha256hex} from "./hashing";

export class PrivateKey {
  constructor() {
    this.privateKey = secp.utils.randomPrivateKey();
  }
  async message(msg) {
    if (typeof msg == "string") {
      const encoder = new TextEncoder();
      msg = encoder.encode(msg);
    }
    return secp.utils.sha256(msg);
  }
  async sign(msghash) {
    return secp.sign(msghash, this.privateKey);
  }
  verify(signature, messageHash, pubkey) {
    return secp.verify(signature, messageHash, pubkey);
  }
  pubkey() {
    return secp.getPublicKey(this.privateKey);
  }
}

export class TransactionInput {
  constructor(id, out_cnt, seq) {
    this.id = id;
    this.out_cnt = out_cnt;
    this.sequence = seq;
  }
}

export class TransactionOutput {
  constructor(amount, script_pubkey) {
    this.amount = amount;
    this.script_pubkey = script_pubkey;
  }
}
