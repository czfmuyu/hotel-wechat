import Promise from '../utils/es6-promise.min';
const httpsPromisify = fn => {
    return (obj = {}) => {
        return new Promise((resolve, reject) => {
            obj.success = res => {
                resolve(res)
            }
            obj.fail =  res => {
                reject(res)
            }
            fn(obj)
        })
    }
};

export default {  
    httpsPromisify
}　　