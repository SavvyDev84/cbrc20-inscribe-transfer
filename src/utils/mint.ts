import {
    script,
    Psbt,
    initEccLib,
    networks,
    Signer as BTCSigner,
    crypto,
    opcodes,
    payments,
} from "bitcoinjs-lib";
import { Taptree } from "bitcoinjs-lib/src/types";
import { ECPairFactory, ECPairAPI } from "ecpair";
import ecc from "@bitcoinerlab/secp256k1";
import axios, { AxiosResponse } from "axios";

import { IUTXO } from "../type";

initEccLib(ecc as any);
declare const window: any;
const ECPair: ECPairAPI = ECPairFactory(ecc);
const network = networks.testnet;

const config = {
    defaultOutput: 546,
    txRate: 50,
    mempoolNetwork: "testnet/",
    encodedAddressPrefix: "testnet",
    amount: 1,
    tick: "PLAY",
    max: 21000000,
    lim: 1000,
    dec: 8,
    mintAmount: 1000,
    transferAmount: 100,
};

export const mintToken = async (publicKey: string, receiveAddress: string) => {

    const publickeyBuffer = Buffer.from(publicKey, "hex").subarray(1, 33);

    const ordinalStacks = [
        publickeyBuffer,
        opcodes.OP_CHECKSIG,
        opcodes.OP_FALSE,
        opcodes.OP_IF,
        Buffer.from("ord"),
        opcodes.OP_1,
        Buffer.from(`cbrc-20:mint:${config.tick}=${config.mintAmount}`),
        opcodes.OP_0,
        Buffer.from('test'),
        opcodes.OP_ENDIF,
    ];
    const ordinalScript = script.compile(ordinalStacks);

    const scriptTree: Taptree = {
        output: ordinalScript,
    };

    const script_p2tr = payments.p2tr({
        internalPubkey: toXOnly(Buffer.from(publicKey, "hex")),
        scriptTree,
        network,
    });

    const inscribe_redeem = {
        output: ordinalScript,
        redeemVersion: 192
    }


    const inscribe_p2tr = payments.p2tr({
        internalPubkey: toXOnly(Buffer.from(publicKey, "hex")),
        scriptTree,
        redeem: inscribe_redeem,
        network
    });

    const address = script_p2tr.address ?? "";
    console.log("send coin to address", address);

    const fee = 5000;

    await window.unisat.sendBitcoin(address, fee + 546);

    const utxos = await waitUntilUTXO(address as string);
    console.log(`Using UTXO ${utxos[0].txid}:${utxos[0].vout}  ${utxos[0].value}`);

    const psbt = new Psbt({ network });

    psbt.addInput({
        hash: utxos[0].txid,
        index: utxos[0].vout,
        witnessUtxo: { value: utxos[0].value, script: script_p2tr.output! },
        tapLeafScript: [
            {
                leafVersion: inscribe_redeem.redeemVersion,
                script: inscribe_redeem.output,
                controlBlock: inscribe_p2tr.witness![inscribe_p2tr.witness!.length - 1]
            }
        ]
    });

    const change = utxos[0].value - 546 - fee;


    psbt.addOutput({
        address: receiveAddress, // change address
        value: 546
    });

    psbt.addOutput({
        address: receiveAddress, // change address
        value: change
    });


    await signAndSend(psbt, publicKey, address);
}

const blockstream = new axios.Axios({
    baseURL: `https://blockstream.info/testnet/api`
});

export async function waitUntilUTXO(address: string) {
    return new Promise<IUTXO[]>((resolve, reject) => {
        let intervalId: any;
        const checkForUtxo = async () => {
            try {
                const response: AxiosResponse<string> = await blockstream.get(`/address/${address}/utxo`);
                const data: IUTXO[] = response.data ? JSON.parse(response.data) : undefined;
                console.log(data);
                if (data.length > 0) {
                    resolve(data);
                    clearInterval(intervalId);
                }
            } catch (error) {
                reject(error);
                clearInterval(intervalId);
            }
        };
        intervalId = setInterval(checkForUtxo, 3000);
    });
}

export async function getTx(id: string): Promise<string> {
    const response: AxiosResponse<string> = await blockstream.get(`/tx/${id}/hex`);
    return response.data;
}

export async function signAndSend(psbt: Psbt, publicKeyTemp: string, address: string) {
    const publicKey = await window.unisat.getPublicKey();
    console.log('signed address => ', address)
    try {
        let res = await window.unisat.signPsbt(psbt.toHex(), {
            toSignInputs: [
                {
                    index: 0,
                    publicKey,
                    disableTweakSigner: true,
                }
            ]
        });

        console.log("signed psbt", res)

        res = await window.unisat.pushPsbt(res);

        console.log("txid", res)
    } catch (e) {
        console.log(e);
    }
}

export async function broadcast(txHex: string) {
    const response: AxiosResponse<string> = await blockstream.post('/tx', txHex);
    return response.data;
}

function tapTweakHash(pubKey: Buffer, h: Buffer | undefined): Buffer {
    return crypto.taggedHash(
        "TapTweak",
        Buffer.concat(h ? [pubKey, h] : [pubKey])
    );
}

function toXOnly(pubkey: Buffer): Buffer {
    return pubkey.subarray(1, 33);
}

function tweakSigner(signer: BTCSigner, opts: any = {}): BTCSigner {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let privateKey: Uint8Array | undefined = signer.privateKey!;
    if (!privateKey) {
        throw new Error("Private key is required for tweaking signer!");
    }
    if (signer.publicKey[0] === 3) {
        privateKey = ecc.privateNegate(privateKey);
    }

    const tweakedPrivateKey = ecc.privateAdd(
        privateKey,
        tapTweakHash(toXOnly(signer.publicKey), opts.tweakHash)
    );
    if (!tweakedPrivateKey) {
        throw new Error("Invalid tweaked private key!");
    }

    return ECPair.fromPrivateKey(Buffer.from(tweakedPrivateKey), {
        network: opts.network,
    });
}