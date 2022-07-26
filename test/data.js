export const scripts = [{
  name: "P2SH - Script Hash",
  hex: "a914748284390f9e263a4b766a75d0633c50426eb87587",
  asm: "OP_HASH160 748284390f9e263a4b766a75d0633c50426eb875 OP_EQUAL",
  address: "2N3sGiyscxqd3r6DQSbgXT738ZwhUpBqkej",
  type: "scripthash"
}, {
  name: "P2PKH - Pay to Pubkey Hash",
  asm: "OP_DUP OP_HASH160 9f21a07a0c7c3cf65a51f586051395762267cdaf OP_EQUALVERIFY OP_CHECKSIG",
  hex: "76a9149f21a07a0c7c3cf65a51f586051395762267cdaf88ac",
  address: "mv2N1zPzvGDXJhZoRkKoAE9EeJ1GYri1GH",
  type: "pubkeyhash"
}, {
  name: "Boltz Lockup Output 0",
  asm: "0 8699f5c59f931c0f0db92937bf5872942e6848f5",
  hex: "00148699f5c59f931c0f0db92937bf5872942e6848f5",
  address: "bcrt1qs6vlt3vljvwq7rde9ymm7krjjshxsj84yvlunq",
  type: "witness_v0_keyhash"
}];

export const transactions = [{
  name: "p2pkh",
  raw: "01000000016dddc5afd5010756868bdccc5c7084588b2c07e7fb0aa01cdfb832a8e8804107040000006a473044022046b84f70abe894ea55d666cccba847bb5af23fc05d553ef86975b47ac8cf001902203d64bdfd8806b2de3524236da63c7a8bb316a2d4cf9b6f34c197483d845085b60121023321bbd4aa0f3cebd7e93645cbc9925a38fa1260aeeda497459bc31983240fd1ffffffff01c70f9b00000000001976a9149f21a07a0c7c3cf65a51f586051395762267cdaf88ac00000000",
  data: {
    "txid": "61b2da9704e436eeea9ffeaa82381a7e07daa8324a2077c82dda8fdf40abdd34",
    "hash": "61b2da9704e436eeea9ffeaa82381a7e07daa8324a2077c82dda8fdf40abdd34",
    "version": 1,
    "size": 191,
    "vsize": 191,
    "weight": 764,
    "locktime": 0,
    "vin": [
      {
        "txid": "074180e8a832b8df1ca00afbe7072c8b5884705cccdc8b86560701d5afc5dd6d",
        "vout": 4,
        "scriptSig": {
          "asm": "3044022046b84f70abe894ea55d666cccba847bb5af23fc05d553ef86975b47ac8cf001902203d64bdfd8806b2de3524236da63c7a8bb316a2d4cf9b6f34c197483d845085b6[ALL] 023321bbd4aa0f3cebd7e93645cbc9925a38fa1260aeeda497459bc31983240fd1",
          "hex": "473044022046b84f70abe894ea55d666cccba847bb5af23fc05d553ef86975b47ac8cf001902203d64bdfd8806b2de3524236da63c7a8bb316a2d4cf9b6f34c197483d845085b60121023321bbd4aa0f3cebd7e93645cbc9925a38fa1260aeeda497459bc31983240fd1"
        },
        "sequence": 4294967295
      }
    ],
    "vout": [
      {
        "value": 0.10162119,
        "n": 0,
        "scriptPubKey": {
          "asm": "OP_DUP OP_HASH160 9f21a07a0c7c3cf65a51f586051395762267cdaf OP_EQUALVERIFY OP_CHECKSIG",
          "hex": "76a9149f21a07a0c7c3cf65a51f586051395762267cdaf88ac",
          "address": "mv2N1zPzvGDXJhZoRkKoAE9EeJ1GYri1GH",
          "type": "pubkeyhash"
        }
      }
    ]
  }
}, {
  name: "Pre Segwit",
  raw: "0100000001c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd3704000000004847304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901ffffffff0200ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000",
  data: {
    "txid": "f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16",
    "hash": "f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16",
    "version": 1,
    "size": 275,
    "vsize": 275,
    "weight": 1100,
    "locktime": 0,
    "vin": [
      {
        "txid": "0437cd7f8525ceed2324359c2d0ba26006d92d856a9c20fa0241106ee5a597c9",
        "vout": 0,
        "scriptSig": {
          "asm": "304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d09[ALL]",
          "hex": "47304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901"
        },
        "sequence": 4294967295
      }
    ],
    "vout": [
      {
        "value": 10.00000000,
        "n": 0,
        "scriptPubKey": {
          "asm": "04ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84c OP_CHECKSIG",
          "hex": "4104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac",
          "type": "pubkey"
        }
      },
      {
        "value": 40.00000000,
        "n": 1,
        "scriptPubKey": {
          "asm": "0411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3 OP_CHECKSIG",
          "hex": "410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac",
          "type": "pubkey"
        }
      }
    ]
  }
}, {
  name: "Boltz Lockup",
  raw: "01000000000101790764183f386e658f8ffc692a276ed8d449d87f4b06b2e0c31b9f5307b6cc480000000000fdffffff012dd90000000000001600148699f5c59f931c0f0db92937bf5872942e6848f503483045022100852baf71f015f5dab35fc8cf4f297c84157b347901e86240b6b34ce86e6521e5022051ab62041aa3cf518289d612e7ebf686372ff2c3192232375448a52dd846717f01205cc17a2a01e77d5cbf4dc9cbc00bb382a625c923fa7f792b6acb5d2d06573bab6a8201208763a91467e2986a1ce9d210034ee448acf9ec9504312eb8882102b950b4c7159b90b43c2a29f23ec0cc7fd08f976e5bc7e1e70ca87305a8c0ae786775036c590bb1752103d9f332c71c73fc22d4beaf02703e08fa9744fc5d7ea4b81dc6b8cc086989906968ac00000000",
  data: {
    "txid": "5382a3ad510726fc7920d5ac0a966d5bb6be089fb6a6c60f5283530c09b48a25",
    "hash": "abe91331b2a0269ca837749cb81dd0b4ad2327582de62f91ec446ee2089792d6",
    "version": 1,
    "size": 298,
    "vsize": 136,
    "weight": 544,
    "locktime": 0,
    "vin": [
      {
        "txid": "48ccb607539f1bc3e0b2064b7fd849d4d86e272a69fc8f8f656e383f18640779",
        "vout": 0,
        "scriptSig": {
          "asm": "",
          "hex": ""
        },
        "txinwitness": [
          "3045022100852baf71f015f5dab35fc8cf4f297c84157b347901e86240b6b34ce86e6521e5022051ab62041aa3cf518289d612e7ebf686372ff2c3192232375448a52dd846717f01",
          "5cc17a2a01e77d5cbf4dc9cbc00bb382a625c923fa7f792b6acb5d2d06573bab",
          "8201208763a91467e2986a1ce9d210034ee448acf9ec9504312eb8882102b950b4c7159b90b43c2a29f23ec0cc7fd08f976e5bc7e1e70ca87305a8c0ae786775036c590bb1752103d9f332c71c73fc22d4beaf02703e08fa9744fc5d7ea4b81dc6b8cc086989906968ac"
        ],
        "sequence": 4294967293
      }
    ],
    "vout": [
      {
        "value": 0.00055597,
        "n": 0,
        "scriptPubKey": {
          "asm": "0 8699f5c59f931c0f0db92937bf5872942e6848f5",
          "hex": "00148699f5c59f931c0f0db92937bf5872942e6848f5",
          "address": "bcrt1qs6vlt3vljvwq7rde9ymm7krjjshxsj84yvlunq",
          "type": "witness_v0_keyhash"
        }
      }
    ]
  }
}, {
  name: "Boltz Fuckup",
  raw: "02000000000101c94d639f43cd5879be37a006f18208e8afa7389b4e9349f1ff3393e687faac7e0100000000ffffffff013dda000000000000220020cd17a94c2728abc4b8e3fc8fa3610909e0192941aa9e80c573b44e50d572c162034730440220431ee181aa2a572a2fdb82b235689b36e1c46709d9e9fd70b699b08435050781022039702d6cdb320c7287e3d5718ef9232ed79343ff9c706b495564c3844dc7449801205cc17a2a01e77d5cbf4dc9cbc00bb382a625c923fa7f792b6acb5d2d06573bab6a8201208763a91467e2986a1ce9d210034ee448acf9ec9504312eb8882102b950b4c7159b90b43c2a29f23ec0cc7fd08f976e5bc7e1e70ca87305a8c0ae786775036c590bb1752103d9f332c71c73fc22d4beaf02703e08fa9744fc5d7ea4b81dc6b8cc086989906968ac00000000",
  data: {
    "txid": "48ccb607539f1bc3e0b2064b7fd849d4d86e272a69fc8f8f656e383f18640779",
    "hash": "caab15e3c268d40685ccdbb7eea2182c30d39ac986cba9e059e5473fe05e5880",
    "version": 2,
    "size": 309,
    "vsize": 148,
    "weight": 591,
    "locktime": 0,
    "vin": [
      {
        "txid": "7eacfa87e69333fff149934e9b38a7afe80882f106a037be7958cd439f634dc9",
        "vout": 1,
        "scriptSig": {
          "asm": "",
          "hex": ""
        },
        "txinwitness": [
          "30440220431ee181aa2a572a2fdb82b235689b36e1c46709d9e9fd70b699b08435050781022039702d6cdb320c7287e3d5718ef9232ed79343ff9c706b495564c3844dc7449801",
          "5cc17a2a01e77d5cbf4dc9cbc00bb382a625c923fa7f792b6acb5d2d06573bab",
          "8201208763a91467e2986a1ce9d210034ee448acf9ec9504312eb8882102b950b4c7159b90b43c2a29f23ec0cc7fd08f976e5bc7e1e70ca87305a8c0ae786775036c590bb1752103d9f332c71c73fc22d4beaf02703e08fa9744fc5d7ea4b81dc6b8cc086989906968ac"
        ],
        "sequence": 4294967295
      }
    ],
    "vout": [
      {
        "value": 0.00055869,
        "n": 0,
        "scriptPubKey": {
          "asm": "0 cd17a94c2728abc4b8e3fc8fa3610909e0192941aa9e80c573b44e50d572c162",
          "hex": "0020cd17a94c2728abc4b8e3fc8fa3610909e0192941aa9e80c573b44e50d572c162",
          "address": "bcrt1qe5t6jnp89z4ufw8rlj86xcgfp8spj22p420gp3tnk389p4tjc93qkqqd3v",
          "type": "witness_v0_scripthash"
        }
      }
    ]
  }
}, {
  name: "Boltz Redeem",
  raw: "0100000000010153537daccb2b3805ac8ae0ff67d06e77283e8a686e6d4b19e689d16c81ff12f80000000000ffffffff02d29d75000000000016001404e99916f2af8e3eab3319bc779facba198c682525de000000000000220020cd17a94c2728abc4b8e3fc8fa3610909e0192941aa9e80c573b44e50d572c16202483045022100d9640e5a9506c5b4ab952c7a1ae76f1d7547098d5e46d20271aa3032483630b3022010b48228a467357e73c816e5b86c86dde69750374bb34e03ee2b4fb5983903ae012103ea22d644f67fde5c82c09ef595b0092a75d8ce2362508102fb4c9b4ec493f63700000000",
  data: {
    "txid": "7eacfa87e69333fff149934e9b38a7afe80882f106a037be7958cd439f634dc9",
    "hash": "c5aeabb6439af9024f644960154838d1dfb8d5d8a7a982a486d3c5b2b2ed177d",
    "version": 1,
    "size": 235,
    "vsize": 153,
    "weight": 610,
    "locktime": 0,
    "vin": [
      {
        "txid": "f812ff816cd189e6194b6d6e688a3e28776ed067ffe08aac05382bcbac7d5353",
        "vout": 0,
        "scriptSig": {
          "asm": "",
          "hex": ""
        },
        "txinwitness": [
          "3045022100d9640e5a9506c5b4ab952c7a1ae76f1d7547098d5e46d20271aa3032483630b3022010b48228a467357e73c816e5b86c86dde69750374bb34e03ee2b4fb5983903ae01",
          "03ea22d644f67fde5c82c09ef595b0092a75d8ce2362508102fb4c9b4ec493f637"
        ],
        "sequence": 4294967295
      }
    ],
    "vout": [
      {
        "value": 0.07708114,
        "n": 0,
        "scriptPubKey": {
          "asm": "0 04e99916f2af8e3eab3319bc779facba198c6825",
          "hex": "001404e99916f2af8e3eab3319bc779facba198c6825",
          "address": "bcrt1qqn5ej9hj478ra2enrx7808avhgvcc6p9vltcdz",
          "type": "witness_v0_keyhash"
        }
      },
      {
        "value": 0.00056869,
        "n": 1,
        "scriptPubKey": {
          "asm": "0 cd17a94c2728abc4b8e3fc8fa3610909e0192941aa9e80c573b44e50d572c162",
          "hex": "0020cd17a94c2728abc4b8e3fc8fa3610909e0192941aa9e80c573b44e50d572c162",
          "address": "bcrt1qe5t6jnp89z4ufw8rlj86xcgfp8spj22p420gp3tnk389p4tjc93qkqqd3v",
          "type": "witness_v0_scripthash"
        }
      }
    ]
  }
}];
