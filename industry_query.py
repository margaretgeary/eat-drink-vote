import model
import server
from model import Industry, Organization, Donor

model.connect_to_db(server.app)
model.db.create_all()

# industry = Industry.query.filter(Industry.catname=='Poultry & eggs').first()

# catcode = industry.catcode
# print("Industry category code:", catcode)

# orgs = Organization.query.filter(Organization.realcode == catcode).distinct().all()
# print("Got orgs:", orgs)

# ---------------------------------

# orgname = Organization.query.filter(Organization.orgname.contains('chicken')).first()

# realcode = orgname.realcode

# industry_code = Industry.query.filter(Industry.catcode==realcode).distinct().all()
# print("Got industry code:", industry_code)

# ---------------------------------

organization = Organization.query.filter(Organization.orgname=='General Mills').distinct().first()
print("organization is:", organization)

orgname = organization.orgname
print("URRRR orgname from organization table is:", orgname)

org_name = Donor.query.filter(Donor.org_name==orgname).distinct().all()
print("URRRR org_name from donor table is:", org_name)


