import opcodes from "./opcode";
import { logger, hextobytes } from "./helper";

export class Script {
  constructor(script) {
    if (typeof script == "String") {
      script = hextobytes(script)
    }
    this.script = script;
    this.script_stack = [];
    this.script_type = "unknown";
    this.parsed = "";
    this.decode();
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
  get_script_type(data) {
    // (67 pubkey) OP_CHECKSIG
    if ((data.length == 67 || data.length == 72) && data[data.length-1] == opcodes.OP_CHECKSIG) {
      return "pubkey";
    }
    // OP_DUP OP_HASH160 <20:hash160(pubkey)> OP_EQUALVERIFY OP_CHECKSIG
    if (data.length == 25
      && data[0] == opcodes.OP_DUP
      && data[1] == opcodes.OP_HASH160
      && data[2] == 0x14
      && data[data.length-2] == opcodes.OP_EQUALVERIFY
      && data[data.length-1] == opcodes.OP_CHECKSIG) {
      return "p2pkh";
    }
    // OP_HASH160 <20:hash160(script)> OP_EQUAL
    if (data.length == 23
      && data[0] == opcodes.OP_HASH160 && data[1] == 0x14
      && data[-1] == opcodes.OP_EQUAL) {
      return "p2sh";
    }
    // 0 <20:hash160(pubkey)>
    if (data.length == 22 && data[0] == opcodes.OP_FALSE && data[1] == 0x14) {
      return "witness_v0_keyhash";
    }
    // 0 <32:sha256(script)>
    if (data.length == 34 && data[0] == opcodes.OP_FALSE && data[1] == 0x20) {
      return "witness_v0_scripthash";
    }
    // OP_1 <x-only-pubkey>
    if (data.length == 34 && data[0] == opcodes.OP_TRUE && data[1] == 0x20) {
      return "p2tr";
    }
    return "unknown";
  }

  decode(){
    this.script_type = this.get_script_type(this.script);
    // for (let i = 0; i < script.length; i++) {
    //   let byte = script[i];
    //   if (byte < opcodes.OP_PUSHDATA1 && byte > opcodes.OP_FALSE) {
    //     let bytes = script.slice(i, byte*2);
    //     script_stack.push(bytes);
    //     logger(`pushes ${byte} bytes on script stack, ${bytes}`, 2);
    //   }
    //   parsed.push(this.opcode(byte));
    // }
    // logger("SCRIPT: " + parsed.join(" "));

    logger(this);
    // if (script_type == "p2pkh") {
    //     d = network["p2pkh"] + data[3:23]
    //     return base58.encode_check(d)
    // }

    // if (script_type == "p2sh") {
    //     d = network["p2sh"] + data[2:22]
    //     return base58.encode_check(d)
    // }

    // if (script_type in ["p2wpkh", "p2wsh", "p2tr"]) {
    //     ver = data[0]
    //     // FIXME: should be one of OP_N
    //     if (ver > 0) {
    //         ver = ver % 0x50;
    //     }
    //     return bech32.encode(network["bech32"], ver, data[2:])
    // }
  }
}
