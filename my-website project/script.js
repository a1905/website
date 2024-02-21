const basketItems = {};
const productBasket = document.querySelector(".product-basket");
const sumElement = document.querySelector(".sum");

// Ürünleri yükleyelim ve sepete ekleyelim
fetch("products.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((products) => {
    const row = document.querySelector(".product-row");
    let html = "";

    products.forEach((product) => {
      const productId = product.id;

      html += `
    <div class="col-md-4  mt-4">
      <div class="card h-100 shadow-sm" data-id="${productId}">
        <div class="card-img-container">
          <img src="${
            product.images[0]
          }" class="img-fluid card-img-top" alt="Product Image">
          <div class="basket">
            <i class="addBasket bi bi-cart2"></i>
            <i class="bi bi-heart"></i>
            <i class="bi bi-share"></i>
          </div>
        </div>
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="price">${product.price.toFixed(2)} USD</p>
        </div>
      </div>
    </div>
  `;
    });
    row.innerHTML = html;

    const addBasketBtns = document.querySelectorAll(".addBasket");
    addBasketBtns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const productCard = event.target.closest(".card");
        const productId = productCard.getAttribute("data-id");
        const productImage = productCard.querySelector(".card-img-top").src;
        const productName = productCard.querySelector(".card-title").innerText;
        const productPrice = parseFloat(
          productCard.querySelector(".price").innerText.replace(" USD", "")
        );

        addToBasket(productId, productImage, productName, productPrice);
      });
    });
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

// Sepete ürün ekleme
function addToBasket(productId, image, name, price) {
  if (basketItems[productId]) {
    basketItems[productId].quantity++;
    basketItems[productId].totalPrice += price;
  } else {
    basketItems[productId] = {
      quantity: 1,
      totalPrice: price,
      image,
      name,
      price,
    };
  }

  updateBasket();
}

// Sepeti güncelleme
function updateBasket() {
  let html = "";
  let totalPrice = 0;

  for (const productId in basketItems) {
    const item = basketItems[productId];
    html += `
      <div  class="product-area">
        <img src="${item.image}" alt="" />
        <div class="product-info">
          <div class="product-name">${item.name}</div>
          <div class="product-quantity">${item.quantity}</div>
          <div class="price">${item.totalPrice.toFixed(2)} USD</div>
          <i class="basket-delete-btn bi bi-x-circle"></i>
        </div>
      </div>
    `;
    totalPrice += item.totalPrice;
  }

  productBasket.innerHTML = html;

  sumElement.textContent = totalPrice.toFixed(2) + " USD";

  const basketBtn = document.querySelector(".open-basket");
  const basketWrapper = document.querySelector(".basket-wrapper");
  const closeBtn = document.querySelector(".close-btn");

  basketBtn.addEventListener("click", () => {
    basketWrapper.style.right = "0";
  });

  // Sepeti kapatma
  closeBtn.addEventListener("click", () => {
    basketWrapper.style.right = "-300px";
  });

  productBasket.style.bottom =
    Object.keys(basketItems).length === 0 ? "0" : "initial";
}

const menuBtn = document.querySelector(".bi-list");
const navbarList = document.querySelector(".navbar-list");
menuBtn.addEventListener("click", toggleMenu);

function toggleMenu() {
  if (navbarList.style.display === "block") {
    navbarList.style.display = "none";
  } else {
    navbarList.style.display = "block";
  }
}
