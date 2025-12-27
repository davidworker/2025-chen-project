class Apps {

    /**
     * 建構子
     * @param {*} api 
     */
    constructor(api) {
        this.api = api;
    }

    /**
     * 發送 POST 請求
     * @param {*} sheetName 
     * @param {*} params = {} 
     * @returns 
     */
    async doPost(sheetName, params) {
        let form = new FormData();
        for (let key in params) {
            form.append(key, params[key]);
        }
        form.append('sn', sheetName);
        let response = await fetch(this.api, {
            method: 'POST',
            body: form,
        });
        let data = await response.json();
        return data;
    }

    /**
     * 發送 GET 請求
     * @param {*} sheetName 
     * @param {*} params = {} 
     * @returns 
     */
    async doGet(sheetName, params = {}) {
        params.sn = sheetName;
        let api = `${this.api}?${new URLSearchParams(params).toString()}`;
        let response = await fetch(api);
        let data = await response.json();
        return data;
    }
}

export { Apps }