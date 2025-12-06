// 發送 GET 請求
let res = await fetch("./database/products.json");

// 將回傳資料轉為 JSON 格式
let products = await res.json();

// 主要 DOM
const app = document.querySelector("#product-recommend-app");

// 分頁 DOM
const paginateApp = document.querySelector("#product-recommend-paginate-app");

// 排列方式 DOM
const sortByApp = document.querySelector("#sort-by-app");


// 總比數
let total = products.length;

// 一頁幾筆
let once = 4;

// 目前第幾頁
let page = 1;

// 總頁數，無條件進位避免有餘數
let pages = Math.ceil(total / once);

let paginate = {
    once,
    page,
    pages,
    total
}


const sortProducts = () => {
    let sort = sortByApp.value || 'color';
    switch (sort) {
        case 'color':
            products.sort((a, b) => a.color.localeCompare(b.color));
            break;
        case 'name_asc':
            products.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name_desc':
            products.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price_asc':
            products.sort((a, b) => a.price - b.price);
            break;
        case 'price_desc':
            products.sort((a, b) => b.price - a.price);
            break;
        case 'date_desc':
            products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        case 'date_asc':
            products.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            break;
    }

}

// 當前頁面資料
const currentProducts = (products, paginate) => {
    let start = (paginate.page - 1) * paginate.once;
    let end = start + paginate.once;
    return products.slice(start, end);
}

const render = () => {
    sortProducts();
    let data = currentProducts(products, paginate);
    let html = '';
    data.forEach((item) => {
        let soldOut = item.stock <= 0 ? 'sold-out' : '';
        html += `
         <div class="product-item ${soldOut}">
            <div class="product-image">
                <a href="/product-detail.html?id=${item.id}">
                    <img src="${item.image}" alt="">
                </a>
                <a href="#2" class="add-cart"><i class="fa-solid fa-cart-shopping"></i> 加入購物車</a>
                <span class="sold-out-text">售完</span>
            </div>
            <div class="product-content">
                <a href="#3">
                    <p>${item.name} | ${item.color} | ${item.created_at}</p>
                    <p>NT$ ${item.price}</p>
                </a>
            </div>
        </div>
        `
    })
    app.innerHTML = html;
    initPaginate();
}

const initPaginate = () => {
    let html = '<a href="#" class="prev"><i class="fa-solid fa-angle-left"></i></a>';
    for (let i = 1; i <= paginate.pages; i++) {
        html += `<a href="#" class="${paginate.page === i ? 'active' : ''}">${i}</a>`;
    }
    html += '<a href="#" class="next"><i class="fa-solid fa-angle-right"></i></a>';
    paginateApp.innerHTML = html;
}




paginateApp.addEventListener("click", (e) => {
    e.preventDefault();
    let target = e.target;
    // 如果點到 i 標籤，則將 target 改為父元素
    if (target.tagName == 'I') {
        target = target.parentElement;
    }

    // 如果點到 prev，則將 page - 1。需判斷 page 是否大於 1
    if (target.classList.contains("prev") && paginate.page > 1) {
        paginate.page--;
        render();
        return;
    };

    // 如果點到 next，則將 page + 1。需判斷 page 是否小於 pages
    if (target.classList.contains("next") && paginate.page < paginate.pages) {
        paginate.page++;
        render();
        return;
    };

    // 如果點到數字，則將 page 改為該數字
    if (target.tagName == 'A' && !target.classList.contains("prev") && !target.classList.contains("next")) {
        paginate.page = parseInt(target.textContent);
        render();
        return;
    };
});

sortByApp.addEventListener("change", () => {
    render();
});


render();