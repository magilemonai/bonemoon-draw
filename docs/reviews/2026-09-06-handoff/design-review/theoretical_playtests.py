"""Deterministic scenario arithmetic for the Bonemoon design handoff.

This is NOT the game engine or an autonomous match simulator. Constructed
states deliberately isolate rules interactions. See the handoff for choices,
counterplay, and rules assumptions. No generated win rates.
Run: python3 design-review/theoretical_playtests.py
"""
from pathlib import Path
import hashlib
import json
import re

PACKET = Path('/Users/cody/Desktop/Games/Valisar Tarot Battler/docs/DESIGN_REVIEW_PACKET.md')
OUT = Path(__file__).with_name('theoretical-results.json')


def moon_race(start_health, incoming, active_heal, passive_heal):
    """Own start: bite -> active heal -> end passive -> fixed enemy damage.

    Maximum Health is assumed to be 20. Stop immediately at zero Health.
    This excludes all cards, fatigue, enemy healing and strategic adaptation.
    """
    hp = start_health
    turns = []
    for round_number in range(10, 30):
        before = hp
        bite = round_number - 9
        hp -= bite
        row = dict(round=round_number, before=before, bite=bite, after_bite=hp)
        if hp <= 0:
            row['death'] = 'own start'
            turns.append(row)
            return dict(death_round=round_number, death_stage='own start', turns=turns)
        hp = min(20, hp + active_heal)
        hp = min(20, hp + passive_heal)
        row['after_healing'] = hp
        hp -= incoming
        row['after_enemy_damage'] = hp
        turns.append(row)
        if hp <= 0:
            row['death'] = 'enemy turn'
            return dict(death_round=round_number, death_stage='enemy turn', turns=turns)
    raise AssertionError('Expected Bone Moon to end the scenario')


def packet_audit(source):
    cards_text = source.split('## Every card', 1)[1].split('### Tokens', 1)[0]
    cards = {}
    for match in re.finditer(r'^\*\*(.+?)\*\* \([^\n]*?, (figure|omen|relic), cost (\d+)', cards_text, re.M):
        cards[match[1]] = (match[2], int(match[3]))
    decks_text = source.split('## Significators and decks', 1)[1].split('## Every card', 1)[0]
    decks = {}
    owners = {}
    for section in decks_text.split('\n### ')[1:]:
        hero = section.splitlines()[0]
        line = re.search(r'^- Deck list: (.+)$', section, re.M)[1]
        types = dict(figure=0, omen=0, relic=0)
        costs = {str(n): 0 for n in range(1, 10)}
        total = 0
        for entry in line.split('; '):
            count, name = re.fullmatch(r'(\d+)x (.+)', entry).groups()
            count = int(count)
            kind, cost = cards[name]
            types[kind] += count
            costs[str(cost)] += count
            total += count
            owners.setdefault(name, []).append(hero)
        assert total == 30, (hero, total)
        decks[hero] = dict(cards=total, types=types, costs=costs,
                           six_plus=sum(v for k, v in costs.items() if int(k) >= 6),
                           mean_cost=round(sum(int(k)*v for k,v in costs.items())/total, 2))
    return dict(card_definitions=len(cards), decks=decks,
                shipped_deck_owners={name: owners[name] for name in [
                    'The Star: Lirielle Starwhisper', 'The Hermit: Luigi Bonemoon',
                    'The Fool: Daxon Lamn', 'The Heartwood',
                    'Calvera Blackwake, the Mad Pirate Queen',
                    'The Hanged Man: Rorik Flamebeard', 'Bill Boggs, Cartel Runner',
                    'Tidecaller: Low Tide']})


def main():
    source = PACKET.read_text()
    result = dict(
        method='Constructed scenario arithmetic and snapshot deck parsing; not match simulation.',
        source=str(PACKET), sha256=hashlib.sha256(PACKET.read_bytes()).hexdigest(),
        packet_audit=packet_audit(source),
    )
    # T01: printed base stats swap; non-swapping modifiers are a stated assumption.
    result['T01_wound_flip'] = dict(heartwood_remaining_before=8-1,
        heartwood_remaining_after=1-1, oondray_R_remaining_before=2-1,
        oondray_U_remaining_after=3-1)
    assert result['T01_wound_flip']['heartwood_remaining_after'] == 0
    # T02: a figure's current face supplies its text. No scheduled death on play.
    result['T02_sentry'] = dict(shazz_arrival_face_damage=5+1,
        sentry_plus_hero_flip_cost=4+2, sentry_plus_sphere_cost=4+1,
        sphere_final_u_attack=2+1, sphere_final_u_health=5+1,
        masque_final_u_health=5+1)
    # T03: one resident Mordeaux, copy costs no Spark. Resource caps branched.
    result['T03_liquid_mana'] = {}
    for label, gain in [('current_U', 3), ('earlier_proposal_U', 5)]:
        uncapped = 5-4+2*gain
        result['T03_liquid_mana'][label] = dict(no_mordeaux_at_4=4-4+gain,
            with_mordeaux_at_5_uncapped=uncapped,
            with_mordeaux_at_5_global_cap_10=min(10, uncapped),
            with_mordeaux_at_5_current_max_cap_5=min(5, uncapped))
    result['T03_liquid_mana']['sphere_with_mordeaux_at_5_uncapped'] = 5-1+2
    result['T03_liquid_mana']['dome_with_mordeaux_face_damage'] = 6*2
    result['T03_liquid_mana']['revised_U_gain3_draw1'] = dict(
        no_mordeaux_at_4_spark=3, no_mordeaux_cards_drawn=1,
        with_mordeaux_at_5_uncapped=7, with_mordeaux_cards_drawn=2)
    # T04: Daxon reduces either Pearl face from 1 to 0.
    result['T04_pearl'] = dict(turn_two_total_cost=2+max(0,1-1),
        reversed_pearl=dict(attack=3+2, health=1, survives_elira_2=False),
        upright_pearl=dict(attack=3, health=1+2, after_elira_2=1),
        earlier_upright_buff=dict(attack=3+1, health=1+2))
    # T05: defender in Past cannot intercept an attack into Future.
    result['T05_brookskippers'] = dict(cost=2, cards_drawn=1,
        merrick_damage_to_guard_without_move=4, merrick_hero_damage_after_move=4,
        merrick_health_after_guard_combat=2-1)
    # T06: no other source of damage; attacker survives the redirected combat.
    result['T06_tidecaller'] = dict(
        current_R_on_fisherman=dict(attack=2+3,health=2+1,cost_to_daxon=4),
        proposed_R_on_fisherman=dict(attack=2+2,health=2+1,cost_to_daxon=4),
        aurium_R_on_fisherman=dict(attack=2+4,health=2+1,cost_to_daxon=4))
    # T07: Masque proposed edge-only aura; moving counts as the figure's action.
    result['T07_masque'] = dict(current_center_pylon_after_4_damage=4+1-4,
        proposed_center_pylon_after_4_damage=4-4,
        proposed_edge_guardpost_after_3_damage=3+1-3,
        proposed_guardpost_after_move_center=3-3)
    result['T08_moon_races'] = {}
    for incoming in (0, 2, 4):
        result['T08_moon_races'][f'start12_enemy{incoming}'] = {
            label: moon_race(12,incoming,active,passive)
            for label,active,passive in [
                ('no_healing',0,0), ('active_only_or_condition_unmet',3,0),
                ('current_rorik_or_condition_met_every_turn',3,1)]}
    result['T09_rorik_wording'] = dict(
        earlier_once_per_turn_max_heals_in_two_player_round=2,
        recommended_own_end_turn_max_heals_in_round=1)
    result['T10_lirielle_lovers'] = dict(start_hand_before_full_moon_draw=6,
        full_moon_draws=3, hand_after_draw=min(8,6+3), burned_on_draw=max(0,6+3-8),
        hand_after_playing_lovers=7, wisplight_last_rite_plus_lovers_draws=3,
        extra_burns_after_lovers=max(0,7+3-8), total_burns=3,
        replacement_windborne_attack=3)
    result['T11_calvera'] = dict(enemy_hp_empty_hand=5, upright_arrive_damage=5,
        own_hp_low=3, reversed_self_damage=3,
        reversed_body_attack=5, reversed_body_health=5)
    result['T12_first_turn_bonus'] = dict(daxon_first_turn_spark_without=1,
        with_proposed_bonus=2, guard_post_plus_pearl_R_cost=2,
        possible_arrival_hero_damage=5)
    result['T13_board_slot_clear'] = dict(full_own_board=3,
        can_play_vel_from_hand=False, can_cast_cannon_R=True,
        cannon_enemy_aoe=3, vel_enemy_aoe_if_slot_available=5)
    result['T14_bone_moon_totals'] = {str(n): n*(n+1)//2 for n in range(1,7)}
    OUT.write_text(json.dumps(result, indent=2, ensure_ascii=False)+'\n')
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
