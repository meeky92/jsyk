import os
import psycopg2

conn = psycopg2.connect(
        host="localhost",
        port="5432",
        database="postgres",
        user="postgres",
        password="")
# Removed postgres password

# Open cursor for database operations
cur = conn.cursor()

cur.execute('DROP TABLE IF EXISTS form')

cur.execute('CREATE TABLE form (id serial PRIMARY KEY,'
                                'city varchar (100) NOT NULL,'
                                'specialty varchar (100) NOT NULL,'
                                'wages numeric (10,2) NOT NULL,'
                                'years_of_experience integer NOT NULL,'
                                'user_id integer NOT NULL,'
                                'date_created timestamp DEFAULT CURRENT_TIMESTAMP);'
                                 )

cur.execute('INSERT INTO form (city, specialty, wages, years_of_experience, user_id)'
            'VALUES (%s, %s, %s, %s, %s)',
            ('New York City',
             'ICU',
             50.25,
             5,
             1)
            )

cur.execute('INSERT INTO form (city, specialty, wages, years_of_experience, user_id)'
            'VALUES (%s, %s, %s, %s, %s)',
            ('Chicago',
             'L&D',
             40.5,
             2,
             1)
            )

conn.commit()

cur.close()
conn.close()