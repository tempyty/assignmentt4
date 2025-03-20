// Product Page
// Array of product objects with links
function indexdisplay() {
    let productlist = document.getElementById("product-container");
    let htmltag = "";

    const products = [
        { name: "Crocs McDonald Limited Edition", price: "RM 199.99", image: "img/mcd.png", link: "/mcd.html" },
        { name: "Crocs Batman Limited Edition", price: "RM 500.00", image: "img/batman.png", link: "/batman.html" },
        { name: "Crocs Pac-Man Limited Edition", price: "RM 700.00", image: "img/pacman.png", link: "/pacman.html" },
        { name: "Crocs Pikachu Limited Edition", price: "RM 2000.00", image: "img/pikachu.png", link: "/pikachu.html" },
        { name: "Crocs Charizard Limited Edition", price: "RM 1500.00", image: "img/charizard.png", link: "/charizard.html" },
        { name: "Crocs Mike Wazowski Limited Edition", price: "RM 1.00", image: "img/mike.png", link: "/mike.html" }
    ];

    products.forEach((product, i) => {
        htmltag += `<div class='col-lg-4 col-md-6 mb-4'>
                        <div class='card'>
                            <div class='bg-image hover-zoom ripple' data-mdb-ripple-color='light'>
                                <img src='${product.image}' class='w-100'>
                            </div>
                            <div class='card-body'>
                                <a href='${product.link}' class='text-reset'>
                                    <h5 class='card-title mb-3'>${product.name}</h5>
                                </a>
                                <h6 class='mb-3'>${product.price}</h6>
                            </div>
                        </div>
                    </div>`;
    });

    productlist.innerHTML = htmltag;
}

window.addEventListener('load', () => {
    indexdisplay();
});

// Register Page
function checknameinput() {
    let name = document.getElementById('inputname');
    let message = document.getElementById('checknametext');

    if (name.value.trim() === "") {
        message.textContent = "Invalid Name";
        name.classList.add("is-invalid");
    } else {
        message.textContent = "";
        name.classList.remove("is-invalid");
        name.classList.add("is-valid");
    }
}

function checkemailinput() {
    let email = document.getElementById('inputemail');
    let message = document.getElementById('checkemailtext');

    if (email.value.trim() === "" || !validateEmail(email.value)) {
        message.textContent = "Invalid Email";
        email.classList.add("is-invalid");
        email.focus();
    } else {
        message.textContent = "";
        email.classList.remove("is-invalid");
        email.classList.add("is-valid");
    }
}

function validateEmail(email) {
    const atSymbol = email.indexOf("@");
    const dot = email.lastIndexOf(".");

    return !(atSymbol < 1 || dot <= atSymbol + 1 || dot === email.length - 1);
}

function cleardata() {
    let form = document.getElementById('registerform');
    form.reset();

    document.querySelectorAll('.is-invalid, .is-valid').forEach((el) => {
        el.classList.remove('is-invalid', 'is-valid');
    });

    document.getElementById('checknametext').textContent = "";
    document.getElementById('checkemailtext').textContent = "";
}

function register(event) {
    event.preventDefault();//Prevent form from submitting

    let name = document.getElementById('inputname');
    let email = document.getElementById('inputemail');
    let address = document.getElementById('address');
    let gender = document.querySelector('input[name="gender"]:checked').value;

    //Check if any input is invalid
    if (name.classList.contains("is-invalid") || email.classList.contains("is-invalid")) {
        alert("Please correct the errors before registering.");
        return false;
    }
    //Check if any field is empty
    if (name.value.trim() === "" || email.value.trim() === "" || address.value.trim() === "") {
        alert("Please fill in all the fields.");
        return false;
    }

    localStorage.setItem('name', name.value);
    localStorage.setItem('email', email.value);
    localStorage.setItem('gender', gender);
    localStorage.setItem('address', address.value);

    alert("Registered successfully!");
    window.location.href = "index.html";
}

// Cart Page
// Array to store items in cart
let itemincart = JSON.parse(localStorage.getItem('Isitemincart')) || [];

// Function to add item to cart
function additem(name, price, image) {
    let cartNumber = parseInt(localStorage.getItem('cartnumber')) || 0;
    
    let newItem = { name, price, image };
    itemincart.push(newItem);
    cartNumber++;
    
    localStorage.setItem('Isitemincart', JSON.stringify(itemincart));
    localStorage.setItem('cartnumber', cartNumber);
    
    cartdisplay();
}

// To display the number in cart
function cartdisplay() {
    let cart = parseInt(localStorage.getItem('cartnumber')) || 0;
    document.getElementById('cartdisplay').textContent = cart;
}

// Maintain the cart number when reloading the page
window.addEventListener('load', () => {
    cartdisplay();
    setupAddToCartButtons();
});

// Attach event listeners to "Add to Cart" buttons on product pages
function setupAddToCartButtons() {
    document.querySelectorAll(".btn-outline-dark").forEach(button => {
        button.addEventListener("click", function() {
            let productName = this.getAttribute("data-name");
            let productPrice = this.getAttribute("data-price");
            let productImage = this.getAttribute("data-image");
            additem(productName, productPrice, productImage);
        });
    });
}


function displayCart() {
    let cartItems = JSON.parse(localStorage.getItem("Isitemincart")) || [];
    let productContainer = document.getElementById("cart-items");
    let totalCount = 0;
    let totalPrice = 0;

    productContainer.innerHTML = ""; // Clear previous cart display

    if (cartItems.length > 0) {
        let groupedItems = {};

        // Group items by name
        cartItems.forEach(item => {
            if (groupedItems[item.name]) {
                groupedItems[item.name].quantity += 1;
            } else {
                groupedItems[item.name] = { ...item, quantity: 1 };
            }
        });

        Object.values(groupedItems).forEach((item, index) => {
            totalCount += item.quantity;
            totalPrice += parseFloat(item.price) * item.quantity;

            let itemHTML = `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div class="d-flex">
                        <img src="${item.image}" class="img-fluid me-3" style="width: 50px; height: 50px;">
                        <div>
                            <h6 class="mb-0">${item.name}</h6>
                            <p class="mb-0">RM ${item.price} x ${item.quantity}</p>
                        </div>
                    </div>
                    <button class="btn btn-danger btn-sm remove-item" data-name="${item.name}">Remove</button>
                </div>
            `;
            productContainer.innerHTML += itemHTML;
        });

        document.getElementById("cart-count").textContent = totalCount;
        document.getElementById("total-price").textContent = totalPrice.toFixed(2);
    } else {
        productContainer.innerHTML = "<p class='text-center'>Your cart is empty.</p>";
        document.getElementById("cart-count").textContent = "0";
        document.getElementById("total-price").textContent = "0.00";
    }

    // Add event listeners to remove buttons
    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", function () {
            removeItem(this.dataset.name);
        });
    });
}

// Remove one item from cart
function removeItem(itemName) {
    let cartItems = JSON.parse(localStorage.getItem("Isitemincart")) || [];

    let index = cartItems.findIndex(item => item.name === itemName);
    if (index !== -1) {
        cartItems.splice(index, 1);
    }

    localStorage.setItem("Isitemincart", JSON.stringify(cartItems));
    localStorage.setItem("cartnumber", cartItems.length);
    
    displayCart();
    cartdisplay();
}

// Clear cart
document.getElementById("clearCart").addEventListener("click", function () {
    localStorage.removeItem("Isitemincart");
    localStorage.setItem("cartnumber", 0);
    displayCart();
    cartdisplay();
});

// Load Cart on Page Load
window.addEventListener("load", displayCart);