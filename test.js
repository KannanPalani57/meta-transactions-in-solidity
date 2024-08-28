
const { ethers } = require("ethers");
// const { TypedDataUtils } = require("eth-sig-util");

const forwarderAddress = "0x23d01Eb6BD026caAf2e4823295d3671b3e0194b9";
const targetAddress = "0x33C9e7c446AdeC607Eb35968873B734029310049";
const userAddress = ""; // Address of the user submitting the transaction
const relayerPrivateKey = ""; // Relayer's private key
const providerUrl = ""

const provider = new ethers.JsonRpcProvider(providerUrl);


const relayerWallet = new ethers.Wallet(relayerPrivateKey, provider);

const targetAbi = [{ "inputs": [{ "internalType": "address", "name": "trustedForwarder", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "gender", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "forwarder", "type": "address" }], "name": "isTrustedForwarder", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_username", "type": "string" }, { "internalType": "string", "name": "_gender", "type": "string" }], "name": "setValue", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "trustedForwarder", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "username", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }];

const targetContract = new ethers.Contract(targetAddress, targetAbi, provider);

async function main() {
    console.log(await provider.getTransactionCount(userAddress), "---");

    // Get nonce for the user
    const nonce = await provider.getTransactionCount(userAddress);

    // Meta-transaction data
    const txData = {
        target: targetAddress,
        value: 0,
        data: targetContract.interface.encodeFunctionData("setValue", ["Kannan", "Male"]),
        nonce: nonce.toString(),
        gas: 100000
    };

    // Define domain and types for EIP-712
    const domain = {
        name: "MinimalForwarder",
        version: "0.0.1",
        chainId: 80002, // Replace with your network's chain ID
        verifyingContract: forwarderAddress
    };

    const types = {
        MetaTransaction: [
            { name: "target", type: "address" },
            { name: "value", type: "uint256" },
            { name: "data", type: "bytes" },
            { name: "nonce", type: "uint256" },
            { name: "gas", type: "uint256" }
        ]
    };

    const connectedWallet = relayerWallet.connect(provider);

    // Sign the meta-transaction
    const signature = await connectedWallet.signTypedData(domain, types, txData);

    console.log("Signature:", signature);
    const abiCoder = new ethers.AbiCoder();

    // Create transaction for the relayer
    const tx = {
        from: userAddress,
        to: forwarderAddress,
        data: abiCoder.encode(
            ["address", "uint256", "bytes", "uint256", "uint256"],
            [targetAddress, 0, targetContract.interface.encodeFunctionData("setValue", ["Kannan", "Male"]), nonce, 100000]
        ),
        gasLimit: 100000
    };

    // Send transaction from relayer
    const txResponse = await relayerWallet.sendTransaction(tx);
    console.log("Transaction hash:", txResponse.hash);

    const receipt = await txResponse.wait();
    console.log("Transaction mined in block:", receipt.blockNumber);
}

// main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });



let forwardContractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "ECDSAInvalidSignature",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "length",
                "type": "uint256"
            }
        ],
        "name": "ECDSAInvalidSignatureLength",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "s",
                "type": "bytes32"
            }
        ],
        "name": "ECDSAInvalidSignatureS",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidShortString",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "str",
                "type": "string"
            }
        ],
        "name": "StringTooLong",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [],
        "name": "EIP712DomainChanged",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "eip712Domain",
        "outputs": [
            {
                "internalType": "bytes1",
                "name": "fields",
                "type": "bytes1"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "version",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "chainId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "verifyingContract",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "salt",
                "type": "bytes32"
            },
            {
                "internalType": "uint256[]",
                "name": "extensions",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "gas",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "nonce",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct MinimalForwarder.ForwardRequest",
                "name": "req",
                "type": "tuple"
            },
            {
                "internalType": "bytes",
                "name": "signature",
                "type": "bytes"
            }
        ],
        "name": "execute",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            }
        ],
        "name": "getNonce",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "gas",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "nonce",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct MinimalForwarder.ForwardRequest",
                "name": "req",
                "type": "tuple"
            },
            {
                "internalType": "bytes",
                "name": "signature",
                "type": "bytes"
            }
        ],
        "name": "verify",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

async function test() {

    const providerUrl = ""

    const provider = new ethers.JsonRpcProvider(providerUrl);

    const relayerWallet = new ethers.Wallet(relayerPrivateKey, provider);
    const abiCoder = new ethers.AbiCoder();

    const forwarderContract = new ethers.Contract(forwarderAddress, forwardContractABI, relayerWallet);

    let nonce = await forwarderContract.getNonce("0xc93A96c5B2Cdf4e766203e97CeaA91c36d677AaB")

    const forwardRequest = {
        from: "0xc93A96c5B2Cdf4e766203e97CeaA91c36d677AaB", // Replace with the actual from address
        nonce: nonce.toString(), // Replace with actual nonce
        to: "0x33C9e7c446AdeC607Eb35968873B734029310049", // Replace with the actual destination address
        value: 0, // Replace with the actual value (if any)
        gas: 100000, // Replace with the actual gas amount
        data: abiCoder.encode(
            ["address", "uint256", "bytes", "uint256", "uint256"],
            [targetAddress, 0, targetContract.interface.encodeFunctionData("setValue", ["Kannan", "Male"]), nonce, 100000]
        ) // Replace with the actual data payload
    };



    // Meta-transaction data
    const txData = {
        target: targetAddress,
        value: 0,
        data: targetContract.interface.encodeFunctionData("setValue", ["Kannan", "Male"]),
        nonce: nonce.toString(),
        gas: 100000
    };

    // Define domain and types for EIP-712
    const domain = {
        name: "MinimalForwarder",
        version: "0.0.1",
        chainId: 80002, // Replace with your network's chain ID
        verifyingContract: forwarderAddress
    };

    const types = {
        MetaTransaction: [
            { name: "target", type: "address" },
            { name: "value", type: "uint256" },
            { name: "data", type: "bytes" },
            { name: "nonce", type: "uint256" },
            { name: "gas", type: "uint256" }
        ]
    };

    const connectedWallet = relayerWallet.connect(provider);

    // Sign the meta-transaction
    const signature = await connectedWallet.signTypedData(domain, types, txData);


    // Call the execute function
    try {
        const signWallet = relayerWallet.connect(provider);

        const tx = await forwarderContract.execute(forwardRequest, signature, { value: 0, gasLimit: forwardRequest.gas });
        const receipt = await tx.wait();
        // return receipt;
        console.log("Transaction successful:", receipt);
    } catch (error) {
        // return error;
        console.error("Error calling execute:", error);
    }


};

test()