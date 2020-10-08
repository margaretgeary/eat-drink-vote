from flask import Flask, render_template, request
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
            "http://www.opensecrets.org/api/?method=getLegislators&id=NJ&apikey=328d75a1609aade8bb040fa0fc597fde",
            params={
                "apikey": os.environ['apikey'],
                "id": state,
                "output": "json",
            },
        )
    return candidate_resp.json()

def industry_info():

    apikey = "328d75a1609aade8bb040fa0fc597fde"
    industry_resp = requests.get("https://www.opensecrets.org/api/?method=candIndustry&cid=N00007360&cycle=2020&apikey=328d75a1609aade8bb040fa0fc597fde"
        "",
        params={
            "apikey": apikey,
            "cid": "N00003389",
            "cycle": "2020",
            "output": "json",
        },
    )
    return industry_resp.json()