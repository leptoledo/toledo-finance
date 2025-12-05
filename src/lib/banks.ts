
export interface Bank {
    id: string
    name: string
    logo?: string // URL or placeholder
    color: string // For avatar background if no logo
}

export const POPULAR_BANKS: Bank[] = [
    { id: 'barclays', name: 'Barclays Personal Banking', color: '#00AEEF' },
    { id: 'halifax', name: 'Halifax', color: '#005EB8' },
    { id: 'hsbc', name: 'HSBC Personal', color: '#DB0011' },
    { id: 'lloyds', name: 'Lloyds Personal', color: '#006A4D' },
    { id: 'santander', name: 'Santander', color: '#EC0000' },
    { id: 'vanquis', name: 'Vanquis', color: '#5C2D91' },
    { id: 'natwest', name: 'NatWest', color: '#42145F' },
]

export const ALL_BANKS: Bank[] = [
    ...POPULAR_BANKS,
    { id: 'aib', name: 'Allied Irish Bank', color: '#7E2180' },
    { id: 'amazon', name: 'Amazon Credit Card', color: '#FF9900' },
    { id: 'amex', name: 'American Express', color: '#006FCF' },
    { id: 'aqua', name: 'Aqua Credit Card', color: '#00AEEF' },
    { id: 'bank-of-scotland', name: 'Bank of Scotland', color: '#002D64' },
    { id: 'capital-one', name: 'Capital One', color: '#004879' },
    { id: 'chase', name: 'Chase', color: '#117ACA' },
    { id: 'citi', name: 'Citi', color: '#003B70' },
    { id: 'co-operative', name: 'Co-operative Bank', color: '#0099CC' },
    { id: 'danske', name: 'Danske Bank', color: '#003366' },
    { id: 'first-direct', name: 'first direct', color: '#000000' },
    { id: 'mbna', name: 'MBNA', color: '#006633' },
    { id: 'metro', name: 'Metro Bank', color: '#D6001C' },
    { id: 'monzo', name: 'Monzo', color: '#FF4D4D' },
    { id: 'nationwide', name: 'Nationwide', color: '#003399' },
    { id: 'revolut', name: 'Revolut', color: '#0075EB' },
    { id: 'rbs', name: 'Royal Bank of Scotland', color: '#002D64' },
    { id: 'sainsburys', name: 'Sainsbury\'s Bank', color: '#F07D00' },
    { id: 'starling', name: 'Starling Bank', color: '#69359C' },
    { id: 'tesco', name: 'Tesco Bank', color: '#EE1C2E' },
    { id: 'tsb', name: 'TSB', color: '#001D4A' },
    { id: 'virgin', name: 'Virgin Money', color: '#D6001C' },
].sort((a, b) => a.name.localeCompare(b.name))

export function getBankById(id: string): Bank | undefined {
    return ALL_BANKS.find((bank) => bank.id === id)
}
