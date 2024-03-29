let loglevel = 0;
let loglevels = [ "INFO", "DEBUG", "VERBOSE" ];

export const logger = (log, lvl = 0) => {
  if(loglevel >= lvl) {
    if (lvl == 0) {
      console.log(log);
    } else {
      console.log(loglevels[lvl], "::", log);
    }
  }
}

export const randombytes = (length) => {
  return crypto.getRandomValues(new Uint8Array(32));
};

export const hextobytes = (hex) => {
  let binary = [];
  for (let i = 0; i < hex.length; i+=2) {
    let byte = hex[i]+hex[i+1];
    binary.push(parseInt(byte, 16));
  }
  return binary;
}

export const hexfrombytes = (bytes) => {
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, 0);
  }
  return hex;
}
export const hexfromnumber = (n) => {
  return n.toString(16).padStart(2, 0);
}

export const numberfromhex = (hex) => {
  return parseInt(hex, 16);
}

export const numberfrombytes = (bytes) => {
  return parseInt(hexfrombytes(bytes), 16);
}

export const numberfrombyte = (byte) => {
  return parseInt(byte, 16);
}

export const create_enums = (values) => {
  const enumObject = {};
  for (const val of values) {
    enumObject[val] = val;
  }
  return Object.freeze(enumObject);
}
