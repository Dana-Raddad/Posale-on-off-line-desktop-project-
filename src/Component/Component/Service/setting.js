import axios from 'axios';

export default class SettingService {

    async  getSetting() {
        return await  axios('https://posales.rashid.cc/Json/setting')
                .then(res => res.data);
    }

}
//data/setting.json
//https://posales.rashid.cc/Json/setting