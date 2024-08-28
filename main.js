const express = require("express")

const cors = require("cors")

const { getMetaTx, makeMetaTx}  = require("./meta_tx")


const app = express()

app.use(cors())
app.use(express.json())



app.post("/post", async (req, res) => {
    const { name, gender } = req.body;
    test(name, gender)

    // print("res", result.receipt.hash);
})


app.post('/metadata', async (req, res) => {
    let { fromAddress, storingName} = req.body;

    console.log({
        storingName, 
        fromAddress
    })

    let data = await getMetaTx( fromAddress, storingName)

    console.log(data, "data");

    return res.json({
        data
    })

})

app.post("/maketx", async (req, res) => {

    const { sig, fromAddress, storingName } = req.body;

    console.log("sig", sig)
    let tx = await makeMetaTx(sig, fromAddress, storingName)

    return res.json({
        tx
    })
})

app.listen(8001, () => {
    console.log("Server is running on the port 8001")
})

