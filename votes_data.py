from sqlalchemy import create_engine
import model
import server
from model import Vote

with open("votes_data.csv", 'r', encoding='ISO-8859-1') as f:
    engine = create_engine('postgresql:///donations')
    conn = engine.raw_connection()
    Vote.__table__.drop(engine)
    model.connect_to_db(server.app)
    model.db.create_all()
    cursor = conn.cursor()
    cmd = "COPY votes(state, district, vote, name, party, bill) FROM STDIN WITH (FORMAT CSV, HEADER TRUE, DELIMITER ',');"
    cursor.copy_expert(cmd, f)
    conn.commit()