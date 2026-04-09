function parsePrice(value) {
    return parseFloat(value.replace(/[$,]/g, '')) || 0
}

function parseDate(value) {
    const [month, day, year] = value.split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
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
