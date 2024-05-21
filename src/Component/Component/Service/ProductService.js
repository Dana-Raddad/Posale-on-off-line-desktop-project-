import axios from 'axios';

export default class ProductService {

    async  getProducts() {
        return await  axios('https://posales.rashid.cc/Json/product_all')
                .then(res => res.data);
    }
}
//data/product.json
//https://posales.rashid.cc/Json/product_all
//https://cors-anywhere.herokuapp.com/https://posale.rashid.cc/categories/json