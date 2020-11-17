"""Models for campaign finance app."""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Candidate(db.Model):
    """A Candidate."""

    __tablename__ = 'candidates'

    cid = db.Column(db.String, primary_key=True)
    firstlast = db.Column(db.String)
    party = db.Column(db.String)
    state = db.Column(db.String)

    def __repr__(self):
        return f'<Candidate cid={self.cid} name={self.firstlast} party={self.party}>'


class Organization(db.Model):
    """An organization."""

    __tablename__ = 'organizations'

    cycle = db.Column(db.String)
    fec_trans_id = db.Column(db.String, primary_key=True)
    contribid = db.Column(db.String)
    contrib = db.Column(db.String)
    recip_id = db.Column(db.String)
    orgname = db.Column(db.String)
    ult_org = db.Column(db.String)
    realcode = db.Column(db.String)
    date = db.Column(db.String)
    amount = db.Column(db.Integer)
    street = db.Column(db.String)
    city = db.Column(db.String)
    state = db.Column(db.String)
    zip = db.Column(db.String)
    recip_code = db.Column(db.String)
    type_ = db.Column(db.String)
    cmte_id = db.Column(db.String)
    other_id = db.Column(db.String)
    gender = db.Column(db.String)
    microfilm = db.Column(db.String)
    occupation = db.Column(db.String)
    employer = db.Column(db.String)
    source = db.Column(db.String)

    def __repr__(self):
        return f'<Organization orgname={self.orgname} realcode={self.realcode}>'


class Industry(db.Model):
    """An industry."""

    __tablename__ = 'industries'

    catcode = db.Column(db.String, primary_key=True)
    catname = db.Column(db.String)
    catorder = db.Column(db.String)
    industry = db.Column(db.String)
    sector = db.Column(db.String)
    sector_long = db.Column(db.String)

    def __repr__(self):
        return f'<Industry catcode={self.catcode} catname={self.catname}>'


class Vote(db.Model):
    """A vote."""

    __tablename__ = 'votes'

    vote_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    state = db.Column(db.String)
    district = db.Column(db.Integer)
    vote = db.Column(db.String)
    first_last = db.Column(db.String)
    party = db.Column(db.String)
    bill = db.Column(db.String)
    bill_text = db.Column(db.String)

    def __repr__(self):
        return f'<Vote name={self.name} bill={self.bill}'


class Result(db.Model):

    __tablename__ = 'results'

    result_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String)
    results_json = db.Column(db.JSON)


def connect_to_db(flask_app, db_uri='postgresql:///donations', echo=True):
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    flask_app.config['SQLALCHEMY_ECHO'] = echo
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('Connected to the db!')


if __name__ == '__main__':
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)
