import chai from "chai";
import { scripts } from "./data";
import { Script } from "../src/script";

scripts.forEach((script) => {
  let i = scripts.indexOf(script);
  let decoder = new Script(script.hex, "test");
  describe(`Decode Script: #${i} :: ${script.name}`, () => {
    it('should initialize', () => {
      chai.expect(decoder).to.not.equal(null);
    });
    it(`decoder.hex should equal to ${script.hex}`, () => {
      chai.expect(decoder.hex).to.equal(script.hex);
    });
    it(`decoder.type should equal to ${script.type}`, () => {
      chai.expect(decoder.type).to.equal(script.type);
    });
    it(`decoder.address should equal to ${script.address}`, async () => {
      chai.expect(await decoder.address).to.equal(script.address);
    });
    // it(`decoder.p2sh should equal to ${script.p2sh}`, () => {
    //   chai.expect(decoder.p2sh).to.equal(script.p2sh);
    // });
    // it(`decoder.asm should equal to ${script.asm}`, () => {
    //   chai.expect(decoder.asm).to.equal(script.asm);
    // });
    // it(`decoder.script_type should equal to ${script.type}`, () => {
    //   chai.expect(decoder.script_type).to.equal(script.type);
    // });
    // it(`decoder.address should equal to ${script.address}`, () => {
    //   chai.expect(decoder.address).to.equal(script.address);
    // });
  });
});
