import * as secp from "@noble/secp256k1";
import { bech32 } from "bech32";
import { sha256Digest, sha256HexDigest } from "./crypto";

export const SIGHASH_ALL = 1;

export class PrivateKey {
  constructor() {
    this.privateKey = secp.utils.randomPrivateKey();
  }
  async message(msg) {
    return await sha256HexDigest(msg);
  }
  async sign(msg) {
    return await secp.sign(this.message(msg), this.privateKey);
  }
  verify(signature, messageHash) {
    return secp.verify(signature, messageHash, this.pubkey());
  }
  pubkey() {
    return secp.getPublicKey(this.privateKey);
  }
}

export class Script {
  constructor(script) {
    this.script = script
  }
  pubkey() {
    return "pub key";
  }
}

export class Witness {
  constructor(script) {
    this.script = script
  }
  pubkey() {
    return "pub key";
  }
}

let encoder = new TextEncoder();
export class Transaction {
  constructor(vin, vout) {
    this.vin = vin;
    this.vout = vout;
    this.version = 2;
    this.locktime = 1337;
    this.buffer = new Uint8Array();
  }
  update_buffer(data) {
    let buffer = encoder.encode(data);
    this.buffer = this.concat_buffer(this.buffer, buffer);
  }
  concat_buffer(b1, b2) {
    let newBuffer = new Uint8Array(b1.length + b2.length);
    newBuffer.set(b1);
    newBuffer.set(b2, b1.length);
    return newBuffer;
  }
  as_string() {
    return new TextDecoder().decode(this.buffer);
  }
  async sighash_segwit(input_index, script_pubkey, value) {
    this.update_buffer("A");
    this.update_buffer("B");
    this.update_buffer("C");
    this.update_buffer("F");
    this.update_buffer("o");
    // // check out bip-143
    // if (input_index < 0 || input_index >= this.vin.length) {
    //     raise("Invalid input index")
    // }
    // let inp = this.vin[input_index];
    // this.buffer = new Uint16Array();
    // this.update_buffer(this.version);
    // // this.update_buffer(await sha256Digest(this.hash_prevouts()));
    // // this.update_buffer(await sha256Digest(this.hash_sequence()));
    // this.update_buffer(inp.txid);
    // // this.update_buffer(inp.vout);
    // // this.update_buffer(script_pubkey);
    // // this.update_buffer(value);
    // // this.update_buffer(inp.sequence);
    // // this.update_buffer(await sha256Digest(this.hash_outputs()));
    // this.update_buffer(this.locktime);
    // this.update_buffer(SIGHASH_ALL);
    // return await sha256Digest(this.buffer);
  }
  async hash_prevouts() {
    let buffer = new Uint16Array();
    this.vin.forEach(input => {
      buffer = this.concat_buffer(buffer, new Uint16Array(input));
    });
    return await sha256Digest(buffer);
  }
  async hash_sequence() {
    let buffer = new Uint16Array();
    this.vin.forEach(input => {
      buffer = this.concat_buffer(buffer, new Uint16Array(input.sequence));
    });
    return await sha256Digest(buffer);
  }
  async hash_outputs() {
    let buffer = new Uint16Array();
    this.vout.forEach(output => {
      buffer = this.concat_buffer(buffer, new Uint16Array(output.serialize()));
    });
    return await sha256Digest(buffer);
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

export const addressToScriptPubkey = (address) => {
  // bech 32 address
  try {
    let data = bech32.decode(address);
    console.log(data);
    //# OP_1..OP_N
    //if ver > 0:
    //    ver += 0x50
    return new Script(data.prefix + data.words.length + data.words);
  } catch(err) {
    console.log("ERROR: invalid bech32 address", err);
    return null;
  }
// def address_to_scriptpubkey(addr):
//     # try with base58 address
//     try:
//         data = base58.decode_check(addr)
//         prefix = data[:1]
//         for net in NETWORKS.values():
//             if prefix == net["p2pkh"]:
//                 return Script(b"\x76\xa9\x14" + data[1:] + b"\x88\xac")
//             elif prefix == net["p2sh"]:
//                 return Script(b"\xa9\x14" + data[1:] + b"\x87")
}
