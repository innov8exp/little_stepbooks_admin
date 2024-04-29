import axios from 'axios'
import HttpStatus from 'http-status-codes'

function http (method, url, data) {
    url = `/api/admin/v1/${url}`
    // 对于 undefined | null | '' 当作无效传参抛弃
    for (const key in data) {
        const value = data[key];
        if (value === undefined || value === null || value === '') {
            delete data[key]
        }
    }
    method = method.toLowerCase();
    if (method === 'get' || method === 'delete') {
        return requestEnd(axios[method](url, { params: data }))
    } else if (method === 'post' || method === 'put') {
        return requestEnd(axios[method](url, data))
    }
}

function requestEnd (httpPromise) {
    return new Promise(function (resolve, reject) {
        httpPromise.then(res => {
            if (res && res.status === HttpStatus.OK) {
                resolve(res.data)
            } else {
                reject(res.statusText || 'Network abnormality.');
            }
        }, err => {
            reject(err.statusText || 'Network abnormality.');
        })
    })
}


http.get = function (url, data) {
    return http('get', url, data)
}
http.post = function (url, data) {
    return http('post', url, data)
}
http.put = function (url, data) {
    return http('put', url, data)
}
http.delete = function (url, data) {
    return http('delete', url, data)
}

export default http;