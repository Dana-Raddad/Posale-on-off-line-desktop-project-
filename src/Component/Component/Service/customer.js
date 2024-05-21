import axios from 'axios';

export default class CustomerService  {

  
    async  getProducts() {
        return await  axios.get('https://posales.rashid.cc/Json/customer_all')
                .then(res => res.data);
    }
 
   
}
//data/customer.json
//https://posales.rashid.cc/Json/customer_all