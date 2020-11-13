from flask import Flask, render_template, request, flash, session, redirect, jsonify
from model import db, connect_to_db, Candidate, Organization, Industry, Vote
from crud import catname_list
import crud

from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


@app.route('/')
@app.route('/industries')
@app.route('/candidates')
@app.route('/quiz')
def get_pages():
    """View pages."""

    return render_template('campaignfinance.html')


@app.route('/api/industries')
def get_industries():
    industry_list = []
    for industry in crud.get_industries():
        industry_list.append({'catcode': industry.catcode, 'catname': industry.catname})
    return jsonify({'industries': industry_list}) 


@app.route('/api/industries/<catcode>')
def get_industries_by_catcode(catcode):
    organizations = db.session.query(Organization.cycle, Candidate.party, Candidate.state,
        Candidate.firstlast, Organization.orgname, Organization.fec_trans_id, Organization.amount).\
        join(Candidate, Candidate.cid == Organization.recip_id).\
        filter(Organization.realcode == catcode).\
        order_by(Organization.cycle, Organization.amount).all()
    unsorted_total_donated = {}
    unsorted_organization_list = []
    for organization in organizations:
        if organization.orgname not in unsorted_total_donated:
            unsorted_total_donated[organization.orgname.strip()] = 0
        unsorted_total_donated[organization.orgname.strip()] += int(organization.amount)
        info = {'orgname': organization.orgname.strip(),
            'amount': organization.amount}
        if info not in unsorted_organization_list:
            unsorted_organization_list.append(info)
    organization_list = sorted(unsorted_organization_list, key=lambda i: i['amount'])
    total_donated = {k: v for k, v in sorted(
        unsorted_total_donated.items(), key=lambda item: -item[1])}
    print("total_donated is:", total_donated)
    for org in list(total_donated.keys()):
        if total_donated[org] < 2800:
            del total_donated[org]
    return jsonify({'industry': {
        'organizations': organization_list,
        'total_donated': total_donated
    }})


@app.route('/api/donors')
def get_donors():
    donor_list = []
    donors = (db.session.query(Organization.cycle, Candidate.party, Candidate.state,
    Candidate.firstlast, Organization.orgname, Organization.amount).
    join(Candidate, Candidate.cid == Organization.recip_id).
    distinct().order_by(Organization.cycle, Organization.amount))
    for donor in donors:
        donor_list.append({'orgname': donor.orgname})
    return jsonify({'donors': donor_list})


@app.route('/api/donors/<orgname>')
def get_donors_by_orgname(orgname):
    donor = db.session.query(Organization.cycle, Candidate.party, Candidate.state,
        Candidate.firstlast, Organization.orgname, Organization.amount).\
        join(Candidate, Candidate.cid == Organization.recip_id).\
        filter(Organization.orgname == orgname).\
        order_by(Organization.cycle, Organization.amount).all()
    candidate_list = []
    totals = {
        'D': 0,
        'R': 0,
        'I': 0,
    }
    for donation in donor:
        totals[donation.party] += int(donation.amount)
        info = {
            'firstlast': donation.firstlast,
            'party': donation.party,
            'state': donation.state,
            'total': int(donation.amount)
        }
        existing_candidates = list(
            candidate for candidate in candidate_list if candidate['firstlast'] == donation.firstlast)
        if existing_candidates == []:
            candidate_list.append(info)
        else:
            existing_candidates[0]['total'] += int(donation.amount)
    candidates = sorted(candidate_list, key=lambda i: i['total'], reverse=True)
    totals['all'] = sum(totals.values())
    totals['d_perc'] = round((totals['D']/totals['all'])*100)
    totals['r_perc'] = round((totals['R']/totals['all'])*100)
    totals['i_perc'] = round((totals['I']/totals['all'])*100)
    return jsonify({'donor': {
        'candidates': candidates,
        'totals': totals,
    }})


@app.route('/api/vote/<bill>/<vote>')
def get_candidates_by_bill_and_vote(bill, vote):
    votes_list = []
    votes = (db.session.query(Candidate.firstlast, Vote.bill, Vote.vote,
        Organization.orgname, Organization.amount).
        join(Organization, Organization.recip_id == Candidate.cid).
        join(Vote, Vote.first_last == Candidate.firstlast).
        join(Industry, Organization.realcode == Industry.catcode).
        filter(Vote.bill == bill).filter(Vote.vote == vote).
        filter(Industry.catname.in_(catname_list)).all())
    for vote in votes:
        info = {
            'firstlast': vote.firstlast,
            'orgname': vote.orgname,
            'amount': int(vote.amount)
        }
        existing_votes = list(vote_event for vote_event in votes_list if vote_event['firstlast'] == vote.firstlast)
        if existing_votes == []:
            votes_list.append(info)
        else:
            existing_votes[0]['amount'] += int(vote.amount)
    votes = sorted(votes_list, key=lambda i: i['amount'], reverse=True)
    return jsonify({'donor': {
        'votes': votes,
        }})


