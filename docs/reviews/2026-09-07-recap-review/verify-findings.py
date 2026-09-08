import json
from pathlib import Path

root = Path(__file__).resolve().parent
r = json.loads((root / 'recap-probe-results.json').read_text())
assert len(r) == 8 and all(x['controlFinalExact'] for x in r)
normal = next(x for x in r if x['seed'] == 42 and not x['trial'])
assert normal['fatal']['actualPriorHealth'] == 9
assert 'from 5 to 0' in normal['lines'][0]
trial = next(x for x in r if x['seed'] == 7 and x['trial'])
assert trial['original']['phase'] == 'over' and trial['uiReplay']['phase'] == 'main'
assert trial['lines'] == [] and trial['illegalReplayActions'] == 12
assert all(not x['recordContainsList'] for x in r)
bone = json.loads((root / 'bone-moon-probe-results.json').read_text())
assert 'their turn cost you 12 Health' in bone['lines'][1]
bites = [e for e in bone['events'] if e['round'] == 15 and e['event']['kind'] == 'boneMoonBite' and e['event']['player'] == 0]
assert len(bites) == 1 and bites[0]['event']['n'] == 6
damage = [e for e in bone['events'] if e['round'] == 15 and e['event']['kind'] == 'damage' and e['event']['target']['player'] == 0]
assert len(damage) == 1 and damage[0]['actualHealth'][0] == 4
assert bites[0]['actualHealth'][0] == 10
print('Verified: eight exact controls; normal replay diverges; trial recap disappears; one 6-point own-turn bite is reported as 12 enemy-turn damage; completed records omit the dealt list.')
