# """CRUD operations."""

from model import db, Candidate, Industry, Organization, connect_to_db


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


def get_industries():

    catcode_list = ["A1300", "C2000", "C4100", "C5000", "C5110", "C5210", "C6100", "C6200", "C6300", "C6400", "C6500", "E1110", "F2300", "F3200", "G2100", "G2300", "G2400", "G2600", "G2700", "G2800", "G4000", "G4300", "G4500", "G4900", "G2600", "G2810", "G2900", "G4900", "H4000", "H5100", "M3200", "M3300", "T1100", "T2100",
        "A000", "A1000", "A1200", "A1400", "A1500", "A1600", "A2000", "A2300", "A3000", "G2000", "G2100", "G2110", "G2200", "G2300", "G2350", "G2400", "G2500", "G2600", "G2700", "G2800", "G2810," "G2820", "G2910"]

    return db.session.query(Industry).filter(Industry.catcode.in_((catcode_list))).all()


def get_industries_by_catcode(catcode):

    return Industry.query.get(catcode)


if __name__ == '__main__':
    from server import app
    connect_to_db(app)
