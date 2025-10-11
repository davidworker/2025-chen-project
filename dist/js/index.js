const swiper = {
    async init() {
        let dom = {
            main: document.querySelector('#swiper'),
            itemsWrap: document.querySelector('.items'),
            navigate: document.querySelector('.navigate'),
            prevBtn: document.querySelector('.prev-btn'),
            nextBtn: document.querySelector('.next-btn'),
        }
        this.dom = dom;
        this.swiperIndex = 0;
        this.autoplayDuration = 8;
        this.setItemLock = false;
        this.autoplayTimer = null;
        this.swiperData = await this.getData();
        this.swiperCount = this.swiperData.length;
        this.makeNavigateUI();
        this.makeItemsUI();
        this.autoplay();
        this.initPrevNextEvent();
        this.initNavigateEvent();
    },

    /**
     * 初始化上一頁下一頁事件
     */
    initPrevNextEvent() {
        this.dom.prevBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            // e.stopPropagation();
            if (this.setItemLock) {
                return;
            }
            this.setItemLock = true;
            try {
                this.swiperIndex = this.swiperIndex - 1;
                if (this.swiperIndex < 0) {
                    this.swiperIndex = this.swiperCount - 1;
                }
                this.cancelAutoplay();
                await this.setItem(this.swiperIndex);
                this.autoplay();
            } catch (error) {
                console.error(error);
            } finally {
                this.setItemLock = false;
            }
        })

        this.dom.nextBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (this.setItemLock) {
                return;
            }
            this.setItemLock = true;
            try {
                this.swiperIndex = this.swiperIndex + 1;
                if (this.swiperIndex >= this.swiperCount) {
                    this.swiperIndex = 0;
                }
                this.cancelAutoplay();
                await this.setItem(this.swiperIndex);
                this.autoplay();
            } catch (error) {
                console.error(error);
            } finally {
                this.setItemLock = false;
            }
        })
    },

    /**
     * 初始化導航事件
     */
    initNavigateEvent() {
        this.dom.navigate.addEventListener('click', async (e) => {
            e.preventDefault();

            if (e.target.tagName !== 'A') {
                return;
            }

            if (this.setItemLock) {
                return;
            }
            this.setItemLock = true;
            try {
                let index = e.target.dataset.index;
                this.swiperIndex = index;
                this.cancelAutoplay();
                await this.setItem(this.swiperIndex);
                this.autoplay();
            } catch (error) {
                console.error(error);
            } finally {
                this.setItemLock = false;
            }
        })
    },

    setNavigateActive(index) {
        let items = this.dom.navigate.querySelectorAll('a');
        items.forEach((item, itemIndex) => {
            item.classList.remove('active');
            if (itemIndex === index) {
                item.classList.add('active');
            }
        })
    },

    /**
     * 設置輪播項目
     * @param {*} swiper 
     * @param {*} index 
     */
    setItem(index) {
        return new Promise((resolve, reject) => {
            index = +index;
            this.dom.itemsWrap.classList.add('fade-out');

            let items = this.dom.itemsWrap.querySelectorAll('li');
            setTimeout(() => {
                items.forEach((item, itemIndex) => {
                    item.classList.remove('active');
                    if (itemIndex === index) {
                        item.classList.add('active');
                    }
                })
            }, 400);

            setTimeout(() => {
                this.dom.itemsWrap.classList.remove('fade-out');
                this.setNavigateActive(index);
            }, 500);

            setTimeout(() => {
                resolve();
            }, 2000);
        })
    },

    /**
     * 自動輪播
     */
    autoplay() {
        clearInterval(this.autoplayTimer);
        this.autoplayTimer = setInterval(() => {
            this.swiperIndex++;
            if (this.swiperIndex >= this.swiperCount) {
                this.swiperIndex = 0;
            }
            this.setItem(this.swiperIndex);
        }, this.autoplayDuration * 1000);
    },

    /**
     * 取消自動輪播
     */
    cancelAutoplay() {
        clearInterval(this.autoplayTimer);
    },

    /**
     * 取得輪播資料
     * @returns {Promise<Array>} 輪播資料
     */
    async getData() {
        let response = await fetch('./database/swiper.json');
        let data = await response.json();
        return data;
    },

    /**
     * 製作導航 UI
     */
    makeNavigateUI() {
        let navigateHTML = '';
        for (let i = 0; i < this.swiperCount; i++) {
            navigateHTML += `<a href="#" class="${i === 0 ? 'active' : ''}" data-index="${i}"></a>`;
        }
        this.dom.navigate.innerHTML = navigateHTML;
    },

    makeItemsUI() {
        let itemsHTML = '';

        for (let i = 0; i < this.swiperCount; i++) {
            let isActive = '';
            if (i === 0) {
                isActive = 'active';
            }
            itemsHTML += `<li class="${isActive}" style="background-image: url(${this.swiperData[i].image});">
                <div class="content">
                    <h2>${this.swiperData[i].title}</h2>
                    <a href="${this.swiperData[i].link}" class="link-btn">
                        ${this.swiperData[i].buttonText}
                    </a>
                </div>
            </li>`;
        }
        this.dom.itemsWrap.innerHTML = itemsHTML;
    }
}

swiper.init();