import opcodes from "./opcode";
import {  hash160, b58lify, unb58lify, sha256, double_sha256 } from "./hashing";
import { NET } from "./network";
import { logger, create_enums, numberfrombyte, hextobytes, hexfrombytes } from "./helper";

// https://github.com/bitcoin/bitcoin/blob/master/src/script/standard.cpp#L52
export const TxoutType = {
  NONSTANDARD:           "nonstandard",
  PUBKEY:                "pubkey",
  PUBKEYHASH:            "pubkeyhash",
  SCRIPTHASH:            "scripthash",
  MULTISIG:              "multisig",
  NULLDATA:              "nulldata",
  WITNESS_V0_KEYHASH:    "witness_v0_keyhash",
  WITNESS_V0_SCRIPTHASH: "witness_v0_scripthash",
  WITNESS_V1_TAPROOT:    "witness_v1_taproot",
  WITNESS_UNKNOWN:       "witness_unknown"
};

// https://github.com/bitcoin/bitcoin/blob/master/src/pubkey.h#L39
const PubKey = {
  SIZE: 65,
  COMPRESSED_SIZE: 33,
  SIGNATURE_SIZE: 72,
  COMPACT_SIGNATURE_SIZE: 65,
  GetLen: (chHeader) => {
    if (chHeader == 2 || chHeader == 3) {
      return this.COMPRESSED_SIZE;
    }
    if (chHeader == 4 || chHeader == 6 || chHeader == 7) {
      return this.SIZE;
    }
    return 0;
  },
  ValidSize: (vch) => {
    return vch.length > 0 && this.GetLen(vch[0]) == vch.length;
  }
};

export class Script {
  constructor(script, network) {
    if (network === undefined) {
      this.network = NET.main;
    } else {
      this.network = NET[network];
    }

    console.log(this.network);
    if (typeof script == "string") {
      this.script = hextobytes(script);
    } else {
      this.script = script;
    }
    this.type = this.get_script_type();
    this.asm = this.decode();
    // this.p2sh = this.get_address();
    this.address = this.ExtractDestination();
    this.hex = hexfrombytes(this.script);
  }
  IsPayToScriptHash() {
    return this.script.length == 23
      && this.script[0] == opcodes.OP_HASH160
      && this.script[1] == 0x14
      && this.script[22] == opcodes.OP_EQUAL;
  }
  MatchPayToPubkey() {
    let s = this.script;
    let l = PubKey.SIZE;
    if (s.length == l + 2 && s[0] == l && s[s.length-1] == opcodes.OP_CHECKSIG) {
        this.pubkey = s.slice(1, l+1);
        return PubKey.ValidSize(this.pubkey);
    }
    l = PubKey.COMPRESSED_SIZE;
    if (s.length ==  l + 2 && s[0] == l && s[s.length-1] == opcodes.OP_CHECKSIG) {
        this.pubkey = s.slice(1, l+1)
        return PubKey.ValidSize(this.pubkey);
    }
    return false;
  }
  MatchPayToPubkeyHash() {
    let s = this.script;
    if (s.length == 25
      && s[0] == opcodes.OP_DUP
      && s[1] == opcodes.OP_HASH160
      && s[2] == 20
      && s[23] == opcodes.OP_EQUALVERIFY
      && s[24] == opcodes.OP_CHECKSIG) {
        this.pubkeyhash = s.slice(3, 23);
        return true;
    }
    return false;
  }

  MatchMultisig() {
    let s = this.script;
    if (s.length < 1 || s[s.length-1] != opcodes.OP_CHECKMULTISIG) {
      return false;
    }
    // TODO: multisig
    // if (!script.GetOp(it, opcode, data)) return false;
    // auto req_sigs = GetScriptNumber(opcode, data, 1, MAX_PUBKEYS_PER_MULTISIG);
    // if (!req_sigs) return false;
    // required_sigs = *req_sigs;
    // while (script.GetOp(it, opcode, data) && CPubKey.ValidSize(data)) {
    //     pubkeys.emplace_back(std.move(data));
    // }
    // auto num_keys = GetScriptNumber(opcode, data, required_sigs, MAX_PUBKEYS_PER_MULTISIG);
    // if (!num_keys) return false;
    // if (pubkeys.size() != static_cast<unsigned long>(*num_keys)) return false;
    // return (it + 1 == script.end());
  }

