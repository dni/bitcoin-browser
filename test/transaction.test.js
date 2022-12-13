import chai from "chai";
import { transactions } from "./data";
import { Transaction } from "../src/transaction";

describe(`Test Defaults`, () => {
  let tx = new Transaction({});
  it(`tx.version should equal to 1`, () => {
    chai.expect(tx.version).to.equal(1);
  });
  it(`tx.locktime should equal to 0`, () => {
    chai.expect(tx.locktime).to.equal(0);
  });
  it(`tx.network should equal to main`, () => {
    chai.expect(tx.network).to.equal("main");
  });
});

transactions.forEach((test_tx) => {
  let i = transactions.indexOf(test_tx);
  let tx = new Transaction(test_tx.data);
  describe(`Transaction: #${i} :: ${test_tx.name}`, () => {
    it('should initialize', () => {
      chai.expect(tx).to.not.equal(null);
    });

    it(`tx.version should equal to ${test_tx.data.version}`, () => {
      chai.expect(tx.version).to.equal(test_tx.data.version);
    });
    it(`tx.weight should equal to ${test_tx.data.weight}`, () => {
      chai.expect(tx.weight()).to.equal(test_tx.data.weight);
    });
    // it(`decoder.tx.vsize should equal to ${tx.data.vsize}`, () => {
    //   chai.expect(decoder.tx.vsize).to.equal(tx.data.vsize);
    // });
    it(`tx.vin.length should equal to ${test_tx.data.vin.length}`, () => {
      chai.expect(tx.vin.length).to.equal(test_tx.data.vin.length);
    });
    it(`tx.vout.length should equal to ${test_tx.data.vout.length}`, () => {
      chai.expect(tx.vout.length).to.equal(test_tx.data.vout.length);
    });
    it(`tx should serialize to ${test_tx.raw}`, () => {
      chai.expect(tx.serialize()).to.equal(test_tx.raw);
    });
    it(`tx.locktime should equal to ${test_tx.data.locktime}`, () => {
      chai.expect(tx.locktime).to.equal(test_tx.data.locktime);
    });
  });
});
