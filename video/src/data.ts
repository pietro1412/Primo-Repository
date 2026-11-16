// DATI DI ESEMPIO (non reali) - in produzione si sostituiscono con una chiamata API (es. CoinGecko)
export const recap = {
  title: 'Crypto Weekly Recap',
  subtitle: 'Settimana dati demo',
  btc: [64200, 65100, 64700, 66800, 67900, 67200, 69500, 70800, 70100, 72400],
  dominance: [
    {name: 'Bitcoin', value: 54, color: '#f7931a'},
    {name: 'Ethereum', value: 17, color: '#818cf8'},
    {name: 'Solana', value: 4, color: '#2dd4bf'},
    {name: 'Altre', value: 25, color: '#64748b'},
  ],
  movers: [
    {symbol: 'SOL', name: 'Solana', change: 14.2},
    {symbol: 'ETH', name: 'Ethereum', change: 6.8},
    {symbol: 'XRP', name: 'Ripple', change: -4.1},
  ],
  fearGreed: 65,
};

export const concepts: Record<string, {label: string; title: string; text: string}> = {
  intro: {label: 'IN QUESTO VIDEO', title: 'Prezzo · Dominance · Variazioni · Sentiment', text: 'Quattro concetti chiave per leggere il mercato.'},
  bitcoin: {label: 'CONCETTO', title: 'Trend rialzista', text: 'Minimi e massimi crescenti nel tempo: i prezzi tendono a salire.'},
  dominance: {label: 'CONCETTO', title: 'Dominance', text: 'Quota percentuale di una moneta sulla capitalizzazione totale del mercato.'},
  movers: {label: 'CONCETTO', title: 'Variazione %', text: 'Quanto è cambiato il prezzo tra l\'inizio e la fine del periodo.'},
  fear: {label: 'CONCETTO', title: 'Fear & Greed Index', text: 'Indice da 0 a 100 sul sentimento di mercato: 0 paura estrema, 100 avidità estrema.'},
  outro: {label: 'AUTOMAZIONE', title: 'Un template, dati sempre aggiornati', text: 'Lo stesso video si rigenera ogni giorno, senza montaggio manuale.'},
};
