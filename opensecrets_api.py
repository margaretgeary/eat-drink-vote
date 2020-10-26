from flask import Flask, render_template, request
from model import Candidate
import requests
import os
import pprint

app = Flask(__name__)

def get_candidates():

    # states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
    # state= = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
    states = ["NC"]

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
