const cartIcon = document.querySelector(".cart-icon");
const closeCart = document.querySelector(".close-btn");
const cart = document.querySelector(".cart-wrapper");

// Mapa pro uložení počítadel jednotlivých produktů
const productCounters = {};

// Vyjížděcí menu
cartIcon.addEventListener("click", () => {
  cart.classList.toggle("show-cart");
});
closeCart.addEventListener("click", () => {
  cart.classList.toggle("show-cart");
});

// Načítání dat ze souboru .json
const initApp = () => {
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      products = data;
      addDataToHTML();
    })
    .catch((error) => console.error("Error loading JSON:", error));
};

initApp();

// Přidání dat do HTML
const addDataToHTML = () => {
  const productListHTML = document.querySelector(".product-card-box");

  products.forEach((product) => {
    const newProduct = document.createElement("div");
    newProduct.classList.add("product-card");
    newProduct.innerHTML = `<div class="product-card-image">
                              <img src="images/${product.image}" alt="${product.name} image" product-id="${product.id}" />
                              <button class="add-to-cart-btn" product-id="${product.id}">
                                <img src="images/pokeball.png" alt="pokeball-image" />Add to Cart
                              </button>
                            </div>
                            <div class="product-text">
                              <p class="name-of-pokemon" product-id="${product.id}">${product.name}</p>
                              <p class="price-of-pokemon" product-id="${product.id}">$ ${product.price}</p>
                            </div>`;

    productListHTML.appendChild(newProduct);

    productCounters[product.id] = 1; // Výchozí hodnota počítadla pro každý produkt
  });

  attachEventListeners();
};

// Připojení posluchačů událostí
const attachEventListeners = () => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.target.closest("button").getAttribute("product-id");
      changeToChoiceOfItems(e.target.closest("button"), id);
      addToCart(id); // Přidání položky do košíku
    });
  });
};

// Přidání položky do košíku
const addToCart = (id) => {
  const cartItemsList = document.querySelector(".cart-items-list");
  let cartItem = document.querySelector(`.cart-item[product-id="${id}"]`);

  if (!cartItem) {
    cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.setAttribute("product-id", id);

    const product = products.find((p) => p.id == id);
    cartItem.innerHTML = `<div>
                            <img src="images/${product.preview}" alt="#" product-id="${product.id}" />
                          </div>
                          <p class="product-name">${product.name}</p>
                          <p class="total-product-price" product-id="${product.id}">$ ${product.price}</p>
                          <div class="add-remove-box">
                            <span class="add-item">+</span>
                            <span class="item-counter" product-id="${id}">${productCounters[id]}</span>
                            <span class="remove-item">-</span>
                          </div>`;

    cartItemsList.appendChild(cartItem);

    // Přidání posluchačů událostí na tlačítka "+" a "-"
    cartItem.querySelector(".add-item").addEventListener("click", () => {
      updateCounter(id, 1);
    });

    cartItem.querySelector(".remove-item").addEventListener("click", () => {
      updateCounter(id, -1);
    });
  }
  updateTotalPrice();
};
// Změna tlačítka na volbu položek
const changeToChoiceOfItems = (button, id) => {
  const counter = productCounters[id]; // Získání počítadla pro konkrétní produkt

  button.innerHTML = `
    <div class="add-to-cart-options">
      <span class="add-item">+</span>
      <span class="number-of-items" product-id="${id}">${counter}</span>
      <span class="remove-item">-</span>
    </div>`;

  // Přidání posluchačů událostí na nově vytvořená tlačítka
  const addItemBtn = button.querySelector(".add-item");
  const removeItemBtn = button.querySelector(".remove-item");

  // Přidání event listenerů pro tlačítka "+", "-"
  addItemBtn.addEventListener("click", () => {
    button.querySelector(".number-of-items").textContent = productCounters[id]; // Aktualizace zobrazení počtu položek
    updateCounter(id, 1); // Zvýšíme o 1
  });

  removeItemBtn.addEventListener("click", () => {
    updateCounter(id, -1); // Snížíme o 1

    if (productCounters[id] <= 0) {
      changeBtnToAddToCart(button, id); // Pokud je počet 0, změň tlačítko zpět na původní
      removeItemFromCart(id); // Odstraň položku z košíku
    } else {
      button.querySelector(".number-of-items").textContent =
        productCounters[id]; // Aktualizace zobrazení počtu položek
    }
  });
};

// Změna tlačítka zpět na "Add to Cart"
const changeBtnToAddToCart = (button, id) => {
  productCounters[id] = 1; // Restart počítadla
  button.innerHTML = `<img src="images/pokeball.png" alt="pokeball-image" />Add to Cart`;
};

// Aktualizace počtu položek
const updateCounter = (id, change) => {
  let currentCount = productCounters[id];
  currentCount += change;

  // Zabráníme záporným hodnotám
  if (currentCount <= 0) {
    currentCount = 1; // Nastavíme na 0, pokud by se dostalo pod 0

    // Změna tlačítka zpět na "Add to Cart", pokud je počet 0
    const productCardButton = document.querySelector(
      `.add-to-cart-btn[product-id="${id}"]`
    );
    if (productCardButton) {
      changeBtnToAddToCart(productCardButton, id);
    }

    // Odstranění položky z košíku
    removeItemFromCart(id);
  }

  productCounters[id] = currentCount; // Aktualizace počítadla pro konkrétní produkt

  // Aktualizace počítadla pro košík
  productCounters[id] = currentCount;
  const cartItemCounter = document.querySelector(
    `.item-counter[product-id="${id}"]`
  );

  // Aktualizace počítadla na tlačítku produktové karty
  const btnItemCounter = document.querySelector(
    `.number-of-items[product-id="${id}"]`
  );

  if (cartItemCounter && btnItemCounter) {
    cartItemCounter.textContent = currentCount;
    btnItemCounter.textContent = currentCount;
  }

  //Součet ceny pro jednotlivé položky
  const totalProductPrice = document.querySelector(
    `.total-product-price[product-id="${id}"]`
  );
  const productPrice = document.querySelector(
    `.price-of-pokemon[product-id="${id}"]`
  );

  let productPriceNumber = productPrice.textContent.replace("$", "").trim();
  productPriceNumber = parseInt(productPriceNumber);

  let totalPrice = parseInt(productPriceNumber * cartItemCounter.textContent);
  totalProductPrice.innerHTML = `$ ${totalPrice}`;

  updateTotalPrice();
};

// Aktualizace celkové ceny
const updateTotalPrice = () => {
  let totalPrice = 0;

  // Získání všech cen jednotlivých produktů
  const productPrices = document.querySelectorAll(".total-product-price");

  productPrices.forEach((priceElement) => {
    const priceText = priceElement.textContent.replace("$", "").trim();
    const price = parseFloat(priceText);

    totalPrice += price; // Přičtení ceny k celkové částce
  });

  // Zobrazení celkové ceny v košíku
  const totalCartPriceElement = document.querySelector(".total-cart-price");
  totalCartPriceElement.textContent = `Total price: $ ${totalPrice}`;
};

// Odstranění položky z košíku
const removeItemFromCart = (id) => {
  const cartItem = document.querySelector(`.cart-item[product-id="${id}"]`);
  if (cartItem) {
    cartItem.remove();
  }
  updateTotalPrice();
};
