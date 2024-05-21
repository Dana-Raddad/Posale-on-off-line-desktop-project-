import axios from 'axios';

export default class SessionService {

    async  getSession() {
        return await  axios('https://posales.rashid.cc/Json/session')
                .then(res => res.data)
                .catch(res => res.data);
    }

}