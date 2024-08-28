

const Web3 = require('web3');
const { ethers } = require("ethers")

const contractForwarderABI = require("./forwarder.json")


const ForwardRequest = [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'gas', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'data', type: 'bytes' },
];

const EIP712Domain = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
];

function getMetaTx(fromAddress, storingName) {
    try {
        console.log("getting signature")
        const web3 = new Web3(new Web3.providers.HttpProvider(""));
        const chainId = 80002;
        const name = "MinimalForwarder";
        const version = "0.0.1";

        const verifyingContract = "0x23d01Eb6BD026caAf2e4823295d3671b3e0194b9";
        const forwarderContract = new web3.eth.Contract(contractForwarderABI.abi, verifyingContract);
        const value = 0;
        const gas = 210000;
        let from = fromAddress;
        const to = "0x4f764CD6CcB9747265D18A4Fa6C05874a18feD56";

        // Get the function signature by hashing it and retrieving the first 4 bytes
        let fnSignatureTransfer = web3.utils.keccak256("setUsername(string)").substr(0, 10);

        // Encode the function parameters
        let fnParamsTransfer = web3.eth.abi.encodeParameters(
            ['string'],
            [storingName]
        );

        let data = fnSignatureTransfer + fnParamsTransfer.substr(2);

        return forwarderContract.methods.getNonce(from).call().then(nonce => {
            const metatx = {
                primaryType: 'ForwardRequest',
                types: { EIP712Domain, ForwardRequest },
                domain: { name, version, chainId, verifyingContract },
                message: { from, to, value, gas, nonce, data },
            }

            return { metatx };
        }).catch(err => {
            console.log("ERROR 1", err)
        });
    } catch (err) {
        console.log("ERROR 2", err)

    }
}

const PRIVATE_KEY = ""

const frontEndUser = ""

const frontEndUserAddress = ""

const getSig = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(""));


    // web3.eth.accounts.wallet.add(frontEndUser);

    let data = await getMetaTx();

    // // console.log(data, "data.metatx")

    // const signature = await web3.eth.sign(JSON.stringify(data.metatx), frontEndUserAddress);

    // console.log(signature, "signature")

    // console.log({frontEndUserAddress, data: JSON.stringify(data.metatx)}, "passing")
    // web3.currentProvider.send({
    //     jsonrpc: '2.0',
    //     method: 'eth_signTypedData_v4',
    //     params: [frontEndUserAddress, JSON.stringify(data.metatx)],
    //     id: new Date().getTime()
    // }, (error, result) => {
    //     if (error) {
    //         console.error('Error:', error);
    //     } else {
    //         console.log('Signature:', result);
    //     }
    // });

    console.log(JSON.stringify(data.metatx))
    // const signature = web3.eth.accounts.sign( JSON.stringify(data.metatx), frontEndUser);


    // return signature.signature




}


// getSig()

const makeMetaTx = async (sig, fromAddress, storingName) => {
    try {

        var provider = new ethers.JsonRpcProvider("");
        var wallet = new ethers.Wallet(PRIVATE_KEY, provider);

        let data = await getMetaTx(fromAddress,  storingName,);

        let signature = sig

        console.log(signature, "data")



        const forwarderContract = new ethers.Contract("0x23d01Eb6BD026caAf2e4823295d3671b3e0194b9", contractForwarderABI.abi, wallet)
        let transaction = await forwarderContract.execute(data.metatx.message, signature, {
            gasLimit: 500_000,
        });
        let trans = await transaction.wait();

        console.log(trans, "trans result")

        return trans;

        // res.json({
        //     paymaster: trans.from,
        //     fee: parseInt(trans.gasUsed._hex, 16)
        // })
    } catch (err) {
        console.log(err)
        // res.json({ error: err }).status(500);
    }
}






module.exports = {
    getMetaTx, 
    makeMetaTx
}