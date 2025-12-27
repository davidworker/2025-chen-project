const cacheKey = 'product_cache';

class ProductCache {
    static write(data) {
        localStorage.setItem(cacheKey, JSON.stringify(data));
    }

    static read() {
        let data = localStorage.getItem(cacheKey);
        return data ? JSON.parse(data) : {};
    }
}


export { ProductCache };