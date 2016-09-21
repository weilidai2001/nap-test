var request = require('request');

var uniqEs6 = (arrArg) => {
    return arrArg.filter((elem, pos, arr) => {
        return arr.indexOf(elem) == pos;
    });
};

var routes = {
    init: function(app) {

        // set up landing page
        app.get('/', function (req, res, next) {

            request('http://127.0.0.1:3000/api/products', function(error, response, body) {
                const products = JSON.parse(body).data;

                res.render('index', {
                    metadata: {
                        title: 'Products'
                    },
                    title: 'Products',
                    layout: 'layouts/default',
                    template: 'index',
                    designers: uniqEs6(products.map(item => item.designer)),
                    products: products
                });
            });
        });

    }
};



module.exports = {
    routes: routes
};
