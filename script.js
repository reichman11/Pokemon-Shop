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
  const addItem = document.querySelectorAll(".add-item");
  addItem.forEach((e) => {
    e.addEventListener("click", () => {
      counter++;
      cartItem.classList.remove("show-cart-item");
      updateItemCounter();
    });
  });
};

const minusItem = () => {
  const removeItem = document.querySelectorAll(".remove-item");
  removeItem.forEach((e) => {
    e.addEventListener("click", () => {
      if (counter > 0) {
        counter--;
        updateItemCounter();
      }
      if (counter <= 0) {
        setTimeout(changeToAddToCartBtn, 10); // nastaveno zpoždení, aby se mohla provest changeContent funkce.
      }
    });
  });
};

const changeToAddToCartBtn = () => {
  addToCartBtn.innerHTML = `<img src="images/pokeball.png" alt="pokeball-image" />Add to
  Cart`;
  cartItem.classList.add("show-cart-item");
  counter = 1;
  updateItemCounter();
};

const addToCartBtn = document.querySelector(".add-to-cart-btn");
addToCartBtn.addEventListener("click", () => {
  cartItem.classList.remove("show-cart-item");
  changeToChoiceOfItems();
});

const addRemoveBox = document.querySelector(".add-remove-box");

const changeToChoiceOfItems = () => {
  addRemoveBox.innerHTML = `<span class="add-item">+</span>
                            <span class="number-of-items">${counter}</span>
                            <span class="remove-item">-</span>`;
  addToCartBtn.innerHTML = `<div class="add-to-cart-options">
                                <span class="add-item">+</span>
                                <span class="number-of-items">${counter}</span>
                                <span class="remove-item">-</span>
                              </div>`;

  plusItem();
  minusItem();
};

const updateItemCounter = () => {
  // Aktualizování položek
  const totalProductPrice = document.querySelector(".total-product-price");
  const productPrice = document.querySelector(".product-price");

  const numberOfItems = document.querySelectorAll(".number-of-items");
  numberOfItems.forEach((e) => {
    e.textContent = counter;
  });

  let totalPrice = parseInt(productPrice.textContent) * counter;
  totalProductPrice.innerHTML = `$ ${totalPrice}`;
};

// // Vytvoření funkce pro nahrání dalších dat ze souboru .json
// const initApp = () => {};
// //získání dat z .json
// fetch("products.json")
//   .then((response) => response.json())
//   .then((data) => {
//     listOfProducts = data;

//     addDataToHTML();
//   });

// initApp();

// // přidání dat do HTML
// const addDataToHTML = () => {
//   const productListHTML = document.querySelector(".product-card-box");
//   productListHTML.innerHTML = "";
//   if (listOfProducts.length > 0) {
//     listOfProducts.forEach((product) => {
//       const newProduct = document.createElement("div");
//       newProduct.classList.add("product-card");
//       newProduct.innerHTML = `<div class="product-card-image">
//                                 <img src="images/${product.image}" alt="${product.name} image" />
//                                 <button class="add-to-cart-btn item-chooser">
//                                 <img src="images/pokeball.png" alt="pokeball-image" />Add to Cart </button>
//                               </div>
//                               <div class="product-text">
//                                 <p class="name-of-pokemon">${product.name}</p>
//                                 <p class="price-of-pokemon">${product.price}</p>
//                               </div>`;
//       productListHTML.appendChild(newProduct);
//     });
//   }
// };
