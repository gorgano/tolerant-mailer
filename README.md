# tolerant-mailer
Service that allows sending email to multiple services for fault tolerance


# Installation / Setup
```
npm install
```


Normally would want to store keys in a Parameter store or at the very least in a .env file.  For the ease of use here, environment files are simply included in the `src/env.ts` file.


# Running
```
npm run dev
```


## API Definition
Go to http://localhost:8080/api-docs/ for the API spec


## Running The Route
Example run for the route
```
curl --location 'localhost:8080/email' \
--header 'Content-Type: application/json' \
--data-raw '{
    "to": "gorgano@gmail.com",
    "to_name": "Jason Hurst",
    "from":"gorgano@gmail.com",
    "from_name":"Jason Hurst",
    "subject":"20% Cooler Test",
    "body":"<div>Body goes here with html and things</div>"
}'
```


NOTE: Sendgrid seems to have flagged me as spam and is working intermittently.  MailGun will only send to my email, any other email will result in an error.


# Framework and Libraries
- Using typescript with Node.
- Typescript allows for extra reliability with typing that always makes code better.
- Express was used to host the app. It was selected due to it's wide spread use.
- Axios is used to send post requests.  While there are native ways to send messages, packages like Axios allow for the use of async/await, as well as not having to deal with data chunks
- Swagger was used to provide API definitions as it is always nice to have documentation around how the API behaves.


# Tradeoffs / Left out
- Wanted to get to unit tests
- Wanted to include an ID for better tracking through the different functions and log output
- Wanted a proper logger service
- Would have liked to use a parameter store to hold values


# Time
Right at 5 hours







