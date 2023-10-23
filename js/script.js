const currentPageURL = window.location.href;


async function loadContent() {
    const contentContainer = document.getElementById('content');
    const hash = window.location.hash.slice(1);
    const navLinks = document.querySelectorAll('.header-nav-top-link');
    navLinks.forEach(link => link.classList.remove('active'));
    const currentNavLink = document.getElementById(`${hash}-link`);
    if (currentNavLink) {
        currentNavLink.classList.add('active');
    }
}
window.addEventListener('hashchange', loadContent);
loadContent()
async function handleRoute() {
    const path = window.location.hash.substr(1) || '/';
    switch (path) {
        case '/':
            displayMainPage();
            break;
        case '/home':
            displayHomePage();
            break;
        case '/bag':
            displayAboutPage();
            break;
        default:
            displayErrorPage();
        // console.error(`Error: Path '${path}' not recognized`);
    }
}
async function fetchData() {
    try {
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (!data || !Array.isArray(data.products)) {
            throw new Error('Invalid data format received.');
        }
        return data.products;
    } catch (error) {
        // console.error('Error fetching or parsing data:', error);
        throw error;
    }
}
async function loadFileLocalStorage() {
    const data = await fetchData();
    localStorage.setItem(`product`, JSON.stringify(data))
}
loadFileLocalStorage()

async function displayHomePage() {
    const content = document.getElementById('content')
    content.innerHTML = ""
    const storedData = localStorage.getItem('product');
    const parsedData = JSON.parse(storedData);
    let elem = document.getElementById('content');
    parsedData.forEach((item) => {
        elem.innerHTML += `
        <div class="card-product" 
            id="${item.id}" data-rating="${item.rating}" data-images="${item.images}" data-description="${item.description}" data-discount="${item.discountPercentage}" data-brand="${item.brand}" data-category="${item.category}">
            <img src="${item.thumbnail}" class="card-product-image" alt="">
            <h4 class="card-product-title">${item.title}</h4>
            <p class="card-product-model-name">${item.stock}</p>
            <div class="card-product-group">
                <p class="card-product-group-price">$${item.price}</p>
                <button class="card-product-group-link">
                    <i class="fas fa-cart-plus card-product-group-link-icon"></i>
                </button>
            </div>
        </div>
        `;
    });
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const clearButton = document.getElementById('clearButton');
    let filteredProducts;
    searchButton.addEventListener('click', async function (e) {
        e.preventDefault()
        const searchQuery = searchInput.value.trim().toLowerCase();
        if (searchQuery === "") {
            filteredProducts = parsedData;
        } else {
            filteredProducts = parsedData.filter(item =>
                item.title.toLowerCase().includes(searchQuery)
            );
        }
        displayFilteredProducts();
    });
    clearButton.addEventListener('click', async function (e) {
        e.preventDefault()
        searchInput.value = "";
        filteredProducts = parsedData;
        displayFilteredProducts();
    });
    async function displayFilteredProducts() {
        elem.innerHTML = '';
        filteredProducts.forEach((item) => {
            elem.innerHTML += `
            <div class="card-product" id="${item.id}" data-brand="${item.brand}" data-category="${item.category}">
                <img src="${item.thumbnail}" class="card-product-image" alt="">
                <h4 class="card-product-title">${item.title}</h4>
                <p class="card-product-model-name">${item.stock}</p>
                <div class="card-product-group">
                    <p class="card-product-group-price">$${item.price}</p>
                    <button class="card-product-group-link">
                        <i class="fas fa-cart-plus card-product-group-link-icon"></i>
                    </button>
                </div>
            </div>
            `;
        });
        const card_product = document.querySelectorAll('.card-product-group-link');
        console.log(card_product);

        for (let e = 0; e < card_product.length; e++) {
            card_product[e].addEventListener('click', async function (e) {
                productClick(this);
                // console.log(e);
            });
        }
    }
    const card_product = document.querySelectorAll('.card-product-group-link')
    for (let e = 0; e < card_product.length; e++) {
        card_product[e].addEventListener('click', async function (e) {
            productClick(this)
            // console.log(e);
        })
    }

    const unrepeatable = [] // add localStorage product 
    const localBasket = []

    async function productClick(params) {
        let card = params.closest('.card-product-group')
        let openDiv = card.closest('.card-product')
        let product_id = card.closest('.card-product').getAttribute('id')
        let product_title = openDiv.querySelector('.card-product-title').innerHTML
        let product_modal = openDiv.querySelector('.card-product-model-name').innerHTML
        let product_price = openDiv.querySelector('.card-product-group-price').innerHTML.slice(1)
        let product_image = openDiv.querySelector('.card-product-image').getAttribute('src');
        let product_rating = openDiv.getAttribute('data-rating');
        let product_image_group = openDiv.getAttribute('data-images')
        let prouct_brand = openDiv.getAttribute('data-brand');
        let product_category = openDiv.getAttribute('data-category')
        let product_description = openDiv.getAttribute('data-description')
        let product_discount = openDiv.getAttribute('data-discount')
        const product_img_group = product_image_group.split(',')


        if (!unrepeatable.includes(product_id)) {
            unrepeatable.push(product_id);
            localBasket.push({
                id: product_id,
                price: product_price,
                modal: product_modal,
                title: product_title,
                image: product_image,
                rating: product_rating,
                brand: prouct_brand,
                category: product_category,
                description: product_description,
                discount: product_discount,
                image_group: product_img_group,
                quantity: "0"
            });
            localStorage.setItem(`basket`, JSON.stringify(localBasket))
        }
        const local_product = localStorage.getItem('basket');
        const card_basket = document.getElementById('card');
        if (local_product) {
            try {
                const local_product_json = JSON.parse(local_product);
                let cartHTML = '';

                local_product_json.forEach((cardigan) => {
                    cartHTML += `<a href="#/home" id="${cardigan.id}" data-price="${cardigan.price}" data-modal="${product_modal}" data-title="${product_title}" class="card-main-product-baster"><img src="${cardigan.image}" class="card-main-product-baster_image" alt="${cardigan.title}"></a>`;
                });

                card_basket.innerHTML = cartHTML;
            } catch (error) {
                console.error('Error localStorage:', error);
            }
        } else {
            console.error('not found localStorage');
        }
        const span_bb = document.querySelector('.card-main-all-price span');
        const product_local_price = localStorage.getItem('basket');
        if (product_local_price) {
            try {
                const to_json = JSON.parse(product_local_price);
                let totalMoney = 0;

                for (let i = 0; i < to_json.length; i++) {
                    const item = to_json[i];
                    if (item.price) {
                        totalMoney += item.price++
                    } else {
                        console.error('error');
                    }
                }

                // console.log('Total Money: ', totalMoney);
                span_bb.innerHTML = totalMoney;
            } catch (error) {
                console.error('Error parsing cart data from localStorage:', error);
            }
        } else {
            console.error('Basket information not found in localStorage');
        }
    }
}


