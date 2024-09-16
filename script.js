const cartIcon = document.querySelector(".cart-icon");
const closeCart = document.querySelector(".close-btn");
const cart = document.querySelector(".cart-wrapper");

const productCounters = {};

// SLIDER MENU
cartIcon.addEventListener("click", () => cart.classList.toggle("show-cart"));
closeCart.addEventListener("click", () => cart.classList.toggle("show-cart"));

// NAČTENÍ DAT ZE SOUBORU .JSON
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

// PŘIDÁNÍ DAT DO HTML
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

    productCounters[product.id] = 1;
  });

  addToCartListener();
};

// NAPOJENÍ EVENTLISTENER NA ADD-TO-CART TLAČÍTKO
const addToCartListener = () => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const buttonElement = e.target.closest("button");
      if (!buttonElement) {
        return;
      }
      const id = buttonElement.getAttribute("product-id");

      changeToChoiceOfItems(buttonElement, id);
      addToCart(id);
    });
  });
};

// PŘIDÁNÍ POLOŽKY DO KOŠÍKU
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

    // NAPOJENÍ EVENTLISTENER NA "+" A "-" TLAČÍTKA V KOŠÍKU
    cartItem
      .querySelector(".add-item")
      .addEventListener("click", () => updateCounter(id, 1));
    cartItem
      .querySelector(".remove-item")
      .addEventListener("click", () => updateCounter(id, -1));
  }
  updateTotalPrice();
};

// ZMĚNA TLAČÍTKA NA VOLBU POČTU POLOŽEK
const changeToChoiceOfItems = (button, id) => {
  const counter = productCounters[id]; // POČÍTADLO PRO JEDNOTLÍVÝ PRODUKT

  button.innerHTML = `
      <div class="add-to-cart-options">
        <span class="add-item">+</span>
        <span class="number-of-items" product-id="${id}">${counter}</span>
        <span class="remove-item">-</span>
      </div>`;

  // NAPOJENÍ EVENTLISTENER NA "+" A "-" TLAČÍTKA V TLAČÍTKU
  const addItemBtn = button.querySelector(".add-item");
  const removeItemBtn = button.querySelector(".remove-item");

  if (addItemBtn) {
    addItemBtn.addEventListener("click", () => {
      updateCounter(id, 1);
    });
  }

  if (removeItemBtn) {
    removeItemBtn.addEventListener("click", () => {
      updateCounter(id, -1);

      if (productCounters[id] <= 0) {
        changeBtnToAddToCart(button, id);
        removeItemFromCart(id);
      } else {
        const numberOfItemsElem = button.querySelector(".number-of-items");

        if (numberOfItemsElem) {
          numberOfItemsElem.textContent = productCounters[id];
        }
      }
    });
  }
};

// ZMĚNA NA PŮVODNÍ TLAČÍTKO ADD-TO-CART
const changeBtnToAddToCart = (button, id) => {
  productCounters[id] = 1;
  button.innerHTML = `<img src="images/pokeball.png" alt="pokeball-image" />Add to Cart`;
};

// AKTUALIZUJE POČET POLOŽEK
const updateCounter = (id, change) => {
  let currentCount = productCounters[id];
  currentCount += change;

  if (currentCount <= 0) {
    currentCount = 1;

    const productCardButton = document.querySelector(
      `.add-to-cart-btn[product-id="${id}"]`
    );
    if (productCardButton) {
      changeBtnToAddToCart(productCardButton, id);
    }

    removeItemFromCart(id);
  }

  productCounters[id] = currentCount;

  // AKTUALIZUJE POČÍTADLO V KOŠÍKU
  const cartItemCounter = document.querySelector(
    `.item-counter[product-id="${id}"]`
  );

  // AKTUALIZUJE POČÍTADLO V TLAČÍTKU PRODUKTOVÉ KARTY
  const btnItemCounter = document.querySelector(
    `.number-of-items[product-id="${id}"]`
  );

  if (cartItemCounter && btnItemCounter) {
    cartItemCounter.textContent = currentCount;
    btnItemCounter.textContent = currentCount;
  }

  // SOUČET CEN JEDNOTLIVÝCH PRODUKTŮ
  const totalProductPrice = document.querySelector(
    `.total-product-price[product-id="${id}"]`
  );
  const productPrice = document.querySelector(
    `.price-of-pokemon[product-id="${id}"]`
  );

  if (!productPrice || !totalProductPrice) {
    return;
  }

  let productPriceNumber = parseFloat(
    productPrice.textContent.replace("$", "").trim()
  );

  let itemCount = parseInt(cartItemCounter.textContent);
  let totalPrice = parseFloat(productPriceNumber * itemCount);

  totalProductPrice.innerHTML = `$ ${totalPrice}`;

  updateTotalPrice();
};

// AKTUALIZUJE NÁM CELKOVOU CENU POLOŽEK
const updateTotalPrice = () => {
  let totalPrice = 0;

  const productPrices = document.querySelectorAll(".total-product-price");

  productPrices.forEach((priceElement) => {
    const priceText = priceElement.textContent.replace("$", "").trim();
    const price = parseFloat(priceText);

    if (price) {
      totalPrice += price;
    }
  });

  const totalCartPrice = document.querySelector(".total-cart-price");
  if (totalCartPrice) {
    totalCartPrice.textContent = `Total price: $ ${totalPrice}`;
  }
};

// ODSTRANĚNÍ JEDNOTLIVÝCH POLOŽEK V KOŠÍKU
const removeItemFromCart = (id) => {
  const cartItem = document.querySelector(`.cart-item[product-id="${id}"]`);
  if (cartItem) {
    cartItem.remove();
  }
  updateTotalPrice();
};
