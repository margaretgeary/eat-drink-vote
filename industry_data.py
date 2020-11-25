from sqlalchemy import create_engine
import model
import server
from model import Industry

with open("industry_codes.csv", 'r', encoding='ISO-8859-1') as f:
    engine = create_engine('postgresql:///donations')
    conn = engine.raw_connection()
    Industry.__table__.drop(engine)
    model.connect_to_db(server.app)
    model.db.create_all()
    cursor = conn.cursor()
    cmd = "COPY industries(catcode, catname, catorder, industry, sector, sector_long) FROM STDIN WITH (FORMAT CSV, HEADER FALSE, DELIMITER E'\t');"
    cursor.copy_expert(cmd, f)
    conn.commit()