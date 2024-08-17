//   exchange rate API
const BASEURL = "https://api.exchangerate-api.com/v4/latest/USD";
let exchangeRates = {};

// fetching exchange rates from the API
const fetchExchangeRates = async () => {
    try {
        const response = await fetch(BASEURL);
        const data = await response.json();
        exchangeRates = data.rates;
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
    }
};

// Adding more countries options from codes.js
const populateDropdowns = () => {
    const dropdowns = document.querySelectorAll(".dropdown select");

    for (let select of dropdowns) {
        for (let Currcode in countryList) {
            let newoption = document.createElement("option");
            newoption.innerText = Currcode;
            newoption.value = Currcode;
            if (select.name === "from" && Currcode === "USD") {
                newoption.selected = "selected";
            } else if (select.name === "to" && Currcode === "INR") {
                newoption.selected = "selected";
            }
            select.append(newoption);
        }
        select.addEventListener("change", (evt) => {
            updateFlag(evt.target);
        });
    }
};


const updateFlag = (element) => {
    let Currcode = element.value;
    let Countrycode = countryList[Currcode];
    let newsrc = `https://flagsapi.com/${Countrycode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newsrc;
};

// Convert currency based on user input
const convertCurrency = () => {
    let amount = document.querySelector(".amount input");
    let amtVal = parseFloat(amount.value);
    
    if (isNaN(amtVal) || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    let fromCurrency = document.querySelector('select[name="from"]').value;
    let toCurrency = document.querySelector('select[name="to"]').value;

    if (fromCurrency === toCurrency) {
        // Same currency, no conversion needed
        document.querySelector(".msg").innerText = `${amtVal} ${fromCurrency}`;
        return;
    }

    // Perform conversion
    let fromRate = exchangeRates[fromCurrency];
    let toRate = exchangeRates[toCurrency];
    
    if (!fromRate || !toRate) {
        console.error("Invalid currency code.");
        return;
    }

    let convertedAmount = (amtVal / fromRate) * toRate;
    document.querySelector(".msg").innerText = `${amtVal} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
};

// Initializing the page with necessary data
const initialising = async () => {
    await fetchExchangeRates();
    populateDropdowns();
};

//  currency conversion
document.querySelector("#button").addEventListener("click", (evt) => {
    evt.preventDefault();
    convertCurrency();
});

// Initialize on page load
initialising();
