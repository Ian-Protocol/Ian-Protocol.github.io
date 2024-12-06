import json

file = input('Enter a file to pare down\n')

# Parse json.
with open(file, encoding='utf-8') as f:
    cards = json.load(f)

# Includes only legendary creatures.

legendary_creatures = [card for card in cards if 'type_line' in card and 'Legendary Creature' in card['type_line']]

# Write new JSON file.
with open('cards_legendary.json', 'w') as f:
    # add indent=x (after f) to create a more readable format.
    # Might be too many lines.
    json.dump(legendary_creatures, f, indent=0)