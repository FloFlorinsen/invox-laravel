export const formatMoney = (amount: number) => {
  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  })

  return formatter.format(amount)
}
