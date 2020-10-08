# """CRUD operations."""

from model import db, Politician, Donation, Donor, connect_to_db


def create_politician(name, party):
    """Create and return a new politician."""

    politician = Politician(name=name, party=party)

    db.session.add(politician)
    db.session.commit()

    return politician


def get_users():
    """Return all users."""

    return User.query.all()


def get_user_by_id(user_id):
    """Return a user by primary key."""

    return User.query.get(user_id)


def get_user_by_email(email):
    """Return a user by email."""

    return User.query.filter(User.email == email).first()


def create_donor(donor_name, industry):
    """Create and return a new donor."""

    donor = Donor(donor_name=donor_name, industry=industry)

    db.session.add(donor)
    db.session.commit()

    return donor


def get_movies():
    """Return all movies."""

    return Movie.query.all()


def get_movie_by_id(movie_id):
    """Return a movie by primary key."""

    return Movie.query.get(movie_id)


def create_donation(politician, donor, amount):
    """Create and return a new donation."""

    donation = Donation(politician=politician, donor=donor, amount=amount)

    db.session.add(donation)
    db.session.commit()

    return donation


if __name__ == '__main__':
    from server import app
    connect_to_db(app)