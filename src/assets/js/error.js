(function () {
    "use strict";
    
    window.onload = function () {
        Particles.init({
            selector: '.error-basic-background',
            color: '#398f77',
            number: {
                value: 100,
                density: {
                    enable: true,
                    value_area: 100
                }
            },
        });
    };

})();