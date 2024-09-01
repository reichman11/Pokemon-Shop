const cartIcon = document.querySelector(".cart-icon");
const closeCart = document.querySelector(".close-btn");
const cart = document.querySelector(".cart-wrapper");

let counter = 1;

//Vyjížděcí menu
cartIcon.addEventListener("click", () => {
  cart.classList.toggle("show-cart");
});
closeCart.addEventListener("click", () => {
  cart.classList.toggle("show-cart");
});

const addToCartBtn = document.querySelector(".add-to-cart-btn");

addToCartBtn.addEventListener("click", () => {
  addToCartBtn.innerHTML = `<div class="add-to-cart-options">
                              <span class="add-item">+</span>
                              <span class="number-of-items">${counter}</span>
                              <span class="remove-item">-</span>
                            </div>`;
  plusItem();
  minutItem();
});

const plusItem = () => {
  const addItem = document.querySelector(".add-item");
  addItem.addEventListener("click", () => {
    counter++;
  });
};

const minutItem = () => {
  const removeItem = document.querySelector(".remove-item");
  removeItem.addEventListener("click", () => {
    counter--;
  });
};
