from flask import Flask, render_template, request
from model import Candidate
import requests
import os
import pprint

app = Flask(__name__)

def get_candidates():

    #states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
    states = ["CA", "NY"]

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
            candidates.append(attributes)
        print(f"done, got  {len(legislators)} legislators.")
    return candidates

def donor_info():

    #years = ["2012", "2014", "2016", "2018", "2020"]
    years = ["2020"]

    #candidates = Candidate.query.all()
    #candidates = Candidate.query.limit(3).all()
    candidates = Candidate.query.filter(Candidate.firstlast=="Josh Harder").all()

    for year in years:
        for candidate in candidates:
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
            print(f"URRRRRRRR donors for {candidate} in {year}")
            pprint.pprint(donor_resp.json())
        return donor_resp.json()