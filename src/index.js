import { hexlify, unhexlify, b58lify, unb58lify } from "./hashing";
import { getMempoolBlockheight, getMempoolLockupTx } from "./mempool";
import { randombytes, sha256HexDigest, sha256Digest } from "./crypto";
import {
  Transaction, TransactionInput, TransactionOutput, PrivateKey,
  Witness, Script, addressToScriptPubkey, SIGHASH_ALL
} from "./bitcoin";

import { testTx, testRawTx } from "./testdata";
console.log(testRawTx);


class TransactionDecoder {
  constructor(rawtx) {
    this.rawtx = rawtx;
    this.offset = 0;
    this.tx = {
      vins: [],
      vouts: [],
    };
    this.decode();
  }
  parsebytes(size) {
    let delta = size * 2;
    let range = this.rawtx.slice(this.offset, this.offset + delta);
    let binary = [];
    for (let i = 0; i < range.length; i+=2) {
      let hex = range[i]+range[i+1];
      binary.push(parseInt(hex, 16));
    }
    this.offset += delta;
    return binary;
  }
  frombytes(bytes) {
    let hex = "";
    for (let i = 0; i < bytes.length; i++) {
      hex += bytes[i].toString(16).padStart(2, 0);
    }
    return hex;
  }
  getlength() {
    let peak = this.rawtx.slice(this.offset, this.offset + 2);
    if (peak == "fd") {
      // <= 0xffff 	fd1234 	Prefix with fd, and the next 2 bytes is the VarInt (in little-endian).
      let length = this.rawtx.slice(this.offset+2, this.offset+2+4);
      this.offset += 2+4;
      return parseInt(length, 16);
    }
    if (peak == "fe") {
      // <= 0xffffffff 	fe12345678 	Prefix with fe, and the next 4 bytes is the VarInt (in little-endian).
      let length = this.rawtx.slice(this.offset+2, this.offset+2+8);
      this.offset += 2+8;
      return parseInt(length, 16);
    }
    if (peak == "ff") {
      // <= 0xffffffffffffffff 	ff1234567890abcdef 	Prefix with ff, and the next 8 bytes is the VarInt (in little-endian).
      let length = this.rawtx.slice(this.offset+2, this.offset+2+16);
      this.offset += 2+16;
      return parseInt(length, 16);
    }
    // Varint = 6a = 106 bytes
    this.offset += 2;
    return parseInt(peak, 16);
  }
  decode() {
    this.tx.version = parseInt(this.parsebytes(4).reverse().join(""));
    console.log(`4 bytes reversed | version: ${this.tx.version}`);
    this.tx.vin_count = this.getlength();
    console.log(`VarInt | vin_count: ${this.tx.vin_count}`);
    for (let i = 0; i < this.tx.vin_count; i++) {
      let input = {};
      input.txid = this.parsebytes(32).reverse();
      input.txid_hex = this.frombytes(input.txid);
      console.log(`32 bytes reversed | input ${i} txid: ${input.txid_hex}`, input.txid);
      input.vout = parseInt(this.parsebytes(4).reverse().join());
      console.log(`4 bytes reversed | input ${i} vout: ${parseInt(input.vout)}`);
      let script_sig_size = this.getlength();
      console.log(`VarInt | input ${i} script_sig_size: ${script_sig_size}`);
      input.script_sig = this.parsebytes(script_sig_size);
      input.script_sig_hex = this.frombytes(input.script_sig);
      console.log(`${script_sig_size} bytes | input ${i} script_sig: ${input.script_sig_hex}`, input.script_sig);
      input.sequence = this.parsebytes(4).reverse();
      input.sequence_hex = this.frombytes(input.sequence);
      console.log(`4 bytes reversed | input ${i} sequence: ${input.sequence_hex}`, input.sequence);
      this.tx.vins.push(input);
    }

    this.tx.vout_count = this.getlength();
    console.log(`VarInt | vout_count: ${this.tx.vout_count}`);
    for (let i = 0; i < this.tx.vout_count; i++) {
      let output = {};
      output.amount = parseInt(this.parsebytes(8).reverse().join(""));
      console.log(`8 bytes reversed | ouput ${i} amount: ${output.amount}`);
      let script_pub_key_size = this.getlength();
      console.log(`VarInt | output ${i} script_pub_key_size: ${script_pub_key_size}`);
      output.script_pub_key = this.parsebytes(script_pub_key_size);
      output.script_pub_key_hex = this.frombytes(output.script_pub_key);
      console.log(`${script_pub_key_size} bytes | output ${i} script_pub_key: ${output.script_pub_key_hex}`, output.script_pub_key);
      this.tx.vouts.push(output);
    }
    this.tx.locktime = parseInt(this.parsebytes(4).reverse().join(""));
    console.log(`4 bytes reversed | locktime: ${this.tx.locktime}`);
  }
}

let decoder = new TransactionDecoder(testRawTx);
let decoder2 = new TransactionDecoder("0200000000010153f810d6974266a978d79d7a5272d847c4ad6ee45f59a6fbf1583b9597b6b3900100000000feffffff02c40b69ee00000000160014dba4b7349f036fd648e44a44f690aebc9d00861db0ad01000000000017a9144139a0653d270a9db20244ec9d35c590896ee780870247304402202bac67e8356d64801707c972de5f7f23f98a6c870cf2aa6a722d8efc72fcaed10220335f4d5da9d3bdd1e719259bdbb96e1149691d6ac525158efc656aed8e62357601210357a1a380b658477b2f6c54d6955f2ba85a8ff9853ab7a218a2d6ceb5eafadce600000000");
console.log(decoder2.tx);
