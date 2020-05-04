# Belay: A Universal and Real-Time Chat Room
## Demo

### Login Page
![img](https://github.com/ruixili/Belay/blob/master/demo/LoginPage.png)
### Forget Password Page
![img](https://github.com/ruixili/Belay/blob/master/demo/ForgetPassword.png)
### Sign Up Page
![img](https://github.com/ruixili/Belay/blob/master/demo/RegisterNewAccount.png)
### Chat Page
![img](https://github.com/ruixili/Belay/blob/master/demo/ChatPage.png)
### Create New Channel
![img](https://github.com/ruixili/Belay/blob/master/demo/CreateNewChannel.png)
### Thread Message
![img](https://github.com/ruixili/Belay/blob/master/demo/Thread.png)


## Configuration

1. install all needed packages

`pip install -r requirements.txt`

2. create local database

- open your mysql database with ` mysql -u root -p`
- paste the sql query in `DBDatabaseCreation.sql` to create database `rxli`
- paste the sql query in `DBTableCreation.sql` to create tables
- change the DB_NAME, DB_USERNAME, DB_PASSWORD to your database in `secrets.cfg`

3. run the following code to start the project on port 5000

`python -m flask run -p 5000`

## Future Improvement
- Implement front-end using React.