@app.route('/api/answer/<bill>/<vote>/<brand>')
def get_quiz_result(bill, vote, brand):
    answers_list = []
    total_received = 0
    candidate_list = []
    answers = (db.session.query(Candidate.firstlast, Candidate.party, Candidate.state,
        Vote.bill, Vote.vote, Organization.orgname, Organization.amount).
        join(Organization, Organization.recip_id == Candidate.cid).
        join(Vote, Vote.first_last == Candidate.firstlast).
        join(Industry, Organization.realcode == Industry.catcode).
        filter(Vote.bill == bill).filter(Vote.vote == vote).filter(Organization.orgname == brand).
        filter(Industry.catname.in_(catname_list)).all())
    for answer in answers:
        total_received += int(answer.amount)
        info = {
            'firstlast': answer.firstlast,
            'party': answer.party,
            'vote': answer.vote,
            'bill': answer.bill,
            'state': answer.state,
            'orgname': answer.orgname,
            'amount': int(answer.amount)
        }
        existing_answers = list(
            answer_event for answer_event in answers_list if answer_event['firstlast'] == answer.firstlast)
        if existing_answers == []:
            answers_list.append(info)
        else:
            existing_answers[0]['amount'] += int(answer.amount)
        if answer.firstlast not in candidate_list: 
            candidate_list.append(answer.firstlast)
    candidate_count = len(candidate_list)
    answers = sorted(answers_list, key=lambda i: i['amount'], reverse=True)
    return jsonify({'response': {
        'answers': answers,
        'total_received': total_received,
        'candidate_list': candidate_list,
        'candidate_count': candidate_count
        }})


@app.route('/api/states')
def get_states():

    states_list = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN",
                   "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]

    return jsonify({'states': states_list})


@app.route('/api/states/<state>')
def get_candidates_by_statename(state):
    candidates = (db.session.query(Candidate.party, Candidate.state, Candidate.firstlast,
        Organization.orgname, Organization.amount).
        join(Organization, Organization.recip_id == Candidate.cid).
        filter(Candidate.state == state).
        distinct().order_by(Candidate.state).all())
    candidate_list = []
    for candidate in candidates:
        info = {
            'firstlast': candidate.firstlast,
            'party': candidate.party
        }
        if info not in candidate_list:
            candidate_list.append(info)
    return jsonify({'state': {
        'candidates': candidate_list,
    }})


@app.route('/api/candidates')
def get_candidates():
    candidate_list = []
    candidates = (db.session.query(Candidate.party, Candidate.state, Candidate.firstlast).
                  join(Organization, Organization.recip_id == Candidate.cid).
                  distinct().order_by(Candidate.state, Candidate.party, Candidate.firstlast))
    for candidate in candidates:
        candidate_list.append({'firstlast': candidate.firstlast,
                               'party': candidate.party,
                               'state': candidate.state})
    return jsonify({'candidates': candidate_list})


@app.route('/api/candidates/<firstlast>')
def get_candidates_by_name(firstlast):
    candidates = (db.session.query(Candidate.party, Candidate.state, Candidate.firstlast,
                                   Organization.orgname, Organization.amount).
                  join(Organization, Organization.recip_id == Candidate.cid).
                  join(Industry, Organization.realcode == Industry.catcode).
                  filter(Candidate.firstlast == firstlast).
                  distinct().order_by(Candidate.firstlast).all())
    organization_list = []
    for candidate in candidates:
        info = {
            'orgname': candidate.orgname,
            'amount': int(candidate.amount)
        }
        existing_orgs = list(
            organization for organization in organization_list if organization['orgname'] == candidate.orgname)
        if existing_orgs == []:
            organization_list.append(info)
        else:
            existing_orgs[0]['amount'] += int(candidate.amount)
    all_orgs = sorted(organization_list,
                      key=lambda i: i['amount'], reverse=True)
    orgs = [o for o in all_orgs if o['amount'] > 2800]
    return jsonify({'candidate': {
        'orgs': orgs,
    }})


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)


# organizations = Organization.query.filter(
#     Organization.realcode == catcode).distinct(Organization.orgname).all()
