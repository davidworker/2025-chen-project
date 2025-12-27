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
     * @param {*} data 
     * @returns 
     */
    async doPost(sheetName, data) {

    }

    /**
     * 發送 GET 請求
     * @param {*} sheetName 
     * @returns 
     */
    async doGet(sheetName) {
        let response = await fetch(this.api, { sheetName: sheetName });
        let data = await response.json();
        return data;
    }
}

export { Apps }