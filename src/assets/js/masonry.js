(function () {
    'use strict'
    var grid = document.querySelector('.grid');
    var msnry = new Masonry(grid, {
        // options...
        itemSelector: '.grid-item',
        columnWidth: 0
    });
})();