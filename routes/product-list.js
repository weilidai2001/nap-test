var config = require('../config/config');
var _ = require('lodash');

// Mock API using fixture so we're not dependent on network connectivity
var allProducts = require(config.ROOT +'/fixtures/products.json').data;

const sortByPriceAsc = list => _.sortBy(list, item => item.price.net);
const sortByPriceDesc = list => _.sortBy(list, item => -item.price.net);
const sortByDesigner = list => _.sortBy(list, item => item.brand.name.en);

const filterBy = (method, list) => {
    if(method == "price_asc") {
        return sortByPriceAsc(list)
    } else if (method == "price_desc"){
        return sortByPriceDesc(list)
    } else if (method == "designer") {
        return sortByDesigner(list)
    }
    return list;
};

const filterByDesigners = (designers, list) => {
    return list.filter(item => designers.indexOf(item.brand.name.en) != -1);
};

var routes = {
    init: function(app) {

        app.get('/api/products', function (req, res, next) {
            var total = allProducts.length;
            var offset = parseInt(req.query.offset) || 0;
            var limit = parseInt(req.query.limit) || 60;
            if (offset > total) {
                return res.type('json').sendStatus(400);
            }
            var sortMethod = req.query.sortBy;
            var designers = req.query.designer || [];

            const sorted = filterBy(sortMethod, allProducts);
            const filtered = designers.length ? filterByDesigners(designers, sorted) : sorted;

            res.json({
                offset: offset,
                limit: limit,
                total: total,
                designers: _.uniq(allProducts.map(item => item.brand.name.en)),
                data: filtered.slice(offset, offset+limit).map(function(product) {
                    // Simplify payload - more data available in fixture
                    return {
                        id: product.id,
                        name: product.name.en,
                        price: '£' + product.price.gross / product.price.divisor,
                        designer: product.brand.name.en,
                        image: {
                            outfit: '//cache.net-a-porter.com/images/products/'+product.id+'/'+product.id+'_ou_sl.jpg'
                        }
                    }
                })
            })

        })

    }
};



module.exports = {
    routes: routes
};
