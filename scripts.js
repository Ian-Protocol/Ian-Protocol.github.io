//adds an event listener to execute onLoad method when page finished loading
document.addEventListener("DOMContentLoaded", load);

// Boolean for cart toggle.
let isCartOpen = false;

/*
    Create Card Function
    Function to create cards.
 */
function createCards(cardData, cardQuantity, discount) {
    // Get number of cards in dataset.
    let length = parseInt(cardData.length);

    // Create discount percentage.
    let discountPercentage = parseFloat((100.0 - parseFloat(discount)) / 100.0);

    // Create X random cards.
    for (let i = 0; i < cardQuantity; i++) {
        // Create elements.
        let cardArea = document.getElementsByClassName("card-area")[0];
        let cardName = document.createElement("h4");
        let article = document.createElement("article");
        let buyCard = document.createElement("div");
        let plusButton = document.createElement("button");
        let minusButton = document.createElement("button");
        let qtyInput = document.createElement("input");
        let addToCartButton = document.createElement("button");
        let price = document.createElement("div");
        let cardImg = document.createElement("img");

        // Choose random cards. If image is invalid, pick another.
        let cardNumber = Math.floor(Math.random() * length);
        let validImage = false;

        while (!validImage) {
            if (cardData[cardNumber].image_uris) {
                validImage = true;
            } else {
                cardNumber = Math.floor(Math.random() * length);
            }
        }

        // Populate card name.
        cardName.innerHTML = `${cardData[cardNumber].name}`;

        // Set valid image to card image.
        cardImg.src = `${cardData[cardNumber].image_uris.normal}`;
        cardImg.alt = `Image of ${cardName}.`;

        // Set classes.
        cardImg.className = "card-image";
        article.className = "card";
        cardName.className = "card-name";
        buyCard.className = "buy-card";
        minusButton.className = "increment-button";
        plusButton.className = "increment-button";
        qtyInput.className = "quantity-input";
        addToCartButton.className = "submit";
        price.className = "price";

        // Add aria-label.
        qtyInput.ariaLabel = "Enter Quantity.";


        // Create price & discounted price.
        let cardPrice = cardData[cardNumber].prices.usd;
        if (cardPrice == null) cardPrice = "0.50";

        if (discount != 0.0 && discount != null) {
            // Get discounted price.
            let discountedPrice = (parseFloat(cardPrice) * discountPercentage).toFixed(2);

            // Swap discounted price to price for cart.
            let previousPrice = cardPrice;
            cardPrice = discountedPrice;

            let strikethrough = document.createElement('span');
            price.style.color = "#eb6123";
            strikethrough.style.color = "#F1D4D4";
            strikethrough.className = "strikethrough";
            strikethrough.innerHTML = `$${previousPrice}`;
            price.innerHTML = ` $${discountedPrice}`;
            
            buyCard.appendChild(price);
            price.insertBefore(strikethrough, price.firstChild);
        } else {
            price.innerHTML = `$${cardPrice}`;
            buyCard.appendChild(price);
        }
    

        // Build increment buttons.
        minusButton.textContent = "-";
        minusButton.type = "button";

        plusButton.textContent = "+";
        plusButton.type = "button";

        let increment = true;
        minusButton.onclick = function() {
            updateQuantity(this, !increment);
        };
        plusButton.onclick = function() {
            updateQuantity(this, increment);
        };

        // Build add to cart button.
        addToCartButton.textContent = "Add";
        addToCartButton.type = "button";
        addToCartButton.onclick = function() {
            addToCart(this, cardData[cardNumber].name, null, cardPrice);
        };

        // Build quantity input.
        qtyInput.type = "number";
        qtyInput.id = "quantity";
        qtyInput.value = "0";
        qtyInput.min = "0";
        qtyInput.max = "99";

        // Insert the elements into the page.
		article.appendChild(cardName);
        article.appendChild(cardImg);
        article.appendChild(buyCard);

        buyCard.appendChild(minusButton);
        buyCard.appendChild(qtyInput);
        buyCard.appendChild(plusButton);
        buyCard.appendChild(addToCartButton);

        cardArea.appendChild(article);
    }
}

