import chai from "chai";
import { PrivateKey } from "../src/ec";

describe(`EC:`, () => {
  describe(`PrivateKey`, () => {
    it('expect PrivateKey to initialize', () => {
      let key = new PrivateKey();
      chai.expect(key).to.instanceof(PrivateKey);
    });
    it('expect pubkey() to get a new key every time', () => {
      let key = new PrivateKey();
      let pub1 = key.pubkey();
      let pub2 = key.pubkey();
      chai.expect(pub1).to.not.equal(pub2);
    });
    it('expect to sign and verify message', async () => {
      let key = new PrivateKey();
      let pubkey = key.pubkey();
      let pubkey2 = key.pubkey();
      let msg = "hello world!";
      let msghash = await key.message(msg)
      let sig = await key.sign(msghash);
      let verify = key.verify(sig, msghash, pubkey);
      let verify2 = key.verify(sig, msghash, pubkey2);
      chai.expect(verify).to.equal(true);
      chai.expect(verify2).to.equal(true);
    });
  });
});
