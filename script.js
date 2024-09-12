const cartIcon = document.querySelector(".cart-icon");
const closeCart = document.querySelector(".close-btn");
const cart = document.querySelector(".cart-wrapper");

let cartCounter = document.querySelector(".item-counter");
const cartItem = document.querySelector(".cart-item");

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
                              <p class="price-of-pokemon" data-product-id="${product.id}">${product.price}</p>
                            </div>`;
    productListHTML.appendChild(newProduct);

    // Inicializace počítadla pro každý produkt
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
    });
  });
};

// Změna tlačítka na volbu položek
const changeToChoiceOfItems = (button, productId) => {
  const counter = productCounters[productId]; // Získání počítadla pro konkrétní produkt

  button.innerHTML = `
    <div class="add-to-cart-options">
      <span class="add-item">+</span>
      <span class="number-of-items">${counter}</span>
      <span class="remove-item">-</span>
    </div>`;

  // Přidání posluchačů událostí na nově vytvořená tlačítka
  const addItemBtn = button.querySelector(".add-item");
  const removeItemBtn = button.querySelector(".remove-item");

  // Přidání event listenerů pro tlačítka "+", "-"
  addItemBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Zamezení opětovnému kliknutí na rodičovský button
    updateCounter(productId, 1); // Zvýšíme o 1
    button.querySelector(".number-of-items").textContent =
      productCounters[productId]; // Aktualizace zobrazení počtu položek
  });

  removeItemBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Zamezení opětovnému kliknutí na rodičovský button
    updateCounter(productId, -1); // Snížíme o 1

    if (productCounters[productId] <= 0) {
      changeToAddToCartBtn(button, productId); // Pokud je počet 0, změň tlačítko zpět na původní
    } else {
      button.querySelector(".number-of-items").textContent =
        productCounters[productId]; // Aktualizace zobrazení počtu položek
    }
  });
};

// Změna tlačítka zpět na "Add to Cart"
const changeToAddToCartBtn = (button, productId) => {
  productCounters[productId] = 1; // Resetujeme počítadlo

  button.innerHTML = `<img src="images/pokeball.png" alt="pokeball-image" />Add to Cart`;
};

// Aktualizace počtu položek
const updateCounter = (productId, change) => {
  let currentCount = productCounters[productId];
  currentCount += change;

  if (currentCount < 0) currentCount = 0; // Zamezení počtu menšího než 0

  productCounters[productId] = currentCount; // Aktualizace počítadla pro konkrétní produkt

  updateTotalPrice(productId, currentCount);
};

// Aktualizace celkové ceny
const updateTotalPrice = (productId, count) => {
  const productPriceElement = document.querySelector(
    `.product-text[data-product-id="${productId}"] .price-of-pokemon`
  );
  const totalPriceElement = document.querySelector(
    `.total-product-price[data-product-id="${productId}"]`
  );

  if (productPriceElement && totalPriceElement) {
    const productPrice = parseFloat(productPriceElement.textContent);
    totalPriceElement.textContent = `Total: $ ${(productPrice * count).toFixed(
      2
    )}`;
  }
};
