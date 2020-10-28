from flask import Flask, render_template, request, flash, session, redirect, jsonify
from model import db, connect_to_db, Candidate, Organization
import crud

from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


@app.route('/')
def homepage():
    """View homepage."""

    return render_template('industries.html')


@app.route('/api/candidates')
def candidates():
    candidates = (db.session.query(Candidate.party, Candidate.state, Candidate.firstlast).\
        join(Organization, Organization.recip_id == Candidate.cid).\
        distinct().order_by(Candidate.state, Candidate.party, Candidate.firstlast))
    states = {}
    for candidate in candidates:
        if candidate.state not in states:
            states[candidate.state] = []
        states[candidate.state].append(candidate)
    return jsonify({'candidates': {
        'states': states
    }})


@app.route('/api/candidates/<firstlast>')
def candidate(firstlast):
    candidates = (db.session.query(Candidate.party, Candidate.state, Candidate.firstlast,
        Organization.orgname, Organization.amount).
        join(Organization, Organization.recip_id == Candidate.cid).
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
    orgs = sorted(organization_list, key=lambda i: i['amount'], reverse=True)
    return jsonify({'candidate': {
        'orgs': orgs,
    }})


@app.route('/api/donors/<orgname>')
def donor(orgname):
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
        existing_candidates = list(candidate for candidate in candidate_list if candidate['firstlast'] == donation.firstlast)
        if existing_candidates == []:
            candidate_list.append(info)
        else:
            existing_candidates[0]['total'] += int(donation.amount)
    candidates = sorted(candidate_list, key = lambda i: i['total'],reverse=True)
    totals['all'] = sum(totals.values())
    totals['d_perc'] = round((totals['D']/totals['all'])*100)
    totals['r_perc'] = round((totals['R']/totals['all'])*100)
    totals['i_perc'] = round((totals['I']/totals['all'])*100)
    return jsonify({'donor': {
        'candidates': candidates,
        'totals': totals,
    }})


# @app.route('/api/donors/<orgname>')
# def donor(orgname):
#     donor = db.session.query(Organization.cycle, Candidate.party, Candidate.state,
#         Candidate.firstlast, Organization.orgname, Organization.amount).\
#         join(Candidate, Candidate.cid == Organization.recip_id).\
#         filter(Organization.orgname == orgname).\
#         order_by(Organization.cycle, Organization.amount).all()


@app.route('/api/donors')
def donors():
    donor_list = []
    donors = (db.session.query(Organization.cycle, Candidate.party, Candidate.state,
    Candidate.firstlast, Organization.orgname, Organization.amount).
    join(Candidate, Candidate.cid == Organization.recip_id).
    distinct().order_by(Organization.cycle, Organization.amount))
    for donor in donors:
        donor_list.append({'fec_trans_id': donor.fec_trans_id, 'orgname': donor.orgname})
    return jsonify({'donors': donor_list})


@app.route('/api/industries')
def industries():
    industry_list = []
    for industry in crud.get_industries():
        industry_list.append({'catcode': industry.catcode, 'catname': industry.catname})
    return jsonify({'industries': industry_list}) 


@app.route('/api/industries/<catcode>')
def industry(catcode):
    organizations = db.session.query(Organization.cycle, Candidate.party, Candidate.state,
        Candidate.firstlast, Organization.orgname, Organization.fec_trans_id, Organization.amount).\
        join(Candidate, Candidate.cid == Organization.recip_id).\
        filter(Organization.realcode == catcode).\
        order_by(Organization.cycle, Organization.amount).all()
    organization_list = []
    for organization in organizations:
        info = {'orgname': organization.orgname.strip()}
        if info not in organization_list:
            organization_list.append(info)
    return jsonify({'industry': {
        'organizations': organization_list
    }})


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)


# organizations = Organization.query.filter(
#     Organization.realcode == catcode).distinct(Organization.orgname).all()
