import opcodes from "./opcode";
import { NET } from "./network";
import { logger, numberfromhex, numberfrombytes, hexfrombytes, hextobytes } from "./helper";
import { Script } from "./script";

export class TransactionDecoder {
  constructor(rawtx, network) {
    this.network = network;
    this.rawtx = rawtx;
    this.offset = 0;
    this.vin_count = 0;
    this.vout_count = 0;
    this.segwit = false;
    this.tx = {
      vin: [],
      vout: [],
    };
    this.decode();
    return new Transaction(this.tx);
  }

  parsescript(script){
    let s = new Script(script, this.network);
    return {
      asm: s,
      hex: hexfrombytes(script),
      type: s.type,
      address: s.address,
    };
  }
  parsebytes(size) {
    let delta = size * 2;
    let hex = this.rawtx.slice(this.offset, this.offset + delta);
    let binary = hextobytes(hex);
    logger(`parsed ${size} byte chunk @ offset ${this.offset} -> ${hex}`, 2);
    this.offset += delta;
    return binary;
  }
  parsevarint() {
    let peak = this.rawtx.slice(this.offset, this.offset + 2);
    if (peak == "fd") {
      // <= 0xffff 	fd1234 	Prefix with fd, and the next 2 bytes is the VarInt (in little-endian).
      let hex = this.rawtx.slice(this.offset+2, this.offset+2+4);
      logger(`parsed 4 byte VarInt chunk @ offset ${this.offset}`, 2);
      this.offset += 2+4;
      return numberfromhex(hex);
    }
    if (peak == "fe") {
      // <= 0xffffffff 	fe12345678 	Prefix with fe, and the next 4 bytes is the VarInt (in little-endian).
      let hex = this.rawtx.slice(this.offset+2, this.offset+2+8);
      logger(`parsed 8 byte VarInt chunk @ offset ${this.offset}`, 2);
      this.offset += 2+8;
      return numberfromhex(hex);
    }
    if (peak == "ff") {
      // <= 0xffffffffffffffff 	ff1234567890abcdef 	Prefix with ff, and the next 8 bytes is the VarInt (in little-endian).
      let hex = this.rawtx.slice(this.offset+2, this.offset+2+16);
      logger(`parsed 16 byte VarInt chunk @ offset ${this.offset}`, 2);
      this.offset += 2+16;
      return numberfromhex(hex);
    }
    if (peak == "00" && this.segwit === false) {
      this.segwit = true;
      logger(`parsed 4 byte VarInt chunk @ offset ${this.offset}`, 2);
      this.offset += 4;
      logger(`VarInt | flag: true`, 2);
      return this.parsevarint();
    }
    logger(`parsed 2 byte VarInt chunk @ offset ${this.offset} -> ${peak}`, 2);
    this.offset += 2;
    return numberfromhex(peak);
  }

  decode() {
    this.tx.version = parseInt(this.parsebytes(4).reverse().join(""));
    logger(`4 bytes reversed | version: ${this.tx.version}`, 1);
    this.vin_count = this.parsevarint();
    logger(`VarInt | vin_count: ${this.vin_count}`, 2);
    if (this.vin_count > 0) {
      for (let i = 0; i < 1; i++) {
        let input = {};
        input.txid = this.parsebytes(32).reverse();
        input.txid_hex = hexfrombytes(input.txid);
        logger(`32 bytes reversed | input ${i} txid: ${input.txid_hex}`, 1);
        input.vout = numberfrombytes(this.parsebytes(4).reverse());
        logger(`4 bytes reversed | input ${i} vout: ${input.vout}`,1);
        let script_size = this.parsevarint();
        logger(`VarInt | input ${i} script_size: ${script_size}`,2);
        let script = this.parsebytes(script_size);
        input.script = script;
        input.scriptSig = this.parsescript(script);
        logger(`${script_size} bytes | input ${i} scriptSig: ${input.scriptSig.hex}`, 1);
        input.sequence = this.parsebytes(4).reverse();
        input.sequence_hex = hexfrombytes(input.sequence);
        input.sequence_number = numberfrombytes(input.sequence);
        logger(`4 bytes reversed | input ${i} sequence: ${input.sequence_hex}`, 1);
        this.tx.vin.push(input);
      }
    }

    this.vout_count = this.parsevarint();
    logger(`VarInt | vout_count: ${this.vout_count}`, 2);
    if (this.vout_count > 0 && this.vout_count < 0xffff) {
      for (let i = 0; i < this.vout_count; i++) {
        let output = {
          n: i
        };
        let output_value_binary = this.parsebytes(8).reverse();
        output.value = numberfrombytes(output_value_binary) / 100000000;
        logger(`8 bytes reversed | ouput ${i} value: ${output.value}`, 1);
        let script_pub_key_size = this.parsevarint();
        logger(`VarInt | output ${i} script_pub_key_size: ${script_pub_key_size}`, 2);
        let script = this.parsebytes(script_pub_key_size);
        output.script = script;
        output.scriptPubKey = this.parsescript(script);
        logger(`${script_pub_key_size} bytes | output ${i} script_pub_key: ${output.scriptPubKey.hex}`, 1);
        this.tx.vout.push(output);
      }
    }
    if (this.segwit && this.vin_count > 0) {
        this.tx.vin.forEach((input) => {
          let witness_stack = this.parsevarint();
          if (witness_stack > 0) {
            input.txinwitness = [];
            input.txinwitness_hex = [];
            for (let i = 0; i < witness_stack; i++) {
              let witness_length = this.parsevarint();
              let witness = this.parsebytes(witness_length);
              input.txinwitness.push(witness);
              let witness_hex = hexfrombytes(witness);
              input.txinwitness_hex.push(witness_hex);
              logger(`${witness_length} bytes | input ${0} txwitness: ${witness_hex}`, 1);
            }
          }
        });
    }
    this.tx.locktime = parseInt(this.parsebytes(4).reverse().join(""));
    logger(`4 bytes reversed | locktime: ${this.tx.locktime}`, 1);
  }
}
