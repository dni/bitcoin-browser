import o from "./opcode";

export class TransactionDecoder {
  constructor(rawtx) {
    this.loglevel = 2;
    this.loglevels = [ "INFO", "DEBUG", "VERBOSE" ];
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
    this.log(this.tx);

  }
  log(log, lvl = 0) {
    if(this.loglevel >= lvl) {
      if (lvl == 0) {
        console.log(log);
      } else {
        console.log(this.loglevels[lvl], "::", log);
      }
    }
  }
  parsescript(script){
    let scripttype = "pubkey";
    return {
      asm: script,
      hex: this.hexfrombytes(script),
      type: scripttype,
      script: [o.OP_FALSE],
    };
  }
  parsebytes(size) {
    let delta = size * 2;
    let range = this.rawtx.slice(this.offset, this.offset + delta);
    let binary = [];
    let hex = "";
    for (let i = 0; i < range.length; i+=2) {
      let byte = range[i]+range[i+1];
      hex += byte;
      binary.push(parseInt(byte, 16));
    }
    this.log(`parsed ${size} byte chunk @ offset ${this.offset} -> ${hex}`, 2);
    this.offset += delta;
    return binary;
  }
  hexfrombytes(bytes) {
    let hex = "";
    for (let i = 0; i < bytes.length; i++) {
      hex += bytes[i].toString(16).padStart(2, 0);
    }
    return hex;
  }
  numberfrombytes(bytes) {
    return parseInt(this.hexfrombytes(bytes), 16);
  }
  getlength() {
    let peak = this.rawtx.slice(this.offset, this.offset + 2);
    if (peak == "fd") {
      // <= 0xffff 	fd1234 	Prefix with fd, and the next 2 bytes is the VarInt (in little-endian).
      let length = this.rawtx.slice(this.offset+2, this.offset+2+4);
      this.log(`parsed 4 byte VarInt chunk @ offset ${this.offset}`, 2);
      this.offset += 2+4;
      return parseInt(length, 16);
    }
    if (peak == "fe") {
      // <= 0xffffffff 	fe12345678 	Prefix with fe, and the next 4 bytes is the VarInt (in little-endian).
      let length = this.rawtx.slice(this.offset+2, this.offset+2+8);
      this.log(`parsed 8 byte VarInt chunk @ offset ${this.offset}`, 2);
      this.offset += 2+8;
      return parseInt(length, 16);
    }
    if (peak == "ff") {
      // <= 0xffffffffffffffff 	ff1234567890abcdef 	Prefix with ff, and the next 8 bytes is the VarInt (in little-endian).
      let length = this.rawtx.slice(this.offset+2, this.offset+2+16);
      this.log(`parsed 16 byte VarInt chunk @ offset ${this.offset}`, 2);
      this.offset += 2+16;
      return parseInt(length, 16);
    }
    if (peak == "00" && this.segwit === false) {
      this.segwit = true;
      this.log(`parsed 4 byte VarInt chunk @ offset ${this.offset}`, 2);
      this.offset += 4;
      this.log(`VarInt | flag: true`, 2);
      return this.getlength();
    }
    this.log(`parsed 2 byte VarInt chunk @ offset ${this.offset} -> ${peak}`, 2);
    this.offset += 2;
    return parseInt(peak, 16);
  }

  decode() {
    this.tx.version = parseInt(this.parsebytes(4).reverse().join(""));
    this.log(`4 bytes reversed | version: ${this.tx.version}`, 1);
    this.vin_count = this.getlength();
    this.log(`VarInt | vin_count: ${this.vin_count}`, 2);
    if (this.vin_count > 0) {
      for (let i = 0; i < 1; i++) {
        let input = {};
        input.txid = this.parsebytes(32).reverse();
        input.txid_hex = this.hexfrombytes(input.txid);
        this.log(`32 bytes reversed | input ${i} txid: ${input.txid_hex}`, 1);
        input.vout = this.numberfrombytes(this.parsebytes(4).reverse());
        this.log(`4 bytes reversed | input ${i} vout: ${input.vout}`,1);
        let script_size = this.getlength();
        this.log(`VarInt | input ${i} script_size: ${script_size}`,2);
        let script = this.parsebytes(script_size);
        input.scriptSig = this.parsescript(script);
        this.log(`${script_size} bytes | input ${i} scriptSig: ${input.scriptSig.hex}`, 1);
        input.sequence = this.parsebytes(4).reverse();
        input.sequence_hex = this.hexfrombytes(input.sequence);
        input.sequence_number = this.numberfrombytes(input.sequence);
        this.log(`4 bytes reversed | input ${i} sequence: ${input.sequence_hex}`, 1);
        this.tx.vin.push(input);
      }
    }

    this.vout_count = this.getlength();
    this.log(`VarInt | vout_count: ${this.vout_count}`, 2);
    if (this.vout_count > 0 && this.vout_count < 0xffff) {
      for (let i = 0; i < this.vout_count; i++) {
        let output = {
          n: i
        };
        let output_bin = this.parsebytes(8).reverse();
        output.value = this.numberfrombytes(output_bin) / 100000000;
        this.log(`8 bytes reversed | ouput ${i} value: ${output.value}`, 1);
        let script_pub_key_size = this.getlength();
        this.log(`VarInt | output ${i} script_pub_key_size: ${script_pub_key_size}`, 2);
        let script = this.parsebytes(script_pub_key_size);
        output.scriptPubKey = this.parsescript(script);
        this.log(`${script_pub_key_size} bytes | output ${i} script_pub_key: ${output.script_pub_key_hex}`, 1);
        this.tx.vout.push(output);
      }
    }
    if (this.segwit && this.vin_count > 0) {
        let input = this.tx.vin[0];
        let witness_stack = this.getlength();
        if (witness_stack > 0) {
          input.txinwitness = [];
          for (let i = 0; i < witness_stack; i++) {
            let witness_length = this.getlength();
            let witness = this.parsebytes(witness_length);
            let witness_hex = this.hexfrombytes(witness);
            input.txinwitness.push(witness_hex);
            this.log(`${witness_length} bytes | input ${0} txwitness: ${witness_hex}`, 1);
          }
        }
    }
    this.tx.locktime = parseInt(this.parsebytes(4).reverse().join(""));
    this.log(`4 bytes reversed | locktime: ${this.tx.locktime}`, 1);
  }
}
