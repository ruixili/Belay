# Configuration

1. install all needed packages

`pip install -r requirements.txt`

2. create local database

- open your mysql database with ` mysql -u root -p`
- paste the sql query in `DBDatabaseCreation.sql` to create database `rxli`
- paste the sql query in `DBTableCreation.sql` to create tables
- change the DB_NAME, DB_USERNAME, DB_PASSWORD to your database in `secrets.cfg`

3. run the following code to start the project on port 5000

`python -m flask run -p 5000`

