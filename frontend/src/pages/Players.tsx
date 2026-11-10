import { useState } from 'react';
import PageHeading from '../components/PageHeading';
import Metric from '../components/Metric';
import snapshot from '../data/players.json';

const nationalities = [...new Set(snapshot.players.map(player => player.nationality))].sort();
const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const formatDate = (date: string) => dateFormatter.format(new Date(`${date}T00:00:00Z`));
const formatValue = (value: number) => value >= 1_000_000 ? `€${(value / 1_000_000).toLocaleString('en-GB', { maximumFractionDigits: 2 })}M` : new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function Players() {
  const [search, setSearch] = useState('');
  const [nationality, setNationality] = useState('');
  const [sort, setSort] = useState('value-desc');
  const players = snapshot.players.filter(player => normalize(player.name).includes(normalize(search.trim())) && (!nationality || player.nationality === nationality)).sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name);
    return sort === 'value-asc' ? a.marketValueEur - b.marketValueEur : b.marketValueEur - a.marketValueEur;
  });
  const totalValue = snapshot.players.reduce((sum, player) => sum + player.marketValueEur, 0);
  return <>
    <PageHeading title="Premier League Players" description="Browse recorded player market values from the same source dataset used in the training notebook." />
    <dl className="metrics-row three"><Metric label="Players in this snapshot" value={String(snapshot.players.length)} detail="Premier League records in the source" /><Metric label="Highest recorded value" value={formatValue(snapshot.players[0].marketValueEur)} detail={snapshot.players[0].name} /><Metric label="Combined recorded value" value={formatValue(totalValue)} detail="Total across this dataset snapshot" /></dl>
    <div className="info-strip player-source"><div><p><strong>Historical dataset · built {formatDate(snapshot.builtAt)}.</strong> These are recorded market values, separate from model predictions. This dataset is a subset of Premier League players and does not represent a complete current roster. Each row shows its last recorded valuation date.</p><a className="text-link" href={snapshot.sourceUrl} target="_blank" rel="noreferrer">Source: Transfermarkt-derived dataset on Kaggle </a></div></div>
    <section className="section">
      <div className="section-heading"><div><h2>Player market values</h2><p>Search a player, filter by nationality, or sort by value.</p></div></div>
      <div className="player-filters"><label className="field player-search">Search players<div className="search-input"><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="e.g. Haaland, Saka, Caicedo" /></div></label><label className="field">Nationality<select value={nationality} onChange={event => setNationality(event.target.value)}><option value="">All nationalities</option>{nationalities.map(country => <option key={country}>{country}</option>)}</select></label><label className="field">Sort by<select value={sort} onChange={event => setSort(event.target.value)}><option value="value-desc">Value: highest first</option><option value="value-asc">Value: lowest first</option><option value="name">Player: A–Z</option></select></label></div>
      <p className="player-count" role="status">Showing {players.length} of {snapshot.players.length} players</p>
      <div className="table-scroll"><table><caption className="sr-only">Recorded Premier League player market values from the February 2026 source snapshot</caption><thead><tr><th scope="col">Player</th><th scope="col">Nationality</th><th scope="col">Valuation date</th><th scope="col">Market value</th></tr></thead><tbody>{players.map(player => <tr key={player.id}><th scope="row"><a className="player-name" href={`https://www.transfermarkt.com/-/profil/spieler/${player.id}`} target="_blank" rel="noreferrer">{player.name}<span className="sr-only"> (opens Transfermarkt in a new tab)</span></a></th><td>{player.nationality || 'Not available'}</td><td>{player.valuationDate ? formatDate(player.valuationDate) : 'Not available'}</td><td className="market-value">{formatValue(player.marketValueEur)}</td></tr>)}</tbody></table></div>
      {players.length === 0 && <div className="players-empty"><h3>No players found</h3><p>Try another name or clear the filters.</p><button type="button" className="button" onClick={() => { setSearch(''); setNationality(''); }}>Clear filters</button></div>}
    </section>
    <p className="player-data-note">Club and position are omitted because those fields are malformed in the source dataset. The model was trained on 79 matched players; this tab shows all 103 Premier League records in the market-value source.</p>
  </>;
}
