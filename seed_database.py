# """Script to seed database."""

import os
import json
from random import choice, randint
import pprint

import crud
from model import Candidate
import model
import server
from opensecrets_api import get_candidates, donor_info





if True:
    os.system('dropdb donations')
    os.system('createdb donations')
    model.connect_to_db(server.app)
    model.db.create_all()
    candidates = get_candidates()
    candidates_in_db = []
    for candidate in candidates:
        db_candidate = crud.create_candidate(candidate['cid'], candidate['firstlast'], candidate['party'])
        candidates_in_db.append(db_candidate)
else:
    model.connect_to_db(server.app)

donor_info = donor_info()
pprint.pprint(donor_info)
donors_in_db = []

response = donor_info['response']
contributors = response['contributors']
contributor = contributors['contributor']

for contrib in contributor:
    attributes = contrib['@attributes']
    org_name = attributes['org_name']
    total = attributes['total']

    db_donor = crud.create_donor(org_name, total)
    donors_in_db.append(db_donor)

pprint.pprint(donors_in_db)

# Create 10 users; each user will make 10 ratings
# for n in range(10):
#     email = f'user{n}@test.com'  # Voila! A unique email!
#     password = 'test'

#     user = crud.create_user(email, password)

#     for _ in range(10):
#         random_movie = choice(movies_in_db)
#         score = randint(1, 5)

#         crud.create_rating(user, random_movie, score)
