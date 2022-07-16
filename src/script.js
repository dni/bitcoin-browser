import opcodes from "./opcode";
import { logger, hextobytes } from "./helper";

export class Script {
  constructor(script) {
    if (typeof script == "string") {
      script = hextobytes(script)
    }
    this.script = script;
    this.script_stack = [];
    this.script_type = "unknown";
    this.decode();
  }
  get parsed() {
    return this.script_stack.join(" ");
  }
  opcode(byte) {
    let label = "";
    Object.keys(opcodes).forEach((o) => {
      if (opcodes[o] == byte) {
        label = o;
      }
    });
    return label;
  }
  get_script_type() {
    let s = this.script;
    // (67 pubkey) OP_CHECKSIG
    if ((s.length == 67 || s.length == 72) && s[s.length-1] == opcodes.OP_CHECKSIG) {
      return "pubkey";
    }
    // OP_DUP OP_HASH160 <20:hash160(pubkey)> OP_EQUALVERIFY OP_CHECKSIG
    if (s.length == 25
      scriptPubKey: OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
      scriptSig: <sig> <pubKey>
      && s[0] == opcodes.OP_DUP
      && s[1] == opcodes.OP_HASH160
      && s[2] == 0x14
      && s[s.length-2] == opcodes.OP_EQUALVERIFY
      && s[s.length-1] == opcodes.OP_CHECKSIG) {
      return "p2pkh";
    }
    // OP_HASH160 <20:hash160(script)> OP_EQUAL
    if (s.length == 23
      && s[0] == opcodes.OP_HASH160 && s[1] == 0x14
      && s[-1] == opcodes.OP_EQUAL) {
      return "p2sh";
    }
    // 0 <20:hash160(pubkey)>
    if (s.length == 22 && s[0] == opcodes.OP_FALSE && s[1] == 0x14) {
      return "witness_v0_keyhash";
    }
    // 0 <32:sha256(script)>
    if (s.length == 34 && s[0] == opcodes.OP_FALSE && s[1] == 0x20) {
      return "witness_v0_scripthash";
    }
    // OP_1 <x-only-pubkey>
    if (s.length == 34 && s[0] == opcodes.OP_TRUE && s[1] == 0x20) {
      return "p2tr";
    }
    return "unknown";
  }

  decode(){
    this.script_type = this.get_script_type();
    for (let i = 0; i < this.script.length; i++) {
      let byte = this.script[i];
      if (byte < opcodes.OP_PUSHDATA1 && byte > opcodes.OP_FALSE) {
        let bytes = this.script.slice(i, byte*2);
        this.script_stack.push(bytes);
        logger(`pushes ${byte} bytes on script stack, ${bytes}`, 2);
      }
    }
    logger(this);
    // if (script_type == "p2pkh") {
    //     d = network["p2pkh"] + s[3:23]
    //     return base58.encode_check(d)
    // }

    // if (script_type == "p2sh") {
    //     d = network["p2sh"] + s[2:22]
    //     return base58.encode_check(d)
    // }

    // if (script_type in ["p2wpkh", "p2wsh", "p2tr"]) {
    //     ver = s[0]
    //     // FIXME: should be one of OP_N
    //     if (ver > 0) {
    //         ver = ver % 0x50;
    //     }
    //     return bech32.encode(network["bech32"], ver, s[2:])
    // }
  }
}
