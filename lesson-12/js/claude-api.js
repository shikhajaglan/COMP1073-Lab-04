// HELPER: Available API Endpoints
// Base URL: https://georgian.polaristechservices.com

/* CLAUDE API ENDPOINTS */
// 1. POST /api/claude/messages - Send message to Claude
//    Headers: X-Student-API-Key: your_student_id, Content-Type: application/json
//    Body: { model: "claude-3-5-sonnet-20241022", max_tokens: 100, messages: [{ role: "user", content: "your message" }] }
//    Response: { content: [{ text: "Claude's response" }], usage: { input_tokens: 10, output_tokens: 20 } }

// 2. GET /api/claude/status - Check token usage
//    Headers: X-Student-API-Key: your_student_id
//    Response: { student_id: "12345", student_name: "John Doe", tokens_used: 500, tokens_allocated: 10000, tokens_remaining: 9500, is_enabled: true }

/* STEP 1: Store the API configuration */
const baseURL = "https://georgian.polaristechservices.com/api/claude";

/* STEP 2: Set your student API key (student ID) */
const studentApiKey = "200575989";

/* STEP 3: Set the maximum tokens for API requests */
const maxTokens = 1000;

/* STEP 4: Reference the DOM elements you'll need to access */
const userMessage = document.querySelector("#user-message");
const sendMessageBtn = document.querySelector("#send-message");
const checkUsageBtn = document.querySelector("#check-usage");
const results = document.querySelector("#results");

/* STEP 5: Store conversation history */
let conversationHistory = [];

/* STEP 6: Add event listeners for all interactive elements */
// STEP 6a: Send message button
sendMessageBtn.addEventListener("click", sendChatMessage);

// STEP 6b: Check usage button
checkUsageBtn.addEventListener("click", checkTokenUsage);

/* STEP 7: Create the checkTokenUsage function */
function checkTokenUsage(){
    // STEP 7a: Create complete url
    let url = `${baseURL}/status`;
    console.log(url);
    
    // STEP 7b: Request status from the API
    fetch(url, {
        headers: {
            "X-Student-API-Key": studentApiKey
        }
    }).then(res => {
        // STEP 7c: Handle the response
        return res.json();
    }).then(json => {
        displayStatus(json);
    });
}

function displayStatus(responseJson){
    console.log(responseJson);
    // STEP 7d: Display to user
    let pre = document.createElement("pre"); //<pre></pre>
    pre.textContent = `Enabled: ${responseJson.is_enabled}
Last Used: ${responseJson.last_used_at}
Student ID: ${responseJson.student_id}
Name: ${responseJson.student_name}
Tokens Allocated: ${responseJson.tokens_allocated}
Tokens Remaining: ${responseJson.tokens_remaining}
Tokens Used: ${responseJson.tokens_used}`;
    results.appendChild(pre);
}

/* STEP 8: Create the sendChatMessage function for Claude API interaction */
function sendChatMessage(){
    // STEP 8a: Get form values
    let userInput = userMessage.value.trim();
    if (!userInput) return;

    // LAB STEP 1a: Add the user's message to conversationHistory
    conversationHistory.push({ role: "user", content: userInput });

    // STEP 8b: Create complete url
    let url = `${baseURL}/messages`;

    // STEP 8c: Prepare the request body with entire conversation
    let requestBody = {
        model: "claude-3-5-sonnet-20241022",
        max_tokens: maxTokens,
        messages: conversationHistory
    };

    // STEP 8d: Make the API request using fetch()
    fetch(url, {
        method: "POST",
        headers: {
            "X-Student-API-Key": studentApiKey,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    }).then(response => {
        // STEP 8e: Handle the response
        return response.json();
    }).then(json => {
    // LAB STEP 1b: Add Claude's response to conversationHistory
        let claudeReply = json.content[0].text;
        conversationHistory.push({ role: "assistant", content: claudeReply });

        // LAB STEP 2: Display conversation in a chat format
        displayChat(userInput, claudeReply);

        // Clearing the input box
        userMessage.value = "";
    });
}

/* LAB STEP 2: Update display logic for chat-style appearance */
function displayChat(userText, claudeText){
    // User Message Block
    let userDiv = document.createElement("div");
    userDiv.classList.add("message", "user");
    userDiv.textContent = userText;

    // Claude Response Block
    let claudeDiv = document.createElement("div");
    claudeDiv.classList.add("message", "claude");
    claudeDiv.textContent = claudeText;

    // Appending  both to results section
    results.appendChild(userDiv);
    results.appendChild(claudeDiv);
}