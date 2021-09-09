# Game Master

Game Master is an e-commerce platform built with the MERN stack, Redux and Bootstrap.

![screenshot](https://github.com/DK194/GameMaster/blob/master/uploads/gamemaster.png)

## Description

Game Master is a video games shop, that allows you to search for your favorite products, add them to your shopping cart, write customer reviews and finally, make a payment by using the PayPal API. The top rated products are displayed on the products carousel. Users can manage their profile and edit their credentials. They can also check their orders and their current status. Game Master also features an admin panel, that allows admin to manage the products (add, edit, delete), users (edit, delete, give admin rights) and orders (check the orders and mark them as sent).

## Usage

### Warning! The products featured on Game Master Shop are fake, and used for the presentation purposes only! I'm not responsible for any potential credit card charges or other financial losses! In order to test the payment function safely, please use the PayPal sandbox account provided down below.

Game Master is already deployed to Heroku, and you can check the working app [here](https://game-master-shop.herokuapp.com).

In order to test it, you can either register a new user or sign in with the following credentials:

```
Normal users: 

Email: jblack@example.com
Password: jblack

Email: jwhite@example.com
Password: jwhite

Admin user:

Email: admin@example.com
Password: adminuser
```

In order to test the payment function, please use the following PayPal sandbox account (make sure that the URL starts with https://www.sandbox.paypal.com):

```
Email: paypaltestuser@example.com
Password: Testing1
``` 

However, if you want to run the app locally, you need some additional setup.

### How to start

Clone the following [repo](https://github.com/DK194/GameMaster/tree/local). You can do it by running the ```git clone``` command in your terminal:  

```
git clone -b local https://github.com/DK194/GameMaster.git
```

### Env variables

The next step is to set up the .env variables. Create an .env file in your root directory. Then add the following data:

```
NODE_ENV = development
PORT = 5000
MONGO_URI = Enter your MongoDB URI 
JWT_SECRET = '123456'
PAYPAL_CLIENT_ID = Enter your PayPal client ID
```

Your own PayPal Client ID is required in order to connect with the PayPal API. You can grab your ID [here](https://developer.paypal.com/home).

### Sample Data

Use the following command to fill your database with some sample users and products:

```
npm run importData
```

Now you can sign in with the following credentials:

```
Normal users: 

Email: jblack@example.com
Password: jblack

Email: jwhite@example.com
Password: jwhite

Admin user:

Email: admin@example.com
Password: adminuser
```

In order to clear the sample data, run the following command in your terminal:

```
npm run destroyData
```

### Installing dependencies

The last step is to install the required dependencies for both ```backend``` and ```frontend```. You can do it, by first going to your root directory, and then to your ```frontend``` folder, and running the command ```npm install``` in your terminal.

```
npm install
cd frontend
npm install
``` 

### Running the app

Now you can finally run your copy of a Game Master Shop locally, by running the ```npm run dev``` command in your terminal.
 
```
npm run dev
```

## Links

Game Master Repo - https://github.com/DK194/GameMaster

Game Master Local Build - https://github.com/DK194/GameMaster/tree/local

Game Master Live Version - https://game-master-shop.herokuapp.com

## Author

**Daniel Kurpiński**

- [GitHub Profile](https://github.com/DK194)
- Email - daniel.kurpinski94@gmail.com