  // A witness program is any valid CScript that consists of a 1-byte push opcode
  // followed by a data push between 2 and 40 bytes.
  IsWitnessProgram() {
    if (this.script.length < 4 || this.script.length > 42) {
      return false;
    }
    if (this.script[0] != opcodes.OP_0
      && this.script[0] < opcodes.OP_1
      || this.script[0] > opcodes.OP_16) {
      return false;
    }
    if ((this.script[1] + 2) == this.script.length) {
      // this.witnessversion = DecodeOP_N((opcodetype)(*this)[0]);
      this.witnessprogram = this.script.slice(2);
      return true;
    }
    return false;
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
    // Shortcut for pay-to-script-hash, which are more constrained than the other types:
    // it is always OP_HASH160 20 [20 byte hash] OP_EQUAL
    if (this.IsPayToScriptHash()) {
      return TxoutType.SCRIPTHASH;
    }

    if (this.IsWitnessProgram()) {
      if (this.witnessversion == 0 && this.witnessprogram.length == WITNESS_V0_KEYHASH_SIZE) {
        // vSolutionsRet.push_back(std.move(witnessprogram));
        return TxoutType.WITNESS_V0_KEYHASH;
      }
      if (this.witnessversion == 0 && this.witnessprogram.length == WITNESS_V0_SCRIPTHASH_SIZE) {
        return TxoutType.WITNESS_V0_SCRIPTHASH;
      }
      if (this.witnessversion == 1 && this.witnessprogram.length == WITNESS_V1_TAPROOT_SIZE) {
        return TxoutType.WITNESS_V1_TAPROOT;
      }
      if (this.witnessversion != 0) {
        return TxoutType.WITNESS_UNKNOWN;
      }
      return TxoutType.NONSTANDARD;
    }

    // Provably prunable, data-carrying output
    // So long as script passes the IsUnspendable() test and all but the first
    // byte passes the IsPushOnly() test we don't care what exactly is in the
    // script.
    if (this.script.length >= 1 && this.script[0] == opcodes.OP_RETURN && this.IsPushOnly()) {
      return TxoutType.NULL_DATA;
    }
    if (this.MatchPayToPubkey()) {
      return TxoutType.PUBKEY;
    }
    if (this.MatchPayToPubkeyHash()) {
      return TxoutType.PUBKEYHASH;
    }
    if (this.MatchMultisig()) {
      return TxoutType.MULTISIG;
    }
    return TxoutType.NONSTANDARD;

    // // OP_HASH160 <20:hash160(script)> OP_EQUAL
    // // bool CScript.IsPayToScriptHash() const
    // // 0 <20:hash160(pubkey)>
    // if (s.length == 22 && s[0] == opcodes.OP_FALSE && s[1] == 0x14) {
    //   return TxoutType.witness_v0_keyhash;
    // }
    // // 0 <32:sha256(script)>
    // if (s.length == 34 && s[0] == opcodes.OP_FALSE && s[1] == 0x20) {
    //   return TxoutType.witness_v0_scripthash;
    // }
    // // OP_1 <x-only-pubkey>
    // if (s.length == 34 && s[0] == opcodes.OP_TRUE && s[1] == 0x20) {
    //   return TxoutType.p2tr;
    // }

    // return "unknown";
  }

  decode(){
    let s = this.script;
    let stack = [];
    for (let i = 0; i < s.length; i++) {
      let byte = s[i]
      if (byte < opcodes.OP_PUSHDATA1 && byte > opcodes.OP_FALSE) {
        let size = byte;
        let bytes = s.slice(i+1, i+size+1);
        i += size;
        stack.push(hexfrombytes(bytes));
        logger(`pushes ${size} bytes on script stack, ${hexfrombytes(bytes)}`, 2);
      } else {
        stack.push(this.opcode(byte));
      }
    }
    return stack.join(" ");
  }
  async ExtractDestination() {
      switch (this.type) {
        // case TxoutType.PUBKEY:
        //   if (!Pubkey.IsValid(this.pubkey)) {
        //     return false;
        //   }
        //   return hash160(this.pubkey);
        case TxoutType.PUBKEYHASH:
          console.log("raw", this.pubkeyhash);
          this.address = this.pubkeyhash;
          this.address.unshift(this.network.p2pkh);
          console.log("after unshift", this.address);
          // let checksum = await sha256(Uint8Array.from(this.address));
          // this.address.push(checksum);
          console.log("promise", this.address);
          this.address = b58lify(this.address);
          console.log("empty", this.address);
          // return this.address;
          // return hash160(this.pubkeyhash, this.network);
      }
      // case TxoutType.SCRIPTHASH: {
      //     addressRet = ScriptHash(uint160(vSolutions[0]));
      //     return true;
      // }
      // case TxoutType.WITNESS_V0_KEYHASH: {
      //     WitnessV0KeyHash hash;
      //     std.copy(vSolutions[0].begin(), vSolutions[0].end(), hash.begin());
      //     addressRet = hash;
      //     return true;
      // }
      // case TxoutType.WITNESS_V0_SCRIPTHASH: {
      //     WitnessV0ScriptHash hash;
      //     std.copy(vSolutions[0].begin(), vSolutions[0].end(), hash.begin());
      //     addressRet = hash;
      //     return true;
      // }
      // case TxoutType.WITNESS_V1_TAPROOT: {
      //     WitnessV1Taproot tap;
      //     std.copy(vSolutions[0].begin(), vSolutions[0].end(), tap.begin());
      //     addressRet = tap;
      //     return true;
      // }
      // case TxoutType.WITNESS_UNKNOWN: {
      //     WitnessUnknown unk;
      //     unk.version = vSolutions[0][0];
      //     std.copy(vSolutions[1].begin(), vSolutions[1].end(), unk.program);
      //     unk.length = vSolutions[1].size();
      //     addressRet = unk;
      //     return true;
      // }
      // case TxoutType.MULTISIG:
      // case TxoutType.NULL_DATA:
      // case TxoutType.NONSTANDARD:
      //     return false;
      // } // no default case, so the compiler can warn about missing cases
      // assert(false);
  }

}


export const p2pkh = (pubkey) => {
  // Return Pay-To-Pubkey-Hash ScriptPubkey"""
  // scriptPubKey: OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
  return new Script([
    opcodes.OP_DUP,
    opcodes.OP_HASH160,
    0x14,
    hashes.hash160(pubkey.sec()),
    opcodes.OP_EQUALVERIFY,
    opcodes.OP_CHECKSIG
  ]);
}
