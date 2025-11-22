let mainImage = document.querySelector('#main-image');
let gallery = document.querySelector('.gallery');

gallery.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.tagName === 'IMG') {
        mainImage.src = e.target.src;
    }

    if (e.target.tagName === 'A') {
        mainImage.src = e.target.children[0].src;
    }
});