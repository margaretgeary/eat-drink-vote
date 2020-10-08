"""Models for campaign finance app."""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Politician(db.Model):
    """A politician."""

    __tablename__ = 'politicians'

    politician_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String, unique=True)
    party = db.Column(db.String)

    # donations = db.relationship("Donation")

    def __repr__(self):
        return f'<Politician politician_id={self.politician_id} name={self.name} party={self.party}>'


class Donor(db.Model):
    """A donor."""

    __tablename__ = 'donors'

    donor_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    donor_name = db.Column(db.String, unique=True)
    industry = db.Column(db.String)

    # donations = db.relationship("Donation")

    def __repr__(self):
        return f'<Donor donor_id={self.donor_id} donor_name={self.donor_name}>'


class Donation(db.Model):
    """A donation."""

    __tablename__ = 'donations'

    donation_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    amount = db.Column(db.Integer)
    politician_id = db.Column(db.Integer, db.ForeignKey('politicians.politician_id'))
    donor_id = db.Column(db.Integer, db.ForeignKey('donors.donor_id'))

    politician = db.relationship('Politician', backref='donations')
    donor = db.relationship('Donor', backref='donations')

    def __repr__(self):
        return f'<Donation donation_id={self.donation_id} amount={self.amount}>'

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

# ----------------------------------------------------------------

# """Models for movie ratings app."""

# from datetime import datetime
# from flask_sqlalchemy import SQLAlchemy

# db = SQLAlchemy()


# class User(db.Model):
#     """A user."""

#     __tablename__ = 'users'

#     user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
#     email = db.Column(db.String, unique=True)
#     password = db.Column(db.String)

#     # ratings = a list of Rating objects

#     def __repr__(self):
#         return f'<User user_id={self.user_id} email={self.email}>'


# class Movie(db.Model):
#     """A movie."""

#     __tablename__ = 'movies'

#     movie_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
#     title = db.Column(db.String)
#     overview = db.Column(db.Text)
#     release_date = db.Column(db.DateTime)
#     poster_path = db.Column(db.String)

#     # ratings = a list of Rating objects

#     def __repr__(self):
#         return f'<Movie movie_id={self.movie_id} title={self.title}>'


# class Rating(db.Model):
#     """A movie rating."""

#     __tablename__ = 'ratings'

#     rating_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
#     score = db.Column(db.Integer)
#     movie_id = db.Column(db.Integer, db.ForeignKey('movies.movie_id'))
#     user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))

#     movie = db.relationship('Movie', backref='ratings')
#     user = db.relationship('User', backref='ratings')

#     def __repr__(self):
#         return f'<Rating rating_id={self.rating_id} score={self.score}>'


# def connect_to_db(flask_app, db_uri='postgresql:///ratings', echo=True):
#     flask_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
#     flask_app.config['SQLALCHEMY_ECHO'] = echo
#     flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#     db.app = flask_app
#     db.init_app(flask_app)

#     print('Connected to the db!')


# if __name__ == '__main__':
#     from server import app

#     # Call connect_to_db(app, echo=False) if your program output gets
#     # too annoying; this will tell SQLAlchemy not to print out every
#     # query it executes.

#     connect_to_db(app)