import { Apps } from "./Apps.js";

const API = 'https://script.google.com/macros/s/AKfycbxrummcIixvqfu9k8XSnaMpvoj223Yq74Xu_lZ5YsTUdteTu-5PLSCAgBdj8Ogt0yvCyw/exec'
let apps = new Apps(API)

const load = async (page, sort = 'name', order = 'asc') => {
    let once = 4;
    let res = await apps.doGet('product', { page: page, limit: once, sort: sort, order: order });
    return res;
}

let paginate = {
    once: 4,
    page: 1,
    pages: 1,
    total: 0,
}

// 主要 DOM
const app = document.querySelector("#product-recommend-app");

// 分頁 DOM
const paginateApp = document.querySelector("#product-recommend-paginate-app");

// 排列方式 DOM
const sortByApp = document.querySelector("#sort-by-app");

const sortType = () => {
    let sort = sortByApp.value || 'color';
    switch (sort) {
        case 'color':
            return { sort: 'color', order: 'asc' };
        case 'name_asc':
            return { sort: 'name', order: 'asc' };
        case 'name_desc':
            return { sort: 'name', order: 'desc' };
        case 'price_asc':
            return { sort: 'price', order: 'asc' };
        case 'price_desc':
            return { sort: 'price', order: 'desc' };
        case 'date_desc':
            return { sort: 'created_at', order: 'desc' };
        case 'date_asc':
            return { sort: 'created_at', order: 'asc' };
    }
}

const render = async () => {
    let sort = sortType();
    let res = await load(paginate.page, sort.sort, sort.order);
    let products = res.data;
    paginate = {
        once: res.limit,
        page: res.page,
        pages: res.totalPages,
        total: res.total,
    }

    let html = '';
    products.forEach((item) => {
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
