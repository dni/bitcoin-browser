import chai from "chai";
import { numberfromhex, numberfrombytes, hexfrombytes, hextobytes } from "../src/helper";


describe(`Helpers:`, () => {
  describe(`hexfrombytes`, () => {
    it('expect 0,0,0,1 to equal hex 01', () => {
      let bytes = [0,0,0,1];
      chai.expect(hexfrombytes(bytes)).to.equal("00000001");
    });
    it('expect 255,255,255,255 to equal ffffffff', () => {
      let bytes = [255,255,255,255];
      chai.expect(hexfrombytes(bytes)).to.equal("ffffffff");
    });
  });
  describe(`hextobytes(ff)`, () => {
    let bytes = hextobytes("ff");
    it('expect ff to create 1 byte', () => {
      chai.expect(bytes.length).to.equal(1);
    });
    it('expect ff to equal 0xff', () => {
      chai.expect(bytes[0]).to.equal(0xff);
    });
    it('expect ff to equal 255', () => {
      chai.expect(bytes[0]).to.equal(255);
    });
  });
  describe(`hextobytes(ffff)`, () => {
    let bytes = hextobytes("ffff");
    it('expect ffff to create 2 byte', () => {
      chai.expect(bytes.length).to.equal(2);
    });
    it('expect ffff to equal 0xffff', () => {
      chai.expect(numberfrombytes(bytes)).to.equal(0xffff);
    });
    it('expect ffff to equal 65535', () => {
      chai.expect(numberfrombytes(bytes)).to.equal(65535);
    });
  });
  describe(`numberfrombytes`, () => {
    it('expect 0,0,0,1 to equal 1', () => {
      let bytes = [0,0,0,1];
      chai.expect(numberfrombytes(bytes)).to.equal(1);
    });
    it('expect 255,255 to equal 65535', () => {
      let bytes = [255,255];
      chai.expect(numberfrombytes(bytes)).to.equal(65535);
    });
  });
  describe(`numberfromhex`, () => {
    it('expect ffff to equal 65535', () => {
      chai.expect(numberfromhex("ffff")).to.equal(65535);
      chai.expect(numberfromhex("ffff")).to.equal(0xffff);
    });
    it('expect 0001 to equal 1', () => {
      chai.expect(numberfromhex("0001")).to.equal(1);
      chai.expect(numberfromhex("0001")).to.equal(0x0001);
    });
  });
});
