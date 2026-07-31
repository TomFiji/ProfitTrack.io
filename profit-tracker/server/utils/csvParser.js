function parsePrice(value) {
    if (!value) return 0
    const cleaned = value.replace(/[$,=""\-]/g, '').trim()
    const num = parseFloat(cleaned)
    return isNaN(num) ? 0 : num
}

function parseDate(value) {
    const [month, day, year] = value.split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

const isEmptyBundleItem = (row) => {
    const total = row['Total']
    return !total || total.includes('-') || total === '=""- ""'
}

export function parsePoshmarkCsv(rows) {
    const seen = {}
    return rows.map(row => {
        const key = `${row['Order Id']}|${row['Listing Title']}`
        const index = seen[key] ?? 0
        seen[key] = index + 1
        return {
            order_id:      row['Order Id'],
            order_date:    parseDate(row['Order Date']),
            listing_title: row['Listing Title'],
            order_price:   parsePrice(row['Order Price']),
            net_earnings:  parsePrice(row['Your Earnings']),
            item_index:    index,
        }
    })
}

export function parseDepopCsv(rows) {
    const seen = {}
    return rows
        .filter(row => row['Date of sale'] && !isEmptyBundleItem(row))
        .map(row => {
            const listingTitle = row['Description']?.split('\n')[0] || ''
            const buyer = row['Buyer'] || ''
            const dateOfSale = row['Date of sale'] || ''
            const key = `${dateOfSale}|${listingTitle}|${buyer}`
            const index = seen[key] ?? 0
            seen[key] = index + 1

            const total = parsePrice(row['Total'])
            const shipping_fee = parsePrice(row['Buyer shipping cost'])
            const depop_fee = parsePrice(row['Depop Payment'])
            const sales_tax = parsePrice(row['US Sales tax'])
            const boosting_fee = parsePrice(row['Boosting fee'])
            const total_fees = shipping_fee + depop_fee + sales_tax+ boosting_fee



            return {
                order_id:      key,
                order_date:    parseDate(dateOfSale),
                listing_title: listingTitle,
                order_price:   parsePrice(row['Item price']),
                net_earnings:  total - total_fees,
                item_index:    index,
            }
        })
}
