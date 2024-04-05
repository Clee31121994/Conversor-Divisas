// script.js
const dropList = document.querySelectorAll("form select"),
    fromCurrency = document.querySelector(".from select"),
    toCurrency = document.querySelector(".to select");

for (let i = 0; i < dropList.length; i++) {
    for (let currency_code in country_list) {
        let selected = i == 0 ? currency_code == "USD" ? "selected" : "" : currency_code == "VEF" ? "selected" : "";
        let optionTag = `<option value="${currency_code}">${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e => {
        loadFlag(e.target);
    });
}

function loadFlag(element) {
    const countryCode = country_list[element.value];
    if (countryCode) {
        const imgTag = element.parentElement.querySelector("img");
        imgTag.src = `https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`;
    }
}

function getExchangeRate() {
    const amount = document.querySelector("form input");
    const exchangeRateTxt = document.querySelector("form .exchange-rate");
    let amountVal = numeral(amount.value).value() || 0;

    if (amountVal === 0) {
        amount.value = "1";
        amountVal = 1;
    }

    exchangeRateTxt.innerText = "Obteniendo tipo de cambio...";
    let url = `https://v6.exchangerate-api.com/v6/fab2180ad02958d0f1f6718f/latest/${fromCurrency.value}`;
    fetch(url)
        .then(response => response.json())
        .then(result => {
            if (result.result === "success") {
                if (fromCurrency.value === toCurrency.value) {
                    exchangeRateTxt.innerText = `${numeral(amountVal).format('0,0.00')} ${fromCurrency.value} = ${numeral(amountVal).format('0,0.00')} ${toCurrency.value}`;
                } else {
                    let exchangeRate = result.conversion_rates[toCurrency.value];
                    let totalExRate = amountVal * exchangeRate;
                    exchangeRateTxt.innerText = `${numeral(amountVal).format('0,0.00')} ${fromCurrency.value} = ${numeral(totalExRate).format('0,0.00')} ${toCurrency.value}`;
                }
            } else {
                exchangeRateTxt.innerText = "Error al obtener el tipo de cambio";
            }
        })
        .catch(() => {
            exchangeRateTxt.innerText = "Algo salió mal";
        });
}

window.addEventListener("load", () => {
    getExchangeRate();

    const getButton = document.querySelector("form button");
    getButton.addEventListener("click", e => {
        e.preventDefault();
        getExchangeRate();
    });

    const exchangeIcon = document.querySelector("form .icon");
    exchangeIcon.addEventListener("click", () => {
        let tempCode = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = tempCode;
        loadFlag(fromCurrency);
        loadFlag(toCurrency);
        getExchangeRate();
    });
});