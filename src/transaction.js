import opcodes from "./opcode";
import { NET } from "./network";
import { logger, hexfromnumber, numberfromhex, numberfrombytes, hexfrombytes, hextobytes } from "./helper";
import { Script } from "./script";

export class TransactionInput {
}


export class Transaction {
  constructor(tx) {
    const defaults = {
      network: "main",
      segwit: true,
      version: 1,
      locktime: 0,
      vin: [],
      vout: [],
    };
    Object.keys(defaults).forEach((key) => {
      this[key] = tx[key] ? tx[key] : defaults[key];
    });
    // this.parsescripts();
  }
  serialize() {
    if (this.vin.length <= 0) {
      console.error("transaction has no inputs");
    }
    if (this.vout.length <= 0) {
      console.error("transaction has no outputs");
    }
    let hex = "";
    const version = new Uint8Array(4);
    version[0] = this.version; // reverse byte order
    hex += hexfrombytes(version);           // version
    if (this.segwit) {
      hex += "00";                // segwit mark, only use segwit tx's its 2022
    }
    console.log();
    hex += hexfromnumber(this.vin.length);   // vin count
    this.vin.forEach((input) => {
      hex += "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"; // txid
      hex += "01"; // vout
      // hex += hexfromnumber(input.script.length); // scriptSig size
      // hex += hexfrombytes(input.script); // scriptSig
      const seq = Uint8Array.from([255, 255, 255, 255]);
      hex += hexfrombytes(seq);
    });
    hex += hexfromnumber(this.vout.length);   // vout count
    this.vout.forEach((output) => {
      hex += hexfrombytes(hextobytes(hexfromnumber(100000).padStart(16, 0)).reverse()); // amount
    });
    console.log(hex);
    return hex;
  }
  weight() {
    const base = this.byteLength(false);
    const total = this.byteLength(true);
    return base * 3 + total;
  }
  virtualSize() {
    return Math.ceil(this.weight() / 4);
  }
  byteLength(allow_witness = true) {
    let l = 0;
    const hasWitnesses = allow_witness && this.segwit;
    l += 4;                      // version
    l += 4;                      // locktime
    if (hasWitnesses) l += 1;    // marker
    l += this.vin.length;        // varint vout_count
    l += this.vout.length;       // varint vin_count
    this.vin.forEach((vin) => {
      l += 32;                   // txid
      l += 4;                    // vout
      l += 4;                    // sequence
      l += vin.script.length;    // script length
    });
    this.vout.forEach((vout) => {
      l += 8;                    // amount
      l+= 2;                     // script_pub_key_size
      l += vout.script.length;
    });
    if (hasWitnesses) {
      this.vin.forEach((vin) => {
        vin.txinwitness.forEach((witness) => {
          l += witness.length;   // witness length
        });
      });
    }
    return l;
  }
}
