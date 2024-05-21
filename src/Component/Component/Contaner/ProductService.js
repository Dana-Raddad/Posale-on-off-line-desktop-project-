import axios from 'axios';

export default class ProductService {

    async  getProducts() {
        return await  axios('data/product.json')
                .then(res => res.data);
    }
}