# Participant Registry

A participant registry microservice with an API that supports adding, updating, removing and retrieving personal information about participants in a study.

## General Comments

This microservice has been built using [Express](https://expressjs.com/) & [TypeScript](https://www.typescriptlang.org/).
We are using [Open API](https://www.openapis.org/) to create a language-agnostic interface.
And we are also using [node-cache](https://github.com/node-cache/node-cache) as an in-memory cache.

### Model:

The `Name` has been split into `firstName` and `lastName` fields.
The `Date of birth` has not been split and is a single field.
The `Phone number` has been split into `countryCode` and `phoneNumber` fields.
The `Address` has been split into `addressLine1`, `addressLine2`, `postcode`, `city` fields.

The decision to split the information was made due to the fact that sending physical letters, SMS, and phone calls would require us to be quite specific and avoid errors associated with trying to identify things within a larger piece of text such as an address that looks like this (example): 123 Test Street, Flat A, T1 1AB, London.

### Things To Note:

A user cannot have the same phone number as another user. A user can have the same name, date of birth and address however. This was a decision I made based on the fact that we will be sending SMS texts addressing a specific individual, and for privacy reasons we would want to make sure only that user has access to that information. An address can be shared (families, flatmates) and so can a name and a date of birth, but a phone number should not be in my opnion, at least not in this case.
*Should this microservice were to be consumed by a larger platform that the user has already signed up to and where we have already made sure a user's phone number is unique, then the above check would not have to be implemented, however in this instance, because I am not aware of who is going to be consuming this service, I decided to implement it.*

We are using Swagger to generate documentation, which can ease things for anyone that plans on consuming this service. You can access the documentation [here](http://localhost:3000/api-docs) after starting the server.

## How To Run

Run the below command at the package root to install all dependencies and generate the `node_modules` directory:

### `yarn install`

Run the below command at the package root to generate the `build` folder with the transpiled javascript.

### `yarn build`

Run the below command at the package root to start the server.

### `yarn start`

(Optional) Run the below command at the package root to start the development server if you want to watch for changes.

### `yarn dev`

## How To Test

We are testing this microservice using integration tests which closely mimic production.
We are using supertest, mocha and chai along with nyc to create tests and display the code coverage, to run the tests run the below command:

### `yarn test`

## How To Consume

Should you wish to consume this microservice start the server, run the below command:

### `yarn start`

and then visit the [documentation](http://localhost:3000/api-docs). We are using Swagger to generate it.

## TODO

There's a lot more than we would need to add to this microservice for it to be production-ready.

1. User authentication, currently this microservice is publicly available - alternatively hide behind a private virtual network.
2. A database.
3. Configure the infrastructure so that we can scale horizontally (when needed).
4. An event queue for the POST request (writes) if many users attempt to sign up simultaneously.