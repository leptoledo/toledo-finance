'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'

// Top tickers list for autocomplete (B3 + Crypto + US Tech)
const TICKERS = [
    // B3 (Brazil)
    'PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'BBAS3', 'WEGE3', 'ABEV3', 'RENT3', 'BPAC11', 'SUZB3',
    'PRIO3', 'RDOR3', 'RADL3', 'HAPV3', 'RAIL3', 'GGBR4', 'VBBR3', 'EQTL3', 'CSAN3', 'UGPA3',
    'LREN3', 'B3SA3', 'ELET3', 'VIVT3', 'BBSE3', 'SBSP3', 'HYPE3', 'CMIG4', 'CCRO3', 'TIMS3',
    'CPLE6', 'EGIE3', 'CSNA3', 'EMBR3', 'TAEE11', 'KLBN11', 'BRFS3', 'MULT3', 'ENEV3', 'CPFE3',
    'ASAI3', 'CRFB3', 'ALPA4', 'AZUL4', 'CVCB3', 'GOLL4', 'MGLU3', 'VIIA3', 'PETZ3', 'SOMA3',
    'ARZZ3', 'JBSS3', 'MRFG3', 'BEEF3', 'PCAR3', 'NTCO3', 'CIEL3', 'FLRY3', 'QUAL3', 'TOTS3',
    'LWSA3', 'CASH3', 'POSI3', 'INTB3', 'MATD3', 'RECV3', 'RRRP3', 'SLCE3', 'SMTO3', 'DXCO3',
    'EZTC3', 'CYRE3', 'MRVE3', 'JHSF3', 'HBOR3', 'TEND3', 'EVEN3', 'DIRR3', 'CURY3', 'TRIS3',
    // FIIs (Real Estate)
    'HGLG11', 'MXRF11', 'KNIP11', 'KNCR11', 'HGRU11', 'VISC11', 'XPLG11', 'BTLG11', 'IRDM11', 'CPTS11',
    'BCFF11', 'BRCR11', 'HGCR11', 'HGBS11', 'VILG11', 'VINC11', 'XPML11', 'MALL11', 'TGAR11', 'HFOF11',
    // Crypto
    'BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'XRP', 'DOGE', 'SHIB', 'AVAX', 'MATIC', 'USDT', 'USDC', 'BNB',
    // US Tech
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'NFLX', 'AMD', 'INTC'
].sort()

interface TickerAutocompleteProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onSelectTicker?: (ticker: string) => void
}

export function TickerAutocomplete({ className, onSelectTicker, ...props }: TickerAutocompleteProps) {
    const [open, setOpen] = React.useState(false) // Controls visibility of the dropdown
    const [inputValue, setInputValue] = React.useState(props.defaultValue?.toString() || props.value?.toString() || '')
    const [filteredTickers, setFilteredTickers] = React.useState<string[]>([])
    const inputRef = React.useRef<HTMLInputElement>(null)
    const dropdownRef = React.useRef<HTMLUListElement>(null)

    // Handle typing
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase()
        setInputValue(value)

        if (value.length > 0) {
            const matches = TICKERS.filter((ticker) =>
                ticker.includes(value)
            ).slice(0, 5) // Limit to 5 results
            setFilteredTickers(matches)
            setOpen(true)
        } else {
            setOpen(false)
        }

        if (props.onChange) {
            props.onChange(e)
        }
    }

    // Handle selection
    const handleSelect = (ticker: string) => {
        setInputValue(ticker)
        setOpen(false)
        if (onSelectTicker) onSelectTicker(ticker)

        // Update the native input value so form submission works
        if (inputRef.current) {
            inputRef.current.value = ticker
            // Trigger a change event so React form state updates if needed
            // This is a bit hacky but ensures native form constraints work
            const event = new Event('input', { bubbles: true });
            inputRef.current.dispatchEvent(event);
        }
    }

    // Close on click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                inputRef.current &&
                !inputRef.current.contains(event.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className="relative">
            <Input
                ref={inputRef}
                type="text"
                autoComplete="off"
                {...props}
                value={inputValue}
                onChange={handleInputChange}
                className={cn('uppercase', className)}
            />

            {open && filteredTickers.length > 0 && (
                <ul
                    ref={dropdownRef}
                    className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-white/10 bg-gray-900 p-1 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                    {filteredTickers.map((ticker) => (
                        <li
                            key={ticker}
                            className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-300 hover:bg-white/10 hover:text-white rounded-sm"
                            onClick={() => handleSelect(ticker)}
                        >
                            <span className="block truncate font-medium">{ticker}</span>
                            {inputValue === ticker && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-purple-500">
                                    <Check className="h-4 w-4" aria-hidden="true" />
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
