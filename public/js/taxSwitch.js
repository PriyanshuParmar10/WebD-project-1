let taxSwitch = document.getElementById("flexSwitchCheckDefault");

    taxSwitch.addEventListener("click", () => {
        let taxInfo = document.getElementsByClassName("tax-info");
        let priceElements = document.getElementsByClassName("price");

        for (let i = 0; i < priceElements.length; i++) {
            let priceElement = priceElements[i];
            let basePrice = parseFloat(priceElement.getAttribute("data-price"));

            if (taxSwitch.checked) {
                // Show original price
                priceElement.innerHTML = basePrice.toLocaleString("en-IN");
                taxInfo[i].style.display = "none";
            } else {
                // Show GST-inclusive price
                let newPrice = basePrice * 1.18;
                priceElement.innerHTML = newPrice.toLocaleString("en-IN");
                taxInfo[i].style.display = "inline";
            }
        }
    });