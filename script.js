const cartIcon = document.querySelector(".cart-icon");
const closeCart = document.querySelector(".close-btn");
const cart = document.querySelector(".cart-wrapper");

let cartCounter = document.querySelector(".item-counter");

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
                              <img src="images/${product.image}" alt="${product.name} image" data-product-id="${product.id}" />
                              <button class="add-to-cart-btn" data-product-id="${product.id}">
                                <img src="images/pokeball.png" alt="pokeball-image" />Add to Cart
                              </button>
                            </div>
                            <div class="product-text">
                              <p class="name-of-pokemon" data-product-id="${product.id}">${product.name}</p>
                              <p class="price-of-pokemon" data-product-id="${product.id}">$ ${product.price}</p>
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
      const productId = e.target
        .closest("button")
        .getAttribute("data-product-id");
      changeToChoiceOfItems(e.target.closest("button"), productId);
      addToCart(productId); // Přidání položky do košíku
    });
  });
};

// Přidání položky do košíku
const addToCart = (productId) => {
  const cartItemsList = document.querySelector(".cart-items-list");
  let cartItem = document.querySelector(
    `.cart-item[data-product-id="${productId}"]`
  );

  if (!cartItem) {
    cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.setAttribute("data-product-id", productId);

    const product = products.find((p) => p.id == productId);
    cartItem.innerHTML = `<div>
                            <img src="images/${product.preview}" alt="#" data-product-id="${product.id}" />
                          </div>
                          <p class="product-name">${product.name}</p>
                          <p class="total-product-price" data-product-id="${product.id}">$ ${product.price}</p>
                          <div class="add-remove-box">
                            <span class="add-item">+</span>
                            <span class="item-counter" data-product-id="${product.id}">${productCounters[productId]}</span>
                            <span class="remove-item">-</span>
                          </div>`;

    cartItemsList.appendChild(cartItem);

    // Přidání posluchačů událostí na tlačítka "+" a "-"
    cartItem.querySelector(".add-item").addEventListener("click", () => {
      updateCounter(productId, 1);
    });

    cartItem.querySelector(".remove-item").addEventListener("click", () => {
      updateCounter(productId, -1);
    });
  }
};

// Změna tlačítka na volbu položek
const changeToChoiceOfItems = (button, productId) => {
  const counter = productCounters[productId]; // Získání počítadla pro konkrétní produkt

  button.innerHTML = `
    <div class="add-to-cart-options">
      <span class="add-item">+</span>
      <span class="number-of-items" data-product-id="${productId}">${counter}</span>
      <span class="remove-item">-</span>
    </div>`;

  // Přidání posluchačů událostí na nově vytvořená tlačítka
  const addItemBtn = button.querySelector(".add-item");
  const removeItemBtn = button.querySelector(".remove-item");

  // Přidání event listenerů pro tlačítka "+", "-"
  addItemBtn.addEventListener("click", () => {
    button.querySelector(".number-of-items").textContent =
      productCounters[productId]; // Aktualizace zobrazení počtu položek
    updateCounter(productId, 1); // Zvýšíme o 1
  });

  removeItemBtn.addEventListener("click", () => {
    updateCounter(productId, -1); // Snížíme o 1

    if (productCounters[productId] <= 0) {
      changeBtnToAddToCart(button, productId); // Pokud je počet 0, změň tlačítko zpět na původní
      removeItemFromCart(productId); // Odstraň položku z košíku
    } else {
      button.querySelector(".number-of-items").textContent =
        productCounters[productId]; // Aktualizace zobrazení počtu položek
    }
  });
};

// Změna tlačítka zpět na "Add to Cart"
const changeBtnToAddToCart = (button, productId) => {
  productCounters[productId] = 1; // Restart počítadla
  button.innerHTML = `<img src="images/pokeball.png" alt="pokeball-image" />Add to Cart`;
};

// Aktualizace počtu položek
const updateCounter = (productId, change) => {
  let currentCount = productCounters[productId];
  currentCount += change;

  // Zabráníme záporným hodnotám
  if (currentCount <= 0) {
    currentCount = 1; // Nastavíme na 0, pokud by se dostalo pod 0

    // Změna tlačítka zpět na "Add to Cart", pokud je počet 0
    const productCardButton = document.querySelector(
      `.add-to-cart-btn[data-product-id="${productId}"]`
    );
    if (productCardButton) {
      changeBtnToAddToCart(productCardButton, productId);
    }

    // Odstranění položky z košíku
    removeItemFromCart(productId);
  }

  productCounters[productId] = currentCount; // Aktualizace počítadla pro konkrétní produkt

  // Aktualizace počítadla pro košík
  productCounters[productId] = currentCount;
  const cartItemCounter = document.querySelector(
    `.cart-item[data-product-id="${productId}"] .item-counter`
  );
  // Aktualizace počítadla na tlačítku produktové karty
  const productCardCounter = document.querySelector(
    `.add-to-cart-btn[data-product-id="${productId}"] .number-of-items`
  );

  if (cartItemCounter && productCardCounter) {
    cartItemCounter.textContent = currentCount;
    productCardCounter.textContent = currentCount;
  }
};

// Odstranění položky z košíku
const removeItemFromCart = (productId) => {
  const cartItem = document.querySelector(
    `.cart-item[data-product-id="${productId}"]`
  );
  if (cartItem) {
    cartItem.remove();
  }
};
