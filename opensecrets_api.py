from flask import Flask, render_template, request
from model import Candidate
import requests
import os
import pprint

app = Flask(__name__)

def candidate_info():

    states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", 
          "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
          "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
          "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
          "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]

    for state in states:
        candidate_resp = requests.get(
            "http://www.opensecrets.org/api/?method=getLegislators",
            params={
                "apikey": os.environ['apikey'],
                "id": state,
                "output": "json",
            },
        )
    return candidate_resp.json()

def donor_info():

    years = ["2012", "2014", "2016," "2018", "2020"]

    candidates = Candidate.query.all()

    for year in years:
        for candidate in candidates:
            donor_resp = requests.get("https://www.opensecrets.org/api/?method=candContrib")
            params={
                "apikey": os.environ['apikey'],
                "cid": candidate,
                "cycle": year,
                "output": "json",
            },
        print(donor_resp.json())
        return donor_resp.json()