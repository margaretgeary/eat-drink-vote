# """Script to seed database."""

import os
import json
from random import choice, randint
import pprint

import crud
from model import Candidate
import model
import server
from opensecrets_api import candidate_info, donor_info

os.system('dropdb donations')
os.system('createdb donations')

model.connect_to_db(server.app)
model.db.create_all()

candidate_info = candidate_info()

candidates_in_db = []

response = candidate_info['response']
legislators = response['legislator']

for legislator in legislators:
    attributes = legislator['@attributes']
    firstlast = attributes['firstlast']
    party = attributes['party']
    cid = attributes['cid']

    db_candidate = crud.create_candidate(cid, firstlast, party)
    candidates_in_db.append(db_candidate)

donor_info = donor_info()
pprint.pprint(donor_info)
candidates_in_db = []

response = donor_info['response']
legislators = response['legislator']

for legislator in legislators:
    attributes = legislator['@attributes']
    firstlast = attributes['firstlast']
    party = attributes['party']
    cid = attributes['cid']

    db_candidate = crud.create_candidate(cid, firstlast, party)
    candidates_in_db.append(db_candidate)

pprint.pprint(candidates_in_db)

# Create 10 users; each user will make 10 ratings
# for n in range(10):
#     email = f'user{n}@test.com'  # Voila! A unique email!
#     password = 'test'

#     user = crud.create_user(email, password)

#     for _ in range(10):
#         random_movie = choice(movies_in_db)
#         score = randint(1, 5)

#         crud.create_rating(user, random_movie, score)