/*
    Update quantity function.
    Updates the quantity input per button clicked.
*/
function updateQuantity(elementClicked, increment) {
    // Find input element.
    var quantityInput = elementClicked.parentNode.querySelector("input[type='number']");

    // Get current quantity.
    var currentQuantity = parseInt(quantityInput.value);

    // Increment / decrement quantity as required.
    if (increment) {
        if (currentQuantity < 99) quantityInput.value = currentQuantity + 1;
    } else {
        if (currentQuantity > 0) quantityInput.value = currentQuantity - 1;
    }
}

/*
    Add to cart function
    Saves cart data to cache.
*/
function addToCart(elementClicked, cardName, quantity, price) {
    // Find input element if not null. If not, use quantity of input.
    if (elementClicked != null) {
        // Find and set quantity.
        var quantityInput = elementClicked.parentNode.querySelector("input[type='number']");
        quantity = parseInt(quantityInput.value);

         // Reset quantity.
        quantityInput.value = 0;
    }

    // If cache already exists, add to it. Otherwise create new.
    let cacheData = JSON.parse(localStorage.getItem('cache')) || {};

    // Build json with card data.
    if (cacheData[cardName]) {
        let existingQuantity = cacheData[cardName][0];
        existingQuantity += quantity;
        cacheData[cardName] = [existingQuantity, cacheData[cardName][1]];
    } else {
        cacheData[cardName] = [quantity];
        cacheData[cardName].push(price);
    }

    // Save card data.
    localStorage.setItem('cache', JSON.stringify(cacheData));
}

function getTotals() {
    // add up totals.
}

/*
    Load cart function.
    Adds elements to cart.
*/
function loadCart(){
    if (localStorage.getItem('cache')) {
        let cache = JSON.parse(localStorage.getItem('cache'));
        let cart = document.getElementById('cart');

        let keys = Object.keys(cache);
        for (let i = 0; i < keys.length; i++) {
            let cardName = keys[i];
            let cardData = cache[cardName];
            let quantity = cardData[0];
            let price = cardData[1];

            let cartItem = document.createElement('div');
            cartItem.className = "cart-item";
            cartItem.innerHTML = `Card Name: ${cardName}, Quantity: ${quantity}, Price: $${price}`;
            cart.appendChild(cartItem);
        }
    }
}

/*
    Clear cart function.
    Removes elements from cart.
*/
function clearCart() {
    // hide the cart elements.
    let cart = document.getElementById("cart");
    let cartElements = document.getElementsByClassName("cart-item");

    for (let i = cartElements.length - 1; i >= 0; i--) {
        cart.removeChild(cartElements[i]);
    }
}

/*
    Toggle cart function.
    Toggles the cart open & closed.
*/
function toggleCart() {
    let cartExplanation = document.getElementById("cart-total");

    if (isCartOpen) {
        clearCart();
        isCartOpen = false;
        cartExplanation.innerHTML = `Cart - Click to expand.`;
    } else {
        loadCart();
        isCartOpen = true;
        cartExplanation.innerHTML = `Cart - Click to close.`;
    }
}

/*
    load function
    Loading the json file - run when the page loads
*/
function load() {
    // Find quantity of card to load.
    let cardQuantity = document.getElementsByClassName("quantity")[0].innerHTML;
    let discount;

    if (document.getElementsByClassName("discount")[0] != null) {
        discount = document.getElementsByClassName("discount")[0].innerHTML;
    } else {
        discount = null;
    }

    // Make cart clickable if it exists.
    if (document.getElementById("cart") != null) {
        let cart = document.getElementById("cart");
        cart.addEventListener('click', toggleCart);
    }

    // Load card data and send quantity.
    fetch('data/cards_legendary.json')
        .then(function(result) {
            return result.json();
        })
        .then(function(data) {
            createCards(data, cardQuantity, discount);
        });
}