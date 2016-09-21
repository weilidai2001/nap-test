var request = require('request');



var routes = {
    init: function(app) {

        // set up landing page
        app.get('/', function (req, res, next) {

            request({url: 'http://127.0.0.1:3000/api/products', qs: req.query || {}}, function(error, response, body) {
                const parsed = JSON.parse(body);
                const products = parsed.data;
                const designers = parsed.designers;

                res.render('index', {
                    metadata: {
                        title: 'Products'
                    },
                    title: 'Products',
                    layout: 'layouts/default',
                    template: 'index',
                    designers: designers,
                    products: products
                });
            });
        });

    }
};



module.exports = {
    routes: routes
};
