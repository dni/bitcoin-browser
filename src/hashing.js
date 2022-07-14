//
// https://gist.github.com/diafygi/90a3e80ca1c2793220e5/
export const b58lify = function(B,A){var d=[],s="",i,j,c,n;for(i in B){j=0,c=B[i];s+=c||s.length^i?"":1;while(j in d||c){n=d[j];n=n?n*256+c:c;c=n/58|0;d[j]=n%58;j++}}while(j--)s+=A[d[j]];return s};
export const unb58lify = function(S,A){var d=[],b=[],i,j,c,n;for(i in S){j=0,c=A.indexOf(S[i]);if(c<0)return undefined;c||b.length^i?i:b.push(0);while(j in d||c){n=d[j];n=n?n*58+c:c;c=n>>8;d[j]=n%256;j++}}while(j--)b.push(d[j]);return new Uint8Array(b)};

export const utf8encoder = new TextEncoder();
export const hexlify = (s) => {
  const rb = utf8encoder.encode(s);
  let r = '';
  for (const b of rb) {
    r += ('0' + b.toString(16)).slice(-2);
  }
  return r;
};

export const unhexlify = (s) => {
  return decodeURIComponent(
     s.replace(/\s+/g, '') // remove spaces
      .replace(/[0-9a-f]{2}/g, '%$&') // add '%' before each 2 characters
  );
}


//// bech32
// function polymodStep(pre: number): number {
//   const b = pre >> 25;
//   return (
//     ((pre & 0x1ffffff) << 5) ^
//     (-((b >> 0) & 1) & 0x3b6a57b2) ^
//     (-((b >> 1) & 1) & 0x26508e6d) ^
//     (-((b >> 2) & 1) & 0x1ea119fa) ^
//     (-((b >> 3) & 1) & 0x3d4233dd) ^
//     (-((b >> 4) & 1) & 0x2a1462b3)
//   );
// }
// function prefixChk(prefix: string): number | string {
//   let chk = 1;
//   for (let i = 0; i < prefix.length; ++i) {
//     const c = prefix.charCodeAt(i);
//     if (c < 33 || c > 126) return 'Invalid prefix (' + prefix + ')';

//     chk = polymodStep(chk) ^ (c >> 5);
//   }
//   chk = polymodStep(chk);

//   for (let i = 0; i < prefix.length; ++i) {
//     const v = prefix.charCodeAt(i);
//     chk = polymodStep(chk) ^ (v & 0x1f);
//   }
//   return chk;
// }

// export const bech32Decode = (str) => {
//   LIMIT = LIMIT || 90;
//   if (str.length < 8) return str + ' too short';
//   if (str.length > LIMIT) return 'Exceeds length limit';

//   // don't allow mixed case
//   const lowered = str.toLowerCase();
//   const uppered = str.toUpperCase();
//   if (str !== lowered && str !== uppered) return 'Mixed-case string ' + str;
//   str = lowered;

//   const split = str.lastIndexOf('1');
//   if (split === -1) return 'No separator character for ' + str;
//   if (split === 0) return 'Missing prefix for ' + str;

//   const prefix = str.slice(0, split);
//   const wordChars = str.slice(split + 1);
//   if (wordChars.length < 6) return 'Data too short';

//   let chk = prefixChk(prefix);
//   if (typeof chk === 'string') return chk;

//   const words = [];
//   for (let i = 0; i < wordChars.length; ++i) {
//     const c = wordChars.charAt(i);
//     const v = ALPHABET_MAP[c];
//     if (v === undefined) return 'Unknown character ' + c;
//     chk = polymodStep(chk) ^ v;

//     // not in the checksum?
//     if (i + 6 >= wordChars.length) continue;
//     words.push(v);
//   }

//   if (chk !== ENCODING_CONST) return 'Invalid checksum for ' + str;
//   return { prefix, words };
// };
