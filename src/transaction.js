
export class TransactionDecoder {
  constructor(rawtx) {
    this.rawtx = rawtx;
    this.offset = 0;
    this.tx = {
      vin: [],
      vout: [],
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
      input.txid_hex = this.hexfrombytes(input.txid);
      console.log(`32 bytes reversed | input ${i} txid: ${input.txid_hex}`, input.txid);
      input.vout = parseInt(this.parsebytes(4).reverse().join());
      console.log(`4 bytes reversed | input ${i} vout: ${parseInt(input.vout)}`);
      let script_sig_size = this.getlength();
      console.log(`VarInt | input ${i} script_sig_size: ${script_sig_size}`);
      let script_sig = this.parsebytes(script_sig_size);
      input.scriptSig = {
        asm: script_sig,
        hex: this.hexfrombytes(script_sig)
      };
      console.log(`${script_sig_size} bytes | input ${i} script_sig: ${input.scriptSig.hex}`, input.scriptSig.asm);
      input.sequence = this.parsebytes(4).reverse();
      input.sequence_hex = this.hexfrombytes(input.sequence);
      input.sequence_number = this.numberfrombytes(input.sequence);
      console.log(`4 bytes reversed | input ${i} sequence: ${input.sequence_hex}`, input.sequence);
      this.tx.vin.push(input);
    }

    this.tx.vout_count = this.getlength();
    console.log(`VarInt | vout_count: ${this.tx.vout_count}`);
    for (let i = 0; i < this.tx.vout_count; i++) {
      let output = {};
      let output_bin = this.parsebytes(8).reverse();
      output.value = this.numberfrombytes(output_bin) / 100000000;
      console.log(`8 bytes reversed | ouput ${i} value: ${output.value}`);
      let script_pub_key_size = this.getlength();
      console.log(`VarInt | output ${i} script_pub_key_size: ${script_pub_key_size}`);
      output.script_pub_key = this.parsebytes(script_pub_key_size);
      output.script_pub_key_hex = this.hexfrombytes(output.script_pub_key);
      console.log(`${script_pub_key_size} bytes | output ${i} script_pub_key: ${output.script_pub_key_hex}`, output.script_pub_key);
      this.tx.vout.push(output);
    }
    this.tx.locktime = parseInt(this.parsebytes(4).reverse().join(""));
    console.log(`4 bytes reversed | locktime: ${this.tx.locktime}`);
  }
}
