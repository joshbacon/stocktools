// Empty ticker data object
const empty = {
    ticker: "",
    numShares: null,
    yieldAmount: "",
    found: false
};

// List of selected ticker data
let tickerList = [
    {...empty}
];

// Update the ticker list with newly input data
const changeTicker = async (index, numShares, ticker) => {
    // Only assign new values if they are not null
    if (numShares !== null) tickerList[index].numShares = numShares;
    if (ticker !== null) {
        tickerList[index].ticker = ticker.toUpperCase();

        // Get the ticker data then update the local data
        getTickerData(ticker.toUpperCase()).then((res) => {
            tickerList[index].yieldAmount = res.yieldAmount;
            tickerList[index].found = res.found;
            // Update visual after data is stored
            updateTickers();
        });
    }
}

// Remove a ticker from the list and update the visual
const removeTicker = (index) => {
    if (tickerList.length <= 1) return;
    // Remove specified element from array
    tickerList.splice(index, 1);
    // Update the visual
    updateTickers();
}

// Empty the ul and re-enter tickers
// (need to clear so the keys match the indicies)
const updateTickers = () => {
    let list = document.getElementById("list");
    list.innerHTML = '';
    tickerList.forEach((tick, i) => {
        appendTicker(i);
    });
}

// Add an empty slot for another ticker to the list
const addTicker = () => {
    tickerList.push({...empty});
    appendTicker(tickerList.length -1);
}

// Add another list item to the HTML list
const appendTicker = (index) => {
    let temp = document.createElement("li");
    temp.setAttribute("key", index);
    temp.innerHTML = generateElem(index);
    document.getElementById("list").appendChild(temp);
}

// Generates a list item element depening on the given data
const generateElem = (index) => {
    return `
        <div>
            <input id="numSharesIn" type="number" min="0"${tickerList[index].numShares !== null ? " value="+tickerList[index].numShares : ''} placeholder="35" onchange="changeTicker(${index}, this.value, null);">
            <p> shares of </p>
            <input id="tickerIn" type="text"${tickerList[index].ticker !== '' ? " value=\"" + tickerList[index].ticker + "\"" : ''} placeholder="ENB.TO" onchange="changeTicker(${index}, null, this.value);">
        </div>
        <div>
            <p>at</p>
            <p id="amount">$${tickerList[index].yieldAmount !== '' ? tickerList[index].yieldAmount : '0.00'}</p>
            <p>a share / year</p>
            <button onclick="removeTicker(${index});"><i class="fa fa-trash"></i></button>
        </div>
    `;
}

// Redo the calculations and update the right panel
const updateOutput = () => {

    // Sum the weighted yield of each ticker
    let total = tickerList.reduce((total, tick) => {
        return total +
            (  
                tick.found && tick.yieldAmount !== undefined ?
                (tick.numShares * tick.yieldAmount) :
                0
            );
    }, 0);

    // Update text
    document.getElementById("year")
        .firstElementChild.innerHTML = `
            ${total > 0 ? '' : '> '}
            $${total.toFixed(2)}
        `;
    document.getElementById("quarter")
        .firstElementChild.innerHTML = `
            ${total/4 > 0 ? '' : '> '}
            $${(total/4).toFixed(2)}
        `;
    document.getElementById("month")
        .firstElementChild.innerHTML = `
            ${total/12 > 0 ? '' : '> '}
            $${(total/12).toFixed(2)}
        `;
    document.getElementById("day")
        .firstElementChild.innerHTML = `
            ${total/365 > 0 ? '' : '> '}
            $${(total/365).toFixed(2)}
        `;
    document.getElementById("minute")
        .firstElementChild.innerHTML = `
            ${total/525960 > 0 ? '' : '> '}
            $${(total/525960).toFixed(2)}
        `;
}



// ~~~ API Section ~~~

let url = "http://127.0.0.1:3000/hello?ticker="

const getTickerData = async (ticker) => {
    let tickerPath = url + ticker;
    let data = await fetch(tickerPath)
        .then(response => response.json())
        .then(json => json);
    return data;
}
