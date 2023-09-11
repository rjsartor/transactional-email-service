# Transactional Email Service with Next.js

This is a simple transactional email service built with Next.js. It provides the ability to send emails using Mailgun or SendGrid from a UI form. If one service fails it should retry with the other. More specific usage is described below.

## Getting Started

- Make sure you have Node.js installed on your system: https://nodejs.org/en/download

### Installation

1. Clone the repository:
    ```
    git clone https://github.com/rjsartor/transactional-email-service.git
    ```


2. Move into project directory and install dependencies: 
    ```
    cd transactional-email-service
    npm install
    ```


3. Create a .env file in the root directory of the project and add the following variables
    ```
    MAILGUN_API_KEY=changeme
    MAILGUN_DOMAIN=changeme
    SENDGRID_API_KEY=changme
    ```
    Use your personal mailgun and sendgrid API keys/domain or contact me at randal.sartor@gmail.com for mine. 


4. Run development client and server 
    ```
    npm run dev
    ```

## Testing
To run backend tests, run:
    ```
    npm run test
    ```


## Usage

Visit http://localhost:3000/ and complete the form to send emails. You can use the first input to toggle between using Mailgun or Sendgrid as the default service. Once sent, open up the browser and terminal consoles to see logs for successful/unsuccessful requests and watch your email for incoming messages.

To test the transaction functionality, you can remove API key from the .env file. After restarting the application, make sure to select the removed API key service as the default service in the email form. Send another email and verify that an email still sent and fallback service was used.

***Important***:
If using my personal API key for Mailgun, the email address *rjsar707@gmail.com* ***must*** be used as the `from` email address. 
If using my personal API key and domain from Mailgun, authorized recipients must be added to the account.  

## Considerations

For this project I wanted to include both a frontend and a backend, but spend the majority of my effort working specifically on the email service, without wasting any time setting up the client or server. For this reason, I chose to build the service using Next.js which would quickly handle creating the client and server without any extra configuration or boilerplate necessary. This allowed me to create a simple form in the `index.tsx` file and an `/email` endpoint in the `api` directory. The only additional libraries I installed were `jest` for testing, and `axios`, which is my preferred library for HTTP requests, although I could have used native `fetch`, just as well. Overall, I wanted to make the application as simple to setup and use as possible, so testers can get it running quickly and send emails themselves to verify the functionality.  

In addition to Next.js, I considered building my own Node/Express backend, but felt that would have taken longer than using most of the same built-in functionality I'd get from Next. I also considered using Python and Django, but I'm less familiar with Python or Django than I am with Typescript and Node.

In total I spent 4 hours working on the implementation requirements (i.e., the email endpoint and service integrations) and an extra hour or two on non-required pieces like UI styling, backend tests, and documentation. 

With more time I would make the following improvements: 

1. Validation: I would improve validation by checking the format of emails and names, instead of the basic validation of checking for required strings. I would also add more responsive front-end validation, other than just disabling the submit button when any field is incomplete.  
2. Sendgrid API: I'm not sure if I missed or overlooked something in the Sendgrid API, but it seems strange that I can only send emails from 1 address in the `from` field. If this is really the case, I would make it more explicit in the form that my specific email address needs to be used for sending Sendgrid emails.
3. Improved logging and monitoring: Logging can definitely be made more consistent and specific. I would be sure to add a Logger class to help organize different messages types.
4. Service classes: I would probably add a parent EmailService class that both Sendgrid and Mailgun services could implement, especially if I added more functionality other than just `send`.
5. Testing: I've only added a field very simple unit test cases for the transactional email logic. I would add test suites for the email services classes, end-to-end tests that actually send emails, and a few front-end tests for the form.