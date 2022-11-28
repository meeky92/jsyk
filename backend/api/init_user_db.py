import os
import psycopg2
from werkzeug.security import generate_password_hash, check_password_hash

conn = psycopg2.connect(
        host="localhost",
        port="5432",
        database="postgres",
        user="postgres",
        password="")
# removed postgres password

cur = conn.cursor()

cur.execute('DROP TABLE users')

cur.execute('CREATE TABLE users (id serial PRIMARY KEY,'
                                'full_name varchar (100) NOT NULL,'
                                'email varchar(100) NOT NULL,'
                                'password varchar (150) NOT NULL,'
                                'token varchar (32),'
                                'token_expiration timestamp,'
                                'date_created timestamp DEFAULT CURRENT_TIMESTAMP);'
                                 )

conn.commit()

cur.close()
conn.close()