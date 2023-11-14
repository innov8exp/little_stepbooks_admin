export const formatMoney = (amount, locales = 'zh-CN', currency = 'CNY') => {
  return new Intl.NumberFormat(locales, {
    style: 'currency',
    currency: currency,
  }).format(amount)
}