async function displayMainPage() {
    const content = document.getElementById('content')
    content.innerHTML = ""
    document.getElementById('content').innerHTML = "Product"
}

async function bag_empty() {
    const content = document.getElementById('content')
    content.innerHTML = `<img src="./img/bag_empty.png" class="bag_empty-img" alt="logo"/>`
}

async function displayAboutPage() {
    const content = document.getElementById('content')
    content.innerHTML = ""
    try {
        // Attempt to retrieve data from local storage
        const response = localStorage.getItem('basket');

        if (!response) {
            // Handle the case where there is no data in local storage
            bag_empty()
            // content.innerHTML = "Basket is empty.";
            return;
        }

        const jsonList = JSON.parse(response);

        if (!Array.isArray(jsonList)) {
            // Handle the case where the data in local storage is not an array
            content.innerHTML = "Basket data is invalid.";
            return;
        }
        jsonList.forEach((item) => {

            // console.log(item);
            if (item == null) {
                console.log("null");
            } else {


                const truncateString = (string = '', maxLength = 200) =>
                    string.length > maxLength ?
                        `${string.substring(0, maxLength)}…` :
                        string
                const description = truncateString(item.description, 40)
                content.innerHTML += `
        
            <div class="item" id="${item.id}">
                <div class="item__left">
                    <img src="${item.image}" alt="" class="">
                </div>
                <div class="item__right">
                    <h1 class="item__right-theme">${item.title}</h1>
                    <p class="item_right-color">White</p>
                    <p class="item__right-text" data-description="${item.description}" >${description}</p>
                    <img src="./img/Rating.png" alt="" class="item__img-star">
                    <div class="price__count">
                        <h4 class="price__count-total" data-price="${item.price}" > $ <span>${item.price}</span></h4>
                        <div class="price__btns">
                            <button type="button" data-sumbol="minus" class="btn-minus-plus">-</button>
                            <span class="price__btn-count">1</span>
                            <button type="button" data-sumbol="plus" class="btn-minus-plus">+</button>
                        </div>
                    </div>
                </div>
                <button class="fas fa-trash-alt item__right-card-delete"></button>
            </div>`
            }
        });
        const product = document.querySelectorAll('.btn-minus-plus')
        for (let e = 0; e < product.length; e++) {
            product[e].addEventListener('click', async function (event) {
                plusMinusBtn(this, event);
            });
        }

        async function plusMinusBtn(params, event) {
            const parent = params.closest('.item');
            const parent_id = parent.getAttribute('id');
            const parent_priceElement = parent.querySelector('.price__count-total span');
            const product_data_price = parent.querySelector('.price__count-total').getAttribute('data-price')
            const parent_countElement = parent.querySelector('.price__btn-count');
            const parent_count = parseInt(parent_countElement.innerHTML, 10);
            const parent_sumbol = params.getAttribute('data-sumbol');

            // console.log(product_data_price);
            const number_class = Number(product_data_price)
            // console.log(number_class);

            if (parent_sumbol === "plus" && parent_countElement.innerHTML < 10) {
                parent_countElement.innerHTML = parent_count + 1;
                const parent_price = parseFloat(parent_priceElement.innerHTML);
                parent_priceElement.innerHTML = Math.floor((parent_price + parseFloat(number_class)));
            } else if (parent_sumbol === "minus" && parent_countElement.innerHTML > 1) {
                parent_countElement.innerHTML = parent_count - 1;
                const parent_price = parseFloat(parent_priceElement.innerHTML);
                parent_priceElement.innerHTML = Math.floor((parent_price - parseFloat(number_class)));
            }
        }

        async function updateLocalStorage(productId, quantity) {
            // Retrieve existing cart data from local storage or initialize an empty cart
            const existingCart = JSON.parse(localStorage.getItem('basket')) || {};

            // Update the quantity of the specified product in the cart
            existingCart[productId] = quantity;

            // Save the updated cart data back to local storage
            localStorage.setItem('basket', JSON.stringify(existingCart));
        }

        // Delete button event listener
        const deleteBtns = document.querySelectorAll('.item__right-card-delete');
        const card_cardigan = document.querySelectorAll('.card-main-product-baster')
        const card_cardigan_total_price = document.querySelector('.card-main-all-price span').innerHTML




        for (let i = 0; i < deleteBtns.length; i++) {
            const deleteBtn = deleteBtns[i];
            deleteBtn.addEventListener('click', async function () {
                const parent = this.closest('.item');
                const productId = parent.getAttribute('id');
                const product_price = parent.querySelector('.price__count-total').getAttribute('data-price')
                // console.log(product_price);

                const total_number = Number(card_cardigan_total_price)
                const product_number_price = Number(product_price)

                console.log(total_number - product_number_price);
                console.log();
                // total_num
                // card_cardigan_total_price = total_num
                // card_cardigan_total_price

                const price_count = []

                for (let index = 0; index < card_cardigan.length; index++) {
                    const element = card_cardigan[index]
                    const id = element.getAttribute('id')
                    if (productId == id) {
                        price_count.push(id)
                        element.remove()
                    }
                }
                // console.log(price_count);

                parent.remove();
                updateLocalStorage(productId,);

                const content = document.getElementById('content').innerHTML
                if (content.trim() === "") {
                    // Cart is empty, remove both "cart" and "basket" keys from local storage
                    localStorage.removeItem("cart");
                    localStorage.removeItem("basket");
                    bag_empty()
                }
            });
        }


    } catch (error) {
        // Handle any errors that occur during the process
        console.error('An error occurred:', error);
        content.innerHTML = "An error occurred while loading the basket.";
    }
}



async function displayErrorPage() {
    document.getElementById('content').innerHTML = '<h1>Error 404: Page Not Found</h1><p>The requested page does not exist.</p>'
}

window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);



let burgerBtn = document.querySelector(".menu_burger")
let burgerList = document.querySelector(".card")

burgerBtn.addEventListener("click", function () {
    burgerBtn.classList.toggle('active')
    burgerList.classList.toggle('active')
})