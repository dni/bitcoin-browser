import chai from "chai";
import { transactions } from "./data";
import { TransactionDecoder } from "../src/transaction-decoder";


transactions.forEach((tx) => {
  let i = transactions.indexOf(tx);
  let decoder = new TransactionDecoder(tx.raw, tx.network);
  describe(`Decode Transaction: #${i} :: ${tx.name}`, () => {
    it('should initialize', () => {
      chai.expect(decoder).to.not.equal(null);
    });

    it(`decoder.tx.version should equal to ${tx.data.version}`, () => {
      chai.expect(decoder.tx.version).to.equal(tx.data.version);
    });
    let has_segwit = "txinwitness" in tx.data.vin[0];
    it(`decoder.tx.segwit should equal to ${has_segwit}`, () => {
      chai.expect(decoder.segwit).to.equal(has_segwit);
    });
    it(`decoder.tx.weight should equal to ${tx.data.weight}`, () => {
      chai.expect(decoder.tx.weight).to.equal(tx.data.weight);
    });
    // it(`decoder.tx.size should equal to ${tx.data.size}`, () => {
    //   chai.expect(decoder.tx.size).to.equal(tx.data.size);
    // });
    // it(`decoder.tx.vsize should equal to ${tx.data.vsize}`, () => {
    //   chai.expect(decoder.tx.vsize).to.equal(tx.data.vsize);
    // });
    it(`decoder.vin_count should equal to ${tx.data.vin.length}`, () => {
      chai.expect(decoder.vin_count).to.equal(tx.data.vin.length);
    });
    describe(`Decode ${decoder.vin_count} Inputs: `, () => {
      tx.data.vin.forEach((input) => {
        let j = tx.data.vin.indexOf(input);
        describe(`Input: #${j} `, () => {
          it(`input should exist at index ${j}`, () => {
            chai.expect(j in decoder.tx.vin).to.equal(true);
          });
          it(`txid_hex should equal to ${input.txid}`, () => {
            chai.expect(decoder.tx.vin[j].txid_hex).to.equal(input.txid);
          });
          it(`vout should equal to ${input.vout}`, () => {
            chai.expect(decoder.tx.vin[j].vout).to.equal(input.vout);
          });
          it(`scriptSig.hex should equal to ${input.scriptSig.hex}`, () => {
            chai.expect(decoder.tx.vin[j].scriptSig.hex).to.equal(input.scriptSig.hex);
          });
          it(`sequence_number should equal to ${input.sequence}`, () => {
            chai.expect(decoder.tx.vin[j].sequence_number).to.equal(input.sequence);
          });
        });
      });
    });
    describe(`Decode ${decoder.vout_count} Outputs: `, () => {
      tx.data.vout.forEach((output) => {
        let j = tx.data.vout.indexOf(output);
        describe(`Output: #${j} `, () => {
          it(`output should exist at index ${j}`, () => {
            chai.expect(j in decoder.tx.vout).to.equal(true);
          });
          it(`output n should equal to ${output.n}`, () => {
            chai.expect(decoder.tx.vout[j].n).to.equal(output.n);
          });
          it(`value should equal to ${output.value}`, () => {
            chai.expect(decoder.tx.vout[j].value).to.equal(output.value);
          });
          it(`scriptPubKey.hex should equal to ${output.scriptPubKey.hex}`, () => {
            chai.expect(decoder.tx.vout[j].scriptPubKey.hex).to.equal(output.scriptPubKey.hex);
          });
          it(`scriptPubKey.address should equal to ${output.scriptPubKey.address}`, async () => {
            chai.expect(await decoder.tx.vout[j].scriptPubKey.address).to.equal(output.scriptPubKey.address);
          });
          it(`scriptPubKey.type should equal to ${output.scriptPubKey.type}`, () => {
            chai.expect(decoder.tx.vout[j].scriptPubKey.type).to.equal(output.scriptPubKey.type);
          });
          // it(`scriptPubKey.asm should equal to ${output.scriptPubKey.asm}`, () => {
          //   chai.expect(decoder.tx.vout[j].scriptPubKey.asm).to.equal(output.scriptPubKey.asm);
          // });
        });
      });
    });

    if (has_segwit) {
      describe(`Decode Witnesses: `, () => {
        tx.data.vin.forEach((input) => {
          let i = tx.data.vin.indexOf(input);
          describe(`Input Witness: #${i} `, () => {
            it(`witness length should match to ${input.txinwitness.length}`, () => {
              chai.expect(decoder.tx.vin[i].txinwitness.length).to.equal(input.txinwitness.length);
            });
            input.txinwitness.forEach((witness) => {
              let j = input.txinwitness.indexOf(witness);
              it(`witness hex should match to ${witness}`, () => {
                console.log();
                chai.expect(decoder.tx.vin[i].txinwitness_hex[j]).to.equal(witness);
              });
            });
          });
        });
      });
    }

    it(`decoder.tx.locktime should equal to ${tx.data.locktime}`, () => {
      chai.expect(decoder.tx.locktime).to.equal(tx.data.locktime);
    });
  });
});
