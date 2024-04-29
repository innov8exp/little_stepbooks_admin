import http from "./libs/http"

export const querySkuPhysicalGoods = (spuId, skuId) => http.get('sku-physical-goods', {
    currentPage: 1,
    pageSize: 100,
    skuId,
    spuId
})

export const querySkuVirtualGoods = (spuId, skuId) => http.get('sku-virtual-goods', {
    currentPage: 1,
    pageSize: 100,
    skuId,
    spuId
})

export const addSkuPhysicalGoods = (params) => http.post(`sku-physical-goods`, params)
export const addSkuVirtualGoods = (params) => http.post(`sku-virtual-goods`, params)
export const deleteSkuPhysicalGoods = (id) => http.delete(`sku-physical-goods/${id}`)
export const deleteSkuVirtualGoods = (id) => http.delete(`sku-virtual-goods/${id}`)

export default {
    querySkuPhysicalGoods,
    querySkuVirtualGoods
}