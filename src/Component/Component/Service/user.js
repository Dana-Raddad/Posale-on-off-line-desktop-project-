import axios from 'axios';

export default class UserService {

    async  getUser() {
        return await  axios('https://posales.rashid.cc/Json/users')
                .then(res => res.data);
    }

}
//data/user.json
//https://posales.rashid.cc/Json/users