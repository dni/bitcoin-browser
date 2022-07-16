import chai from "chai";
import { scripts } from "./data";
import { Script } from "../src/script";

scripts.forEach((script) => {
  let i = scripts.indexOf(script);
  let decoder = new Script(script.hex);
  describe(`Decode Script: #${i} :: ${script.name}`, () => {
    it('should initialize', () => {
      chai.expect(decoder).to.not.equal(null);
    });
    it(`decoder.script_type should equal to ${script.type}`, () => {
      chai.expect(decoder.script_type).to.equal(script.type);
    });
    it(`decoder.address should equal to ${script.address}`, () => {
      chai.expect(decoder.address).to.equal(script.address);
    });
  });
});
