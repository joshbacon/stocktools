<a href="http://stocktools.joshbacon.ca" target="_blank" style="display: flex; gap: 1em; align-items: center; padding-bottom: 1em" >
  <img src="src/assets/icon.ico" alt="Logo" width="59" height="59">
  <h style="font-size: 28px; font-weight: bold">Stock tools</h>
</a>

** UNDER CONSTRUCTION: the yahoo finance API I'm using for market data migrated to TypeScript so I need to refactor the server **

A collection of stock calculation tools I use for managing my personal investments.

## Growth Calculator
Enter your number of shares and average cost to see at a glance total growth as well as a per-stock breakdown.

## Dividend Calculator
Enter the number of shares you have of which stocks and get the most up to date numbers thanks to the 
<a href="https://www.npmjs.com/package/yahoo-finance2" target="_blank">yahoo finance API</a> running on a custom Node server. See your effective dividend yield and how much you make in dividends each year, quarter, month, day, and even by the minute.

## Option Calculator
Enter the fees your brokerage charges and details of the contract(s) purchased to find the premium required to breakeven. You can also calculate profit by entering a desired sale premium price.