import { hexlify, unhexlify, b58lify, unb58lify } from "./hashing";
import { getMempoolBlockheight, getMempoolLockupTx } from "./mempool";
import { randombytes, sha256HexDigest, sha256Digest } from "./crypto";
import {
  Transaction, TransactionInput, TransactionOutput, PrivateKey,
  Witness, Script, addressToScriptPubkey, SIGHASH_ALL
} from "./bitcoin";


let reverse = true;
let sequence = 0xFFFFFFFF;

let privkey = new PrivateKey(randombytes(32));
let preimage = randombytes(32);
let preimage_hash = await sha256HexDigest(preimage);


let current_block_height = await getMempoolBlockheight();
if (current_block_height <= 200) {
  console.error(`refund impossible, timeout_block_height (${current_block_height}) is not yet exceeded (${current_block_height})`);
}

// let scriptpubkey_address = addressToScriptPubkey(address);
let onchain_address = "bcrt1qmwjtwdylqdhavj8yffz0dy9whjwsppsakdtzaf";
let scriptpubkey_address = "bcrt1qmwjtwdylqdhavj8yffz0dy9whjwsppsakdtzaf";
let redeem_script = "reedemscript"

const lockupTx = await getMempoolLockupTx(onchain_address, scriptpubkey_address);

let fees = 300;
let vin = [new TransactionInput(lockupTx.txid, lockupTx.vout_i, sequence)];
let vout = [new TransactionOutput(lockupTx.vout_amount - fees, scriptpubkey_address)];
let tx = new Transaction(vin, vout);

if ( !reverse ) {
  tx.locktime = locktime
}

let s = new Script(redeem_script);
tx.vin.forEach( async input => {
  let i = tx.vin.indexOf(input);
  if ( !reverse ) {
    // OP_PUSHDATA34 // OP_0 == 0 // OP_PUSHDATA35 == 35
    // rs = bytes([34]) + bytes([0]) + bytes([32]) + sha256(redeem_script).digest()
    // tx.vin[i].script_sig = script.Script(data=rs)
  }
  const h = await tx.sighash_segwit(i, s, lockupTx.vout_amount);
  console.log("compare", tx.buffer, tx.as_string());
  const signature = privkey.sign(h); //.serialize();
  const witness_items = [signature + ([SIGHASH_ALL]), preimage, redeem_script];
  input.witness = new Witness(witness_items);
});

console.log("tx", tx);

const createOnchainTx = async (swap) => {


  //   res = create_post_request(
  //       BOLTZ_URL + "/createswap",
  //       {
  //           "type": "reversesubmarine",
  //           "pairId": "BTC/BTC",
  //           "orderSide": "buy",
  //           "invoiceAmount": data.amount,
  //           "preimageHash": preimage_hash,
  //           "claimPublicKey": claim_pubkey_hex,
  //       },
  //   )
  //
};
