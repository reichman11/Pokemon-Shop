const cartIcon = document.querySelector(".cart-icon");
const closeCart = document.querySelector(".close-btn");
const cart = document.querySelector(".cart-wrapper");

let counter = 1;
let cartCounter = document.querySelector(".item-counter");
const cartItem = document.querySelector(".cart-item");

//Vyjížděcí menu
cartIcon.addEventListener("click", () => {
  cart.classList.toggle("show-cart");
});
closeCart.addEventListener("click", () => {
  cart.classList.toggle("show-cart");
});

const plusItem = () => {
  const addItem = document.querySelector(".add-item");
  addItem.addEventListener("click", () => {
    counter++;
  });
};

const minusItem = () => {
  const removeItem = document.querySelector(".remove-item");
  removeItem.addEventListener("click", () => {
    if (counter > 0) {
      counter--;
    }
    if (counter <= 0) {
      setTimeout(changeToAddToCartBtn, 10); // nastaveno zpoždení, aby se mohla provest changeContent funkce.
    }
  });
};

const changeToAddToCartBtn = () => {
  addToCartBtn.innerHTML = `<img src="images/pokeball.png" alt="pokeball-image" />Add to
  Cart`;
  counter = 1;
};

const changeToChoiceOfItems = () => {
  addToCartBtn.innerHTML = `<div class="add-to-cart-options">
                                <span class="add-item">+</span>
                                <span class="number-of-items">${counter}</span>
                                <span class="remove-item">-</span>
                              </div>`;

  cartItem.classList.toggle("show-cart-item");

  plusItem();
  minusItem();
};

const addToCartBtn = document.querySelector(".add-to-cart-btn");
addToCartBtn.addEventListener("click", () => {
  changeToChoiceOfItems();
});
