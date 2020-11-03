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

    catname_list = ["Accident & health insurance",
                    "Airlines",
                    "Alcohol",
                    # "Artificial sweeteners and food additives",
                    "Auto manufacturers",
                    "Beer",
                    # "Beverage bottling & distribution",
                    "Beverages (non-alcoholic)",
                    "Computer components & accessories",
                    "Confectionery processors & manufacturers",
                    # "Crop production & basic processing",
                    "Department, variety & convenience stores",
                    "Drug stores",
                    # "Electronics manufacturing & services",
                    # "Entertainment Industry/Broadcast & Motion Pictures",
                    "Fish Processing",
                    # "Food & Beverage Products and Services",
                    "Food and kindred products manufacturing",
                    # "Food catering & food services",
                    "Food stores",
                    # "Food wholesalers",
                    "Hardware & building materials stores",
                    "Health care products",
                    "Hosting/Cloud Services",
                    "Investment banking",
                    "Livestock",
                    "Major (multinational) oil & gas producers",
                    "Meat processing & products",
                    "Milk & dairy producers",
                    "Online Entertainment",
                    # "Other commodities (incl rice, peanuts, honey)",
                    "Pharmaceutical manufacturing",
                    # "Pharmaceutical wholesale",
                    "Poultry & eggs",
                    "Restaurants & drinking establishments",
                    # "Retail trade",
                    "Schools & colleges",
                    "Search Engine/Email Services",
                    "Shoes & leather products",
                    "Social Media",
                    "Sugar cane & sugar beets",
                    "Telephone utilities",
                    "Tobacco & Tobacco products",
                    "Toiletries & cosmetics",
                    # "Vegetables, fruits and tree nut",
                    # "Vendors",
                    # "Wheat, corn, soybeans and cash grain",
                    "Wine & distilled spirits manufacturing"]

    return db.session.query(Industry).filter(Industry.catname.in_((catname_list))).order_by(Industry.catname).all()


def get_industries_by_catname(catname):

    return Industry.query.get(catname)


if __name__ == '__main__':
    from server import app
    connect_to_db(app)
