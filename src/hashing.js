import ripemd160 from 'ripemd160-js'
import * as secp from "@noble/secp256k1";
import { hexfrombytes } from './helper'

//
// https://gist.github.com/diafygi/90a3e80ca1c2793220e5/
const A = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
export const b58lify = function(B){let d=[],s="",i,j,c,n;for(i in B){j=0,c=B[i];s+=c||s.length^i?"":1;while(j in d||c){n=d[j];n=n?n*256+c:c;c=n/58|0;d[j]=n%58;j++}}while(j--)s+=A[d[j]];return s};
export const unb58lify = function(S){let d=[],b=[],i,j,c,n;for(i in S){j=0,c=A.indexOf(S[i]);if(c<0)return undefined;c||b.length^i?i:b.push(0);while(j in d||c){n=d[j];n=n?n*58+c:c;c=n>>8;d[j]=n%256;j++}}while(j--)b.push(d[j]);return new Uint8Array(b)};

export const sha256hex = async (message) => {
  const hashArray = Array.from(new Uint8Array(await sha256(message)));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export const sha256 = async (data) => {
  // const encoder = new TextEncoder();
  // const data = encoder.encode(message);
  const hash = crypto.subtle.digest('SHA-256', data);
  return hash;
}

export const double_sha256 = async (data) => {
  return sha256(await sha256(data))
}

export const hash160 = async (data, network) => {
  let a = Uint8Array.from(data);
  // let b = await secp.utils.sha256(a);
  let b = await sha256(a);
  let c = await ripemd160(a);
  let hash = await sha256(await sha256(c));
  // let d = hexfrombytes(c);
  // let e = btoa(d);
  // let x = c.unshift(network["p2pkh"]);
  let y = new Uint8Array(25);
  y.set(network.p2pkh, 0);
  y.set(c, 1);
  y.set(hash.slice(0, 3), 21);
  return b58lify(y);
}

