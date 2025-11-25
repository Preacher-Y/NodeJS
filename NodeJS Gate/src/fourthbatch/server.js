import express from 'express'

const app = express()

const CurrencyRate ={
    "usd":1300,
    "eur":1500,
    "gbp":1600,
}

app.get('/convert',(req,res)=>{
    try {
        const {amount, currency} = req.query;
        if (!amount||amount < 0||!currency||!['usd','eur','gbp'].includes(currency)) {
            res.status(400).json({message:"Invalid amount or currency"})
        }

        const convertedAmount = amount * CurrencyRate[currency]
        res.status(200).json({input:{amount, currency}, convertedAmount, unit:"RWF"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})