import json

file = input('Enter a file to pare down\n')

# Keys to remove to pare down the file. Edit as needed for future projects.
keys_to_delete = {
    'related_uris', 'purchase_uris', 'set_uri', 'set_search_uri',
    'scryfall_set_uri', 'rulings_uri', 'prints_search_uri',
    'card_back_id', 'artist_ids', 'illustration_id', 'id',
    'oracle_id', 'multiverse_ids', 'mtgo_id', 'arena_id',
    'tcgplayer_id', 'set_id', 'mtgo_foil_id', 'cardmarket_id',
    'lang', 'oversized', 'promo', 'variation', 'story_spotlight',
    'digital', 'penny_rank'
}

# Removes everything but commander related legalities.
legalities_keys_to_delete = {
    'standard', 'future', 'historic', 'timeless', 'gladiator',
    'pioneer', 'explorer', 'modern', 'legacy', 'pauper', 'vintage',
    'penny', 'oathbreaker', 'standardbrawl', 'brawl', 'alchemy',
    'duel', 'oldschool', 'premodern'
}

# Parse json.
with open(file, encoding='utf-8') as f:
    cards = json.load(f)

# Includes only cards legal in commander, for paper play,
# in English, and not oversized.
cards = [card for card in cards 
        if card.get('legalities', {}).get('commander', 'not_legal') != 'not_legal' 
        and 'paper' in card.get('games', [])
        and card.get('lang', '') == 'en'
        and not card.get('oversized', False)]

# Complete the deletion.
for card in cards:
    for key in list(card.keys()):
        if key in keys_to_delete:
            del card[key]
    if 'legalities' in card:
        for key in list(card['legalities'].keys()):
            if key in legalities_keys_to_delete:
                del card['legalities'][key]

# Write new JSON file.
with open('cards.json', 'w') as f:
    # add indent=x (after f) to create a more readable format.
    # Might be too many lines.
    json.dump(cards, f, indent=0)