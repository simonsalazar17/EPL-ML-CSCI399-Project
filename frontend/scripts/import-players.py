"""Import the notebook's public dataset archive: python3 scripts/import-players.py /path/to/archive.zip."""
import csv
import io
import json
from pathlib import Path
import sys
import zipfile

SOURCE_URL = "https://www.kaggle.com/datasets/kanchana1990/football-transfer-value-intelligence-2024"
with zipfile.ZipFile(sys.argv[1]) as archive:
    filename = next(name for name in archive.namelist() if name.endswith('/transfermarkt_player_values.csv'))
    rows = csv.DictReader(io.StringIO(archive.read(filename).decode('utf-8-sig')))
    players = []
    dates = set()
    for row in rows:
        if row['league_name'] != 'Premier League':
            continue
        dates.add(row['dataset_built_at'])
        players.append({
            'id': row['player_id'], 'name': row['name'],
            'nationality': row['nationality'],
            'marketValueEur': float(row['current_value_eur']),
            'valuationDate': row['last_date'],
        })
if len(dates) != 1 or len({p['id'] for p in players}) != len(players):
    raise ValueError('Expected a single snapshot and unique player IDs')
players.sort(key=lambda player: (-player['marketValueEur'], player['name']))
output = Path(__file__).resolve().parents[1] / 'src/data/players.json'
output.write_text(json.dumps({'sourceUrl': SOURCE_URL, 'builtAt': dates.pop(), 'players': players}, indent=2, ensure_ascii=False) + '\n')
print(f'Imported {len(players)} players into {output}')
