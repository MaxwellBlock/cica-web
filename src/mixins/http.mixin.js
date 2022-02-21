const axios = require('/usr/local/lib/node_modules/axios').default;



const server = axios.create({
    baseURL: '',   //修改成需要访问的域名前缀
    timeout: 10 * 1000 // 超时时间
})


const apiMethods = {
    apiGet(url, data) {
        if (data == undefined) {
            data = {};
        }
        return new Promise((resolve, reject) => {
            server.get(url, { params: data }).then(
                response => {
                    resolve(response.data);
                },
                response => {
                    reject(response);
                },
            );
        });
    },
};

export default {
    methods: apiMethods,
};
