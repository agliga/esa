# eBayOnAlexa
eBay Voice App

eBay on Alexa consists of three parts.

1. eBayOnAlexa.zip: A AWS Lambda Alexa Function which is the voice App for eBay on Alexa
2. main.js: A Node.js App that stores the user input from Alexa into DynamoDB.
3. Sample_GettingStarted_JS_NV_JSON.html: A modified version of eBay Developer Sample app which can be found at http://developer.ebay.com/quickstartguide/sample/js/default.aspx

eBay On Alexa Setup Instructions

1. Use the link below to create a Custom Alexa Skill with AWS Lambda. It provides detailed instructions on what accounts are needed and how to setup custom skills https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function
2. Use http://echoism.io to test your skill
3. Create the eBayOnAlex Skill using the zip file and test it. You'll need to setup the skill with the files in the Lambda/ directory under the Alexa tab in the [Developer Console] (https://developer.amazon.com/edw/home.html#/)
4. Set up the Node.js app on your laptop. Instructions can be found here. https://coolestguidesontheplanet.com/installing-node-js-on-osx-10-10-yosemite/
5. Run the main.js Node.js App
6. Use the steps here to download and install eBay Developer Sample: http://developer.ebay.com/DevZone/finding/HowTo/GettingStarted_JS_NV_JSON/GettingStarted_JS_NV_JSON.html
7. Use the modified Sample_GettingStarted_JS_NV_JSON.html to try out eBay on Alexa.

How to Run
--------

```
npm install
npm start
```

Then navigate to localhost:8081
