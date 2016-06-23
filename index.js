/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
             context.fail("Invalid Application ID");
        }
        */

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    saveSearchString(sessionAttributes.item, context, sessionAttributes, speechletResponse);
                    // context.succeed(buildResponse(sessionAttributes, speechletResponse));

                    console.log("onIntent callback");
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("SearchStringIntent" === intentName) {
        setSearchString(intent, session, callback);
    } 

    else if ("ItemCategoryIntent" === intentName) {
        setItemType(intent, session, callback);
    }

    else if ("ItemGenderIntent" === intentName) {
        setGender(intent, session, callback);
    }

    else if ("ItemDetailIntent" === intentName) {
        setItemDetail(intent, session, callback);
    } 

    else if ("PriceCeilingIntent" === intentName) {
        setCeiling(intent, session, callback);
    } 

    else if ("AMAZON.HelpIntent" === intentName) {
        getWelcomeResponse(callback);
    } 

    else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
        handleSessionEndRequest(callback);
    } 

    else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // The state variable defines which page we should be showing on the backend.
    // 0 --> Splash Screen
    // 1 --> Shoe Category
    // 2 --> List of shoes with given atttributes
    // 3 --> Specific Shoe

    // Initialize state to splash screen
    var sessionAttributes = { state: 0 };
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to eBay on Alexa. " +
        "You can Search for items on eBay and see the results on the monitor. ";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "What would you like to search for.  ";
        
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "Thank you for trying eBay on Alexa!";
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

/**
 * Sets the item in the session and prepares the speech to reply to the user.
 */
function setSearchString(intent, session, callback) {
    var cardTitle = intent.name;
    var searchStrSlot = intent.slots.Item;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var followOutput = "";

    if (searchStrSlot) {
        var searchStr = searchStrSlot.value;

        if (searchStr === "shoe" || searchStr === "shoes") {
            followOutput = "shoes are you looking for: Athletic, Casual, Formal, or Sneaker/Sandals?";
        }

        speechOutput = "Sure, I can help you with that. What type of " + followOutput;
        sessionAttributes = createSearchStringAttributes(searchStr);
        // repromptText = "You can find more about an item by saying tell me more about item using its ID";

    } else {
        speechOutput = "Did not catch what you are looking for. Please try again";
        repromptText = "You can search for items on eBay and look at the results on the monitor. ";
    }

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function createSearchStringAttributes(item) {
    // state 1 indicates we're determining a shoe category
    return {
        state: 1,
        item : item
    };
}

// Set type of item (in this case, athletic shoes) in the program state
function setItemType(intent, session, callback) {
    var cardTitle = intent.name;
    // Here we're getting the type of item 
    var searchStrSlot = intent.slots.Type;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var followOutput = "";

    if (searchStrSlot) {
        var searchStr = searchStrSlot.value;

        // console.log("");
        // console.log(session.attributes);
        // console.log("");

        // Assuming they're saying athletic, session.attributes.item should give us shoes, presumably we'll check if the item
        // is classifiable by gender
        speechOutput = "OK, let's look for " + searchStr + " " + session.attributes.item + ". Are you looking for men's or women's " + 
            session.attributes.item + "?"; 
            // state is 1
            // + " By the way, the state is " + session.attributes.state;
        // Manually setting sessionAttributes here, apparently they're not stored over multiple updates
        sessionAttributes = { item: session.attributes.item, type: searchStr, state: 1};
    }

    else {
            speechOutput = "Did not catch what category you are looking for. Please try again";
        }

        callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

// Sets the gender of the item, presumably we will check if this is needed in a less-hacky
// form of this program
function setGender(intent, session, callback) {
    var cardTitle = intent.name;
    // Here we're getting the gender
    var searchStrSlot = intent.slots.Gender;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var followOutput = "";

        if (searchStrSlot) {
            var searchStr = searchStrSlot.value;

            // Assuming they're saying male, session.attributes.item should give us shoes, presumably we'll check if the item
            // is classifiable by gender
            speechOutput = "Sure, let's look for " + searchStr + " " + session.attributes.type + " " + session.attributes.item 
                + ". What is your " + 
                session.attributes.item + " size?"; 
                // state is 1
                // + " By the way, the state is " + session.attributes.state;
            // Manually setting sessionAttributes here
            sessionAttributes = { item: session.attributes.item, type: session.attributes.type, state: 1, gender: searchStr};

        }

        else {
                speechOutput = "Did not catch what gendered item you are looking for. Please try again";
            }

            callback(sessionAttributes,
                 buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function saveSearchString(item, context, sessionAttributes, speechletResponse) {
  //var params = "{\"operation\":\"read\",\"tableName\":\"LambdaTable\",\"payload\":{\"Key\":{\"Id\":\"1\"}}}";

  var options = {
    host: 'h8c6gba5x8.execute-api.us-east-1.amazonaws.com',
    path: '/prod/LambdaFunctionOverHttps',
    port: '443',
    method: 'POST'
   };

   var params = {
        "operation":"update",
        "tableName":"LambdaTable",
        "payload":
         {
            "Key": { 
              "Id": "1"
             },
            "UpdateExpression": "set state = :s, item = :i, type = :t, gender = :g, size = :size, maxcost = :c",
            "ExpressionAttributeValues": {
                // state is stored in each session attribute
                ":s": sessionAttributes.state,
                ":i": item,
                ":g": sessionAttributes.gender,
                ":t": sessionAttributes.type,
                ":size": sessionAttributes.size,
                ":c": sessionAttributes.ceiling
             }
        }
       };

  var https = require('https');
  var req = https.request(options, function(res) {
        console.log("statusCode: ", res.statusCode);
        res.on('data', function (chunk) {
            //body += chunk;
        });
        console.log("saveSearchString session attributes");
        console.log(sessionAttributes);

        context.succeed(buildResponse(sessionAttributes, speechletResponse));
    });
    
     console.log(JSON.stringify(params));
     req.write(JSON.stringify(params));
     req.end();  
}

function setItemDetail(intent, session, callback) {
    var cardTitle = intent.name;
    var itemDetailSlot = intent.slots.Size;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var itemDetail = "";


    if (itemDetailSlot) {
        var size = itemDetailSlot.value;
        speechOutput = "Let's look for size " + size + " " + session.attributes.gender + " " + session.attributes.type + " " + session.attributes.item 
                + ". Do you have a maximum price you'd like to spend?";
        shouldEndSession = false;

        sessionAttributes = { item: session.attributes.item, type: session.attributes.type, state: 2, gender: session.attributes.gender,
            size: size};
    } else {
        speechOutput = "Did not catch that. Could you please repeat what size. ";
    }

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

function setCeiling(intent, session, callback) {
    var cardTitle = intent.name;
    var ceilingSlot = intent.slots.Ceiling;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    var itemDetail = "";

    if (ceilingSlot) {
        var ceiling = ceilingSlot.value;
        speechOutput = "Great! Here are some size " + session.attributes.size + " " + session.attributes.gender + " " + session.attributes.type + " " + session.attributes.item 
                + "that are under " + ceiling + " dollars. Please say the number of the item if there is one that you would like to see.";
        shouldEndSession = false;

        sessionAttributes = { item: session.attributes.item, type: session.attributes.type, state: 1, gender: session.attributes.gender,
            size: session.attributes.size, ceiling: ceiling};
    } else {
        speechOutput = "Did not catch that. Could you please repeat what size. ";
    }

    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}