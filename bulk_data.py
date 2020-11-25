from sqlalchemy import create_engine
import model
import server
from model import Organization

with open("indivs18.csv", 'r', encoding='ISO-8859-1') as f:
    engine = create_engine('postgresql:///donations')
    conn = engine.raw_connection()
    Organization.__table__.drop(engine)
    model.connect_to_db(server.app)
    model.db.create_all()
    cursor = conn.cursor()
    cmd = "COPY organizations(cycle, fec_trans_id, contribid, contrib, recip_id, orgname, ult_org, realcode, date, amount, street, city, state, zip, recip_code, type_, cmte_id, other_id, gender, microfilm, occupation, employer, source) FROM STDIN WITH (FORMAT CSV, HEADER FALSE, QUOTE '|', DELIMITER ',');"
    cursor.copy_expert(cmd, f)
    conn.commit()