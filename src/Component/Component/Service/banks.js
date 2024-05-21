import axios from 'axios';

export default class BanksService {

    async  getBanks() {
        return await  axios('https://posale.rashid.cc/Json/banks')
                .then(res =>res.data)
                
    }

}
//https://posale.rashid.cc/Json/banks