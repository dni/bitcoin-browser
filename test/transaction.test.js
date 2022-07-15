import chai from "chai";
import { transactions } from "./data";
import { TransactionDecoder } from "../src/transaction";


transactions.forEach((tx) => {
  let i = transactions.indexOf(tx);
  let decoder = null;
  describe(`Decode Transaction: #${i}`, () => {
    it('should initialize', () => {
      decoder = new TransactionDecoder(tx.raw);
      chai.expect(decoder).to.not.equal(null);
    });

    it(`decoder.tx.version should equal to ${tx.data.version}`, () => {
      chai.expect(decoder.tx.version).to.equal(tx.data.version);
    });
    it(`decoder.tx.vin_count should equal to ${tx.data.vin.length}`, () => {
      chai.expect(decoder.tx.vin_count).to.equal(tx.data.vin.length);
    });
    describe(`Decode Inputs: `, () => {
      tx.data.vin.forEach((input) => {
        let j = tx.data.vin.indexOf(input);
        describe(`Input: #${j} `, () => {
          it(`txid_hex should equal to ${input.txid}`, () => {
            chai.expect(decoder.tx.vin[j].txid_hex).to.equal(input.txid);
          });
          it(`vout should equal to ${input.vout}`, () => {
            chai.expect(decoder.tx.vin[j].vout).to.equal(input.vout);
          });
          it(`scriptSig.hex should equal to ${input.scriptSig.hex}`, () => {
            chai.expect(decoder.tx.vin[j].scriptSig.hex).to.equal(input.scriptSig.hex);
          });
          // it(`scriptSig.asm should equal to ${input.scriptSig.asm}`, () => {
          //   chai.expect(decoder.tx.vin[j].scriptSig.asm).to.equal(input.scriptSig.asm);
          // });
          it(`sequence_number should equal to ${input.sequence}`, () => {
            chai.expect(decoder.tx.vin[j].sequence_number).to.equal(input.sequence);
          });
        });
      });
    });
    describe(`Decode Outputs: `, () => {
      tx.data.vout.forEach((output) => {
        let j = tx.data.vout.indexOf(output);
        describe(`Output: #${j} `, () => {
          it(`value should equal to ${output.value}`, () => {
            chai.expect(decoder.tx.vout[j].value).to.equal(output.value);
          });
        });
      });
    });
  });
});
