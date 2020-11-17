from sqlalchemy import create_engine
import model
import server
from model import Result

engine = create_engine('postgresql:///donations')
conn = engine.raw_connection()
model.connect_to_db(server.app)
model.db.create_all()
model.db.create_all()
