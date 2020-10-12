from flask import Flask, render_template, request
from model import Candidate
import requests
import os
import pprint

app = Flask(__name__)

def get_candidates():

    # states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
    # states = ["CA", "NY"]
    states=["CA"]

    candidates = []
    for state in states:
        print(f"Hitting opensecrets getLegislators for {state}...")
        get_legislators_response = requests.get(
            "http://www.opensecrets.org/api/?method=getLegislators",
            params={
                "apikey": os.environ['apikey'],
                "id": state,
                "output": "json",
            },
        ).json()
        response = get_legislators_response['response']
        legislators = response['legislator']
        if not isinstance(legislators, list):
            legislators = [legislators]
        for legislator in legislators:
            attributes = legislator['@attributes']
            attributes["state"] = state
            candidates.append(attributes)
        print(f"done, got  {len(legislators)} legislators.")
    return candidates

def get_donors():

    # years = ["2012", "2014", "2016", "2018", "2020"]
    years = ["2018"]

    candidates = Candidate.query.all()
    #candidates = Candidate.query.limit(3).all()
    # candidates = Candidate.query.filter(Candidate.firstlast=="Kirsten Gillibrand").all()

    donors = []
    for year in years:
        print(f"Hitting opensecrets candContrib for {year}...")
        for candidate in candidates:
            print(f"Hitting opensecrets candContrib for {candidate}...")
            donor_resp = requests.get(
                "https://www.opensecrets.org/api/",
                params={
                    "apikey": os.environ['apikey'],
                    "method": "candContrib",
                    "cid": candidate.cid,
                    "cycle": year,
                    "output": "json",
                },
            )
            if donor_resp.status_code == 404:
                # This candidate probably didn't exist in this year.
                continue
            print("URRRRRRRR response was", donor_resp.text)
            donor_resp_json = donor_resp.json()
            response = donor_resp_json['response']
            pprint.pprint(response)
            contributors = response['contributors']
            contributor = contributors['contributor']
            for contrib in contributor:
                attributes = contrib['@attributes']
                attributes["candidate"] = candidate
                donors.append(attributes)
            print(f"done, got  {len(donors)} donors.")
    return donors



        # for year in years:
        # for candidate in candidates:
        #     donor_resp = requests.get(
        #         "https://www.opensecrets.org/api/",
        #         params={
        #             "apikey": os.environ['apikey'],
        #             "method": "candContrib",
        #             "cid": candidate.cid,
        #             "cycle": year,
        #             "output": "json",
        #         },
        #     )
        #     print(f"URRRRRRRR donors for {candidate} in {year}")
        #     pprint.pprint(donor_resp.json())
        # return donor_resp.json()
