from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = (
    "mssql+pyodbc://sa:Aa%40123456@127.0.0.1:1433/smd_db"
    "?driver=ODBC+Driver+17+for+SQL+Server"
)


engine = create_engine(
    DATABASE_URL,
    echo=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
print(engine.url)
