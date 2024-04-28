import http from "./libs/http"

export const querySkuPhysicalGoods = (spuId, skuId) => http.get(`/api/admin/v1/sku-physical-goods?currentPage=1&pageSize=100`, { skuId, spuId })

export const querySkuVirtualGoods = (spuId, skuId) => http.get(`/api/admin/v1/sku-virtual-goods?currentPage=1&pageSize=100`, { skuId, spuId })


export default {
    querySkuPhysicalGoods,
    querySkuVirtualGoods
}