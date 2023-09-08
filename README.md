# Transactional Email Service with Next.js

This is a simple transactional email service built with Next.js. It provides the ability to send emails using Mailgun or SendGrid from a UI form. If one service fails it should retry with the other. More specific usage is described below.

## Getting Started

- First, make sure you have Node.js installed on your system: https://nodejs.org/en/download

### Installation

1. Clone the repository:
    ```
    git clone https://github.com/your-username/transactional-email-service.git
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

To test the transaction functionality, remove an API key from the .env file. Then, restart the application and make sure to select the removed API key service as the default service in the email form. Send another email and verify that the fallback service was used.

***Important***:
If using my personal API key for Mailgun, the email address *rjsar707@gmail.com* ***must*** be used as the `from` email address. 
If using my personal API key and domain from Mailgun, authorized recipients must be added to the account.  

## Considerations

For this project I wanted to include both a frontend and a backend, but spend the majority of my effort working specifically on the email service, without wasting any time setting the client or server. For that reason, I chose to built the service using Next.js which would quickly handle creating the client and server without any extra configuration necessary. This allowed me to create a simple form in the `index.tsx` file and create `/email` endpoint in the `api` directory. The only additional libraries I installed were `jest` for testing, and `axios`, which is my preferred library for HTTP requests, although I could have used native `fetch` as well. Overall, I wanted to make the application as simple to setup and use as possible. 

In addition to Next.js, I considered building my own Node/Express backend, but felt that would have taken longer than using most of the same built-in functionality I'd get from Next. I also considered using Python and Django, but I'm less familiar with Python or Django than I am with Typescript and Node.

In total I spent 4 hours working on the implementation requirements (i.e., the email endpoint and service integrations) and an extra hour or two on non-required pieces like UI styling, backend tests, and documentation. 

With more time I would make the following improvements: 
1. Validation: There's currently no front end validation other than disabling the submit button when all fields are completed. I would also improve backend validation by checking the format of emails and names, instead of just making sure they are strings and are present. 
2. Sendgrid API: I'm not sure if I missed or overlooked something in the Sendgrid API that would allow me to use other email addresses aside from my own in the `from` field. In any case, I would make it more explicit in the form that my email address needs to be used for sending Sendgrid emails.
3. Improved logging: I would make a Logger class to make my logs more standardized and consistent
4. Service classes: I would probably add a parent EmailService class that both Sendgrid and Mailgun services could extend, especially if I added anymore functionality other than just `send`.
5. Testing: I've only added a field very simple test cases. I'd like to improve my test coverage for more edge cases like: ( ), as well as adding mocked tests so that the service isn't actually being called on every test.
