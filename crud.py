# """CRUD operations."""

from model import db, Candidate, Donation, Donor, Industry, Organization, connect_to_db


def create_candidate(cid, firstlast, party, state):
    """Create and return a new candidate."""

    candidate = Candidate(cid=cid, firstlast=firstlast, party=party, state=state)

    db.session.add(candidate)
    db.session.commit()

    return candidate


def get_all_candidates():
    """Return all candidates."""

    return Candidate.query.all()


def get_candidate_by_id(cid):
    """Return a user by primary key."""

    return Candidate.query.get(cid)


# def get_user_by_email(email):
#     """Return a user by email."""

#     return User.query.filter(User.email == email).first()


def create_donor(org_name):
    """Create and return a new donor."""

    donor = Donor(org_name=org_name)

    db.session.add(donor)
    db.session.commit()

    return donor


def get_all_donors():
    """Return all donors."""

    return Donor.query.all()


def get_donor_by_id(donor_id):
    """Return a donor by primary key."""

    return Donor.query.get(donor_id)


def create_donation(candidate, donor, total):
    """Create and return a new donation."""

    donation = Donation(candidate=candidate, donor=donor, total=total)

    db.session.add(donation)
    db.session.commit()

    return donation


def get_industries():

    catcode_list = ["A1300", "C2000", "C4100", "C5000", "C5110", "C5210", "C6100", "C6200", "C6300", "C6400", "C6500", "E1110", "F2300", "F3200", "G2100", "G2300", "G2400", "G2600", "G2700", "G2800", "G4000", "G4300", "G4500", "G4900", "G2600", "G2810", "G2900", "G4900", "H4000", "H5100", "M3200", "M3300", "T1100", "T2100",
        "A000", "A1000", "A1200", "A1400", "A1500", "A1600", "A2000", "A2300", "A3000", "G2000", "G2100", "G2110", "G2200", "G2300", "G2350", "G2400", "G2500", "G2600", "G2700", "G2800", "G2810," "G2820", "G2910"]

    return db.session.query(Industry).filter(Industry.catcode.in_((catcode_list))).all()


def get_industries_by_catcode(catcode):

    return Industry.query.get(catcode)


def match_orgs_and_donors():

    match = db.session.query(Organization, Donor).filter(Organization.orgname == Donor.org_name).all()
    
    return match

if __name__ == '__main__':
    from server import app
    connect_to_db(app)

# ---------------------------------------------------------------
# # """CRUD operations."""

# from model import db, Politician, Donation, Donor, connect_to_db



# def create_politician(name, party):
#     """Create and return a new politician."""

#     politician = Politician(name=name, party=party)

#     db.session.add(politician)
#     db.session.commit()

#     return politician


# def get_users():
#     """Return all users."""

#     return User.query.all()


# def get_user_by_id(user_id):
#     """Return a user by primary key."""

#     return User.query.get(user_id)


# def get_user_by_email(email):
#     """Return a user by email."""

#     return User.query.filter(User.email == email).first()


# def create_donor(donor_name, industry):
#     """Create and return a new donor."""

#     donor = Donor(donor_name=donor_name, industry=industry)

#     db.session.add(donor)
#     db.session.commit()

#     return donor


# def get_movies():
#     """Return all movies."""

#     return Movie.query.all()


# def get_movie_by_id(movie_id):
#     """Return a movie by primary key."""

#     return Movie.query.get(movie_id)


# def create_donation(politician, donor, amount):
#     """Create and return a new donation."""

#     donation = Donation(politician=politician, donor=donor, amount=amount)

#     db.session.add(donation)
#     db.session.commit()

#     return donation


# if __name__ == '__main__':
#     from server import app
#     connect_to_db(app)
