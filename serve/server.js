import express from "express";
import cors from "cors";
import yahooFinance from "yahoo-finance2";

const app = express();

const getSign = async (ticker) => {
    let data =  await yahooFinance.quote(ticker);
    return data;
}

app.use(cors());

app.get("/hello", async (req, res) => {
    try {
        let {longName, dividendRate} = await getSign(req.query.ticker);
        res.send({
            name: longName,
            yieldAmount: dividendRate,
            found: true
        });
    } catch (e) {
        res.send({
            name: "not found",
            yieldAmount:  0.00,
            found: false
        });
    }
});

app.listen(3000, () => {
    console.log("running server");
});