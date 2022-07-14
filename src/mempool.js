import { addressToScriptPubkey } from "./bitcoin";

const MEMPOOL_API_URL = "http://localhost:8080/api";

export const fetcher = async (url, cb, params = null) => {
  let opts = {};
  if (params) {
    opts = {
      method: 'POST',
      data: params
    };
  }
  return fetch(MEMPOOL_API_URL+url, opts)
    .then(response => {
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      return response.json();
    })
    .then(cb)
    .catch(error => console.error(error));
};

export const postMempoolOnchainTx = async (rawhextx) => {
  await fetcher("/tx", data => {
    console.log(data);
//  data=hexlify(tx.serialize()),
  }, rawhextx);
};

export const getMempoolTxsFromAddress = async (address) => {
  return await fetcher(`/address/${address}/txs`, data => {
    return data;
  });
};

export const getMempoolBlockheight = async () => {
  return fetcher("/blocks/tip/height", data => {
    return data;
  });
};

export const getMempoolLockupTx = async (address, scriptpubkey_address) => {
  let txs = await getMempoolTxsFromAddress(address);
  if (txs.length == 0) return null;
  let found = null;
  txs.forEach(tx => {
    tx.vout.forEach(vout => {
      if (vout.scriptpubkey_address === scriptpubkey_address) {
        found = {
          tx: tx,
          txid: tx.txid,
          vout: vout,
          vout_amount: vout.value,
          vout_i: tx.vout.indexOf(vout)
        }
      }
    });
  });
  return found;
}


