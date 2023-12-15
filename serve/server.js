import express from "express";
import cors from "cors";
import yahooFinance from "yahoo-finance2";

const app = express();

const getSign = async (ticker) => {
    let data =  await yahooFinance.quote(ticker);
    return data.dividendRate;
}

app.use(cors());

app.get("/hello", async (req, res) => {
    try {
        let data = await getSign(req.query.ticker);
        res.send({
            yieldAmount: data,
            found: true
        });
    } catch (e) {
        res.send({
            yieldAmount:  0.00,
            found: false
        });
    }
});

app.listen(3000, () => {
    console.log("running server");
});