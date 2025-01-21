window.onload = ()=>{
    
    let suggestion_group;
    const suggestedQuestions = {};

    let user_id;
    let session_id;

    let Question;
    let Answer;

    let responseMsg;
    let inputValue;
    var chatHistory = [];

    function clearUserChat(){
        const parentDiv = document.getElementById('ABLMuawin_body');
        parentDiv.innerHTML = "";
        chatHistory = [];
        
        widgetStartTemplate.style.display = "flex"
        widget_mainTemplate.style.display = "none"
        refresh_btn.style.display = "none"
    }
    function inputField_placeholder(msgText = "", fontstyle="normal"){
        inputField_startTemplate.placeholder = msgText;
        style = document.createElement('style');
        style.innerHTML = `
         #InputMessage_startTemplate::placeholder{
            font-style: ${fontstyle};
        }`
        document.head.appendChild(style);
    }


    let sugGroupList = document.getElementById("suggestionsGroupList")
    async function getSuggestionGroupsEarly() {
        let group_url = "http://localhost:7000/api/get_alldata";
        try {
            response = await fetch(group_url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            suggestion_group = await response.json();
            if (suggestion_group.length > 5){
                const shuffledGroups = suggestion_group.sort(() => Math.random() - 0.5);
                suggestion_group = shuffledGroups.slice(0, 5);
            }
            suggestion_group.forEach((each) => {
                suggestedQuestions[each.category_name.toLowerCase()] = each.questions;

                // Suggested Group UI
                const divElement = document.createElement('div');
                divElement.className = "suggestion_group";
                divElement.innerHTML = `
                    <i class="${each.icon_theme}" style="color: ${each.color_theme};"></i>
                    ${each.category_name}`;
                sugGroupList.appendChild(divElement);
    
                // Attach click event listener to the group
                divElement.addEventListener("click", () => {
                    const msgText = each.category_name.trim();
                    if (inputField_startTemplate.value == ""){
                        inputField_placeholder(msgText, "italic")
                    }
                    inputField_startTemplate.focus();
    
                    let questions = suggestedQuestions[msgText.toLowerCase()];
                    if (questions) {
                        sugGroupList.style.display = "none";
                        sugQuestionsElement.style.display = "flex";
    
                        sugQuestionsElement.innerHTML = "";

                        const lineSeparater = document.createElement("div")
                        lineSeparater.style.cssText = "height: 1.2px; background-color: rgb(217, 217, 217); padding: 0px 10px; marginBottom: 6px;"
                        sugQuestionsElement.appendChild(lineSeparater)

                        if (questions.length > 4){
                            const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
                            questions = shuffledQuestions.slice(0, 4);
                        }
                        questions.forEach((question) => {
                            const questionDiv = document.createElement('div');
                            questionDiv.className = "suggestedQuestion";
                            questionDiv.innerHTML = `${question}`;
                            sugQuestionsElement.appendChild(questionDiv);
    
                            questionDiv.addEventListener("click", () => {
                                inputValue = questionDiv.textContent.trim();
                                inputField_placeholder("Ask ABL Muawin . . .", "normal")

                                inputField_startTemplate.value = null;
                                widgetStartTemplate.style.display = "none";
                                widget_mainTemplate.style.display = "block";
                                refresh_btn.style.display = "block";
    
                                sugGroupList.style.display = "flex";
                                sugQuestionsElement.style.display = "none";
                                sugQuestionsElement.innerHTML = "";
    
                                onSendingMsg();
                            });
                        });
                    } else {
                        console.log("No Questions Found, or Database not Connected.");
                    }
                });
            });
        } catch (error) {
            console.error(error.message);
        }
    } 
    getSuggestionGroupsEarly()   
    
    

    
    ablmuawin_widget = document.getElementById("ABLMuawin_widget")

    //  ========== ABL Muawin Authetication Widget ============
    ablMuawin_authentication_widget = document.getElementById("ablmuawin_authentication_widget")
    nameTag_authentication = document.getElementById("authentication_fullName")
    cnicTag_authentication = document.getElementById("authentication_CNIC")
    ablmuawin_authentication_widget_close = document.getElementById("ablmuawin_authentication_close")
    ablmuawin_widget_open = document.getElementById("ablmuawin_widget_open_btn")
    name_error_msg = document.getElementById("name_authentication_error_msg")
    cnic_error_msg = document.getElementById("cnic_authentication_error_msg")

    ablmuawin_open = document.getElementById("ablmuawin_sideBtn")
    
    // ========== Widget Start Theme =============
    let widgetStartTemplate = document.getElementById("ABLMuawin_startTemplate")
    let inputField_startTemplate = document.getElementById("InputMessage_startTemplate")
    let inputField_container = document.getElementById("startTemplate_inputField")
    let sugQuestionsElement = document.getElementById("suggestedQuestions")
    let msg_sending_btn = document.getElementById("msg_sending_btn")
    
    
    // ========= Widget Main Template ============
    let widget_mainTemplate = document.getElementById("ABLMuawin_mainTemplate")
    let msgContainer = document.getElementById('ABLMuawin_body')
    let ablmuawin_close = document.getElementById("ablmuawin_close")
    let abl_icon_msg = document.getElementById("icon_msg")
    let refresh_btn = document.getElementById("AblMuawin_refresh")
    
    


    // ******************* Authentication Widget *********************
    nameInput_authentication=""
    cnicInput_authentication=""

    nameTag_authentication.addEventListener("input", (event)=>{
        name_error_msg.style.visibility = "hidden"
        nameInput_authentication = event.target.value;
    })
    cnicTag_authentication.addEventListener("input", (event)=>{
        cnic_error_msg.style.visibility = "hidden"
        cnicInput_authentication = event.target.value;
    })


    // SIDE-BTN Click Handler
    ablmuawin_open.addEventListener("click", ()=>{
        
        if (ablmuawin_widget.style.display == "none" || ablmuawin_widget.style.display == ""){            
            if (nameInput_authentication != "" && cnicInput_authentication != ""){
                ablmuawin_authentication_widget.style.visibility = "hidden"
                ablMuawin_authentication_widget.className = "";
                ablmuawin_widget.style.display = "flex";
            }
            else{
                ablMuawin_authentication_widget.style.visibility = "visible";
                ablMuawin_authentication_widget.className = "show"
            }
            
        }
       
    })

    // CLOSE-BTN click Handler
    ablmuawin_authentication_widget_close.addEventListener("click", ()=>{
        ablMuawin_authentication_widget.className = "";
    })

    // START-CHAT Click Handler
    ablmuawin_widget_open.addEventListener('click', ()=>{       
        if (!nameInput_authentication){
            name_error_msg.style.visibility = "visible"
            return
        }else if (!cnicInput_authentication){
            cnic_error_msg.style.visibility = "visible"
            return
        }

        nameValidationRegex =  /[!@#$%^&*(),.?":{}|<>-]/;
        cnicValidationRegex =  /^[0-9]+$/;

        if (nameValidationRegex.test(nameTag_authentication.value)){
            name_error_msg.style.visibility = "visible";
            return
        }else if (!cnicValidationRegex.test(cnicTag_authentication.value.trim()) || nameValidationRegex.test(cnicTag_authentication.value) || cnicTag_authentication.value.trim().length != 13){
            cnic_error_msg.style.visibility = "visible";
            return
        }

        const postAuthenicationData = async () => {
            posturl = "http://localhost:7000/api/register_user";
            let data = {
              userName: nameInput_authentication,
              userCnic: cnicInput_authentication,
            };
          
            try {
              let response = await fetch(posturl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
              });
          
              if (!response.ok) {
                handleErrorPopup()
              }
          
              result = await response.json();
              console.log(result)
              user_id = result.id
              session_id = result.sessionId
              console.log(session_id)

              ablmuawin_authentication_widget.style.visibility = "hidden"
              ablMuawin_authentication_widget.className = "";
              ablmuawin_widget.style.display = "flex";
              
              cnicTag_authentication.value = ""
              nameTag_authentication.value = ""

            } catch (error) {
              console.error("Error while sending Authenication Post request:", error);
              handleErrorPopup() 
            }
          };
          postAuthenicationData();

        
        
        
        function handleErrorPopup() {
            const errorPopupHTML = ` <div id="ablmuawin_error_popup" style="position: fixed; right: 20%; top:15%; width: 60%; height: 7%; background-color: red; color:white; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); display: flex; justify-content:space-between; align-items:center; z-index: 999999999999999; transition: bottom 2s ease-in-out; overflow: hidden;  text-align:center; border-radius:14px; padding: 0px 20px; font-weight:bold; font-family: Poppins;">
                <div>ABL Muawin, currently not working.<span style="padding-left: 12px;">Please try again later.</span></div>
                <i id="abl_muawin_error_popup_close" class="fa-solid fa-xmark" style="font-size: large; cursor:pointer; font-weight:bold; padding:2.5px 5px; border-radius:2px;"></i>
            </div>`;
            document.body.insertAdjacentHTML("beforeend", errorPopupHTML);

            let closeButton = document.getElementById("abl_muawin_error_popup_close");
            closeButton.addEventListener("click", () => {
              const popup = document.getElementById("ablmuawin_error_popup");
              if (popup) {
                popup.remove();
              }
            });
            function adjustPopupWidth() {
                const popup = document.getElementById("ablmuawin_error_popup");
                if (popup) {
                  if (window.innerWidth < 620) {
                    popup.style.width = "90%";
                    popup.style.right = "5%"; 
                    popup.style.top = "8%"; 
                    popup.style.width = "60%";
                    popup.style.right = "20%"; 
                  }
                }
              }
              
              // Call the function initially and on window resize
              adjustPopupWidth();
              window.addEventListener("resize", adjustPopupWidth);
            console.log("Chatbot is not working Currently ")
        }
    
    })
    // =================================================================



    // ***************** Starter Theme of ABL Muawin *******************
    widgetStartTemplate.addEventListener("click", (event) => {
        console.log("Hello");
        if (!sugQuestionsElement.contains(event.target) && !sugGroupList.contains(event.target)) {
            // If the click is outside both elements
            sugGroupList.style.display = "flex";
            sugQuestionsElement.style.display = "none";
            inputField_startTemplate.placeholder = "Ask ABL Muawin . . ."; 
            style = document.createElement('style');
            style.innerHTML = `
             #InputMessage_startTemplate::placeholder{
                font-style: normal;
            }`
            document.head.appendChild(style); 
        }
    });
    
    // Optional: Prevent clicks inside sugGroupList from bubbling to widgetStartTemplate
    sugGroupList.addEventListener("click", (event) => {
        event.stopPropagation();
    });
    


    inputField_startTemplate.addEventListener("input", (event)=>{
        inputValue = event.target.value;

        if (inputValue){
            style = document.createElement('style');
            style.innerHTML = `
             #InputMessage_startTemplate::placeholder{
                font-style: normal;
            }`
            document.head.appendChild(style);
            inputField_startTemplate.placeholder = "Ask ABL Muawin . . .";   
        }

        if (Object.keys(suggestedQuestions).includes(inputValue.toLowerCase())){
            sugGroupList.style.display =  "none"
            sugQuestionsElement.style.display = "flex"
            
            questions = suggestedQuestions[inputValue.toLowerCase()]
            questions.forEach((question)=>{
            divElement =  document.createElement('div')
            divElement.className = "suggestedQuestion"
            divElement.innerHTML = `${question}`
            divElement.addEventListener("click", () => {
                text = divElement.textContent.trim();
                inputField_startTemplate.value = null;
                inputValue = text
                widgetStartTemplate.style.display = "none";
                widget_mainTemplate.style.display = "block";
                refresh_btn.style.display = "block";

                sugGroupList.style.display = "flex";
                sugQuestionsElement.style.display = "none";
                sugQuestionsElement.innerHTML = ""; 

                onSendingMsg();
            });
            sugQuestionsElement.appendChild(divElement)
        })
        }else {
            sugQuestionsElement.innerHTML = ""
            sugGroupList.style.display =  "flex"
            sugQuestionsElement.style.display = "none"
        }
    })
    inputField_startTemplate.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') { 
            inputField_startTemplate.value = null
            
            widgetStartTemplate.style.display = "none"
            widget_mainTemplate.style.display = "block"
            refresh_btn.style.display = "block"
            onSendingMsg()   
        }
    });

    msg_sending_btn.addEventListener('click', function() {
        if (inputField_startTemplate.value) { 
            inputField_startTemplate.value = null
            
            widgetStartTemplate.style.display = "none"
            widget_mainTemplate.style.display = "block"
            refresh_btn.style.display = "block"
            onSendingMsg()
        }
    });
    // ======================================================


    // *********** Widget Expand and Compress ***************
    let ablMuawin_expand_compress = document.getElementById("ablMuawin_Expand_Widget")
    if (window.innerWidth <= 900){
        ablMuawin_expand_compress.style.display = "none"
    }else{
        ablMuawin_expand_compress.style.display = "block" 
    }
   
    window.addEventListener("resize", ()=>{
        if (window.innerWidth < 1080 && window.innerWidth >= 980){
            ablmuawin_widget.style.height = "81%";
            ablmuawin_widget.style.width = "93%";
            inputField_container.style.width = "80%";
        }
        else if (window.innerWidth <= 980 && window.innerWidth >= 561){
            ablMuawin_expand_compress.style.display = "none"
            ablmuawin_widget.style.height = "79.2%";
            inputField_container.style.width = "89%";
            ablmuawin_widget.style.width = "500px";
            msgContainer.style.fontSize = "17px";
            ablMuawin_expand_compress.className = "fa-regular fa-square"
        }
        else if (window.innerWidth <= 560){
            ablMuawin_expand_compress.style.display = "none"
            inputField_container.style.width = "97%";
            sugGroupList.style.width = "97%"
            ablmuawin_widget.style.width = "430px";
            msgContainer.style.fontSize = "17px";
            ablMuawin_expand_compress.className = "fa-regular fa-square"
        }
        else{
            ablMuawin_expand_compress.style.display = "block"
        }
    })
   
    ablMuawin_expand_compress.addEventListener("click", ()=>{

         const default_messages = document.getElementsByClassName("ablMuawin_defined_message")  // ?

        if (ablMuawin_expand_compress.className == "fa-regular fa-square"){
            
            if (window.innerWidth < 1080 && window.innerWidth >= 980){
                ablmuawin_widget.style.height = "81%";
                ablmuawin_widget.style.width = "93%";
                inputField_container.style.width = "80%";
            }
            
            else if (window.innerWidth < 980){
                ablmuawin_widget.style.height = "80%";
                ablmuawin_widget.style.width = "90%";
                inputField_container.style.width = "80%";
            }else{
                ablmuawin_widget.style.height = "84%";
                ablmuawin_widget.style.width = "96%";
                inputField_container.style.width = "55%";
            }
           
            msgContainer.style.fontSize = "medium";
            ablMuawin_expand_compress.className = "fa-regular fa-window-restore"

            for (let element of default_messages) {
                element.style.fontSize = '16px'; 
                element.style.padding = "4px 24px";
              }

        }else{
            ablmuawin_widget.style.height = "79.2%";
            inputField_container.style.width = "89%";
            ablmuawin_widget.style.width = "500px";
            msgContainer.style.fontSize = "17px";
            ablMuawin_expand_compress.className = "fa-regular fa-square"

            for (let element of default_messages) {
                element.style.fontSize = '15px';
                element.style.padding = "3px 8px";
              }
            
        }
    })
    // ======================================================


    

    ablmuawin_close.addEventListener("click", () => {
        console.log("Close button clicked");
    
        // Create the confirmation dialog dynamically
        const confirmationDialog = document.createElement("div");
        confirmationDialog.id = "closeConfirmation";
        confirmationDialog.style.cssText = `
            display: block; 
            position: absolute; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            background: rgba(0, 0, 0, 0.5); 
            z-index: 9999; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            flex-direction: column;
        `;
    
        // Add the inner content
        confirmationDialog.innerHTML = `
            <div style="background: white; border-radius: 4px; display:flex; flex-direction: column; align-items: center; text-align: center; justify-content: center; width: 350px; padding: 10px 0px;">
                <p style="font-size: 18px; margin: 8px 0;">Are you sure you want to close this chat?</p>
                <div style="display: flex; justify-content: space-around; padding: 10px 0; width: 55%; font-size: 13px;">
                    <button id="ablMuawin_confirmClose" style="padding: 4px 10px; background-color: red; color: white; border: none; border-radius: 5px; cursor: pointer;">Yes, Close</button>
                    <button id="ablMuawin_cancelClose" style="padding: 4px 10px; background-color: gray; color: white; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
                </div>
            </div>
        `;
    
        // Append the dialog to the widget
        ablmuawin_widget.appendChild(confirmationDialog);
    
        // Add event listener for "Yes, Close" button
        document.getElementById("ablMuawin_confirmClose").addEventListener("click", () => {
            confirmationDialog.remove(); 
            ablmuawin_widget.className = "close";
            ablmuawin_widget.addEventListener("transitionend", () => {
                ablmuawin_widget.style.display = "none";
                ablmuawin_widget.className = ""; 
            });
            clearUserChat();
        });
    
        // Add event listener for "Cancel" button
        document.getElementById("ablMuawin_cancelClose").addEventListener("click", () => {
            confirmationDialog.remove(); // Remove the dialog
        });
    });
    

    
    // =========== ABL Muawin Refresh Chats ==========
    refresh_btn.addEventListener('click', clearUserChat);
    // ===============================================
    
    
    // ============== MESSAGE ZOOM In and Out ===============
    let fSize = 17; 
    msgContainer.addEventListener('wheel', (event) => {
        if (event.ctrlKey || event.metaKey) {
            event.preventDefault(); // Prevent default zoom behavior

            console.log(event.deltaY)

            if (event.deltaY < 0 && fSize <= 33) {
                fSize += 1;
            } else if (event.deltaY > 0 && fSize > 13) {
                fSize -= 1;
            }
            console.log("fontSIze is this: ", fSize)

            msgContainer.style.fontSize = `${fSize}px`;

        }
    });
    // ======================================================


    ablmuawin_open = document.getElementById("ablmuawin_sideBtn")


    // ********** TRacking user Msg and sending it to backend ***********
    const inputField = document.getElementById('userInput');
    inputField.addEventListener('input', function(event) {
            inputValue = event.target.value; 
    });
    inputField.addEventListener('keydown', function(event) {

        if (event.key === 'Enter' && !abl_icon_msg.classList.contains("fa-stop")) {             
            onSendingMsg()
        }
    });
    const msg_send = document.getElementById("msg_icon");
    msg_send.addEventListener("click", ()=>{
        if (abl_icon_msg.classList.contains("fa-arrow-up")){
            abl_icon_msg.classList.remove("fa-stop")
            onSendingMsg()
        }else{
            // Handle the Stop Streaming Response.
            streaming = false;
            console.log(responseMsg)
            if (responseMsg.innerHTML.trim() ==  `        <div class="chatbot-message">
            <span class="wait-dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </span>
        </div>`.trim()){
                    responseMsg.innerHTML = null;
                    responseMsg.classList.remove("ABLMuawin_responseMsg");
            }


            abl_icon_msg.classList.remove("fa-stop")
            abl_icon_msg.classList.add("fa-arrow-up")
        }
    })

    

    function onSendingMsg(){
        if (inputValue == ""){
            return
        }
        Question = inputValue
        console.log(Question)

        inputField.value = null;
        abl_icon_msg.classList.remove("fa-arrow-up")
        abl_icon_msg.classList.add("fa-stop")

        if (inputValue != ""){
            const newMessage = document.createElement('div');
            newMessage.style.width = '100%';
            newMessage.style.display = 'flex';
            newMessage.style.justifyContent = 'flex-end';

            //Create the inner div for the message text
            const messageText = document.createElement('div');
            messageText.className = 'ABLMuawin_userMsg';
            messageText.textContent = inputValue;

            newMessage.appendChild(messageText);
            msgContainer.appendChild(newMessage);
            autoScroll()
        }
        

        let ch = [];
        ch.push("user", inputValue);
        console.log(ch);
        chatHistory.push(ch);
        console.log(chatHistory)
        if (inputValue){
            var inputData = {
                 "input": {
                    "chat_history": chatHistory,
                    "question": inputValue
                },
                "config": {},
                "kwargs": {}
            };

            let apiUrl = "http://localhost:8000/question/stream";
            getChatbotResponse(apiUrl, inputData)
            inputValue = "";
        }

    }




    function isStringDict(str) {
        str = str.trim();
        str = str.replace(/'/g, '"');
        try {
            let parsed = JSON.parse(str);
            if (typeof parsed === 'object' && parsed !== null) {
                return true;
            }
            return false;
        } catch (e) {
            console.log("error");
            return false;
        }
    }

    function appendStreamMessage(sender, message) {
        const chatContainer = document.getElementById("ABLMuawin_body");
        const messageElement = document.createElement("div");
        messageElement.style.width = "100%"
        messageElement.style.display = "flex"
        messageElement.style.justifyContent = "start"
        responseMsg = document.createElement("div");
        responseMsg.className = 'ABLMuawin_responseMsg';
       
        responseMsg.innerHTML = `
        <div class="chatbot-message">
            <span class="wait-dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </span>
        </div>
        `;
    
        messageElement.appendChild(responseMsg);
    
        chatContainer.appendChild(messageElement);
    
        // Scroll to the bottom of the chat container
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return responseMsg;
    }

    function appendErrorMessage(sender, message) {
        const chatContainer = document.getElementById("ABLMuawin_body");
        const messageElement = document.createElement("div");
        messageElement.style.width = "100%"
        messageElement.style.display = "flex"
        messageElement.style.justifyContent = "start"
        responseMsg = document.createElement("div");
        responseMsg.className = 'ABLMuawin_errorMsg';
        responseMsg.innerHTML = `
        <div class="chatbot-message">
            <span class="wait-dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </span>
        </div>
        `;
    
        messageElement.appendChild(responseMsg);
    
        chatContainer.appendChild(messageElement);
    
        // Scroll to the bottom of the chat container
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return responseMsg;
    }

    var autoScroll = function () {
        //Set scroll down automatically
        const scrollingContainer = document.getElementById('ABLMuawin_body');
        // Set scroll behavior
        scrollingContainer.style.scrollBehavior = 'smooth';
        // Scroll down automatically
        scrollingContainer.scrollTop = scrollingContainer.scrollHeight;
    } 

    function handleStreamedData(text, outputDiv) {
        const events = text.split("\r\n");
        output = outputDiv

        let outputHtml = output.innerHTML;
        

        events.forEach(eventData => {
            var eventComponents = eventData.split(': ');
            if (eventComponents[0] === 'data') {
                //console.log(eventComponents);
                let data = eventData.slice(6).trim();

                try {
                    const parsedData = data;
                    if (parsedData) {
                        //console.log(parsedData)
                        if (!isStringDict(parsedData)) {
                            outputHtml += parsedData.replace(/\"/g, '').replace(/\\n/g, '<br>');
                            var linkedText = outputHtml.replace(/\[([^[]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
                            outputHtml = linkedText;
                        }
                    }
                } catch (error) {
                    outputHtml += data;
                }

                
            }
        });

        output.innerHTML = outputHtml;
        autoScroll();
    }

    let streaming = false;

    async function getChatbotResponse(apiUrl, userInput) {
        let outputDiv = null
        try {
            //appendMessage('user', userInput["input"]["question"]);
            //console.log(userInput);
            //console.log(apiUrl);
            const response = await fetch(apiUrl, {
                method: 'POST', 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userInput),
            });
            
    
            if (!response.body) {
                throw new Error("Readable stream not supported in this environment.");
                abl_icon_msg.classList.add("fa-stop")
                abl_icon_msg.classList.remove("fa-arrow-up")

            }
            const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let completeAnswer = "";
                let done = false;
            outputDiv = appendStreamMessage();
            streaming = true;
            counter = 0;
            while(streaming){
                //console.log(done);
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                // outputDiv.style.display = "flex";
                if (counter == 0){
                    outputDiv.innerHTML = null;
                    counter +=1
                }
                if(done){
                    
                    Answer = (outputDiv.innerHTML).trim()

                    if (Answer.toLowerCase() == "can you please rephrase your question?") {
                        outputDiv.innerHTML += `<div id="call_agent_ui" style="margin-top: 20px; padding: 0px 4px; border-top: 0.5 px solid grey; color:black;">
                            <hr style="margin:0; padding:0;">
                            <p style="margin: 0; font-size: 14px; padding: 8px; 0px; color:black;">
                                <i class="fa-duotone fa-solid fa-circle-exclamation" style="color:red; padding-right: 5px;"></i> 
                                Unable to find an answer? Would you like to connect with an ABL Live Agent?
                            </p> 
                            <div style="display:flex; align-items:center; gap:8px; font-size: 12px;">
                                <div class="callAgent_btn" style="border: 1.5px solid green; border-radius:6px; padding:2.5px 9px; display:flex; align-items:center; gap: 8px; cursor: pointer;"> 
                                    <span>Ok, Transfer</span>
                                    <i class="fa-solid fa-check" style="color: green;"></i>
                                </div>
                                <div class="callAgent_cancel_btn" style="border: 1.5px solid red; border-radius:6px; padding:2.5px 8px; display:flex; align-items:center; gap: 8px; cursor: pointer;"> 
                                    <span>Cancel</span>
                                    <i class="fa-solid fa-xmark" style="color: red;"></i>
                                </div>
                            </div>
                        </div>`;
                        autoScroll()
                    }
                    
                    // Event delegation
                    outputDiv.addEventListener("click", (event) => {
                        const target = event.target;
                    
                        // Handle "Ok, Transfer" button
                        if (target.closest(".callAgent_btn")) {
                            const callAgentUI = target.closest("#call_agent_ui");
                            if (callAgentUI) {
                                callAgentUI.innerHTML = `
                                    <hr style="margin:0; padding:0;">
                                    <p style="margin: 0; font-size: 14px; padding: 8px; 0px; color:black;">
                                        <i class="fa-duotone fa-solid fa-circle-check" style="color:green; padding-right: 6px;"></i>
                                        Transferring to Live ABL Agent, Please wait. Thanks
                                    </p>`;
                            }
                        }
                    
                        // Handle "Cancel" button
                        if (target.closest(".callAgent_cancel_btn")) {
                            const callAgentUI = target.closest("#call_agent_ui");
                            if (callAgentUI) {
                                callAgentUI.remove();
                            }
                        }
                    });
                    


                    const patchChatHistoryData = async () => {
                        posturl = "http://localhost:7000/api/add_chathistory";

                        let data = {
                            "userId" : user_id,
                            "userName": nameInput_authentication,
                            "userCnic": cnicInput_authentication,
                            "userSessionId": session_id,
                            "Question": Question,
                            "Answer": Answer,   
                        }                                             
                      
                        try {
                          let response = await fetch(posturl, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json"
                            },
                            body: JSON.stringify(data)
                          });
                      
                          if (!response.ok) {
                            throw new Error(`Error while processing Authentication Data with Status:  ${response.status}`);
                          }
                          result = await response.json();
                          console.log(result)
                           
            
                        } catch (error) {
                          console.error("Error while sending Authenication Post request:", error);
                        }
                      };
                      patchChatHistoryData();



                    abl_icon_msg.classList.remove("fa-stop")
                    abl_icon_msg.classList.add("fa-arrow-up")
                    streaming = false;
                    inputValue = "";
                }
                if (value) {
                    const text = decoder.decode(value, { stream: true });
                    handleStreamedData(text,outputDiv);
                }
            }
        } catch (error) {
            outputDiv.style.display = "none"
            abl_icon_msg.classList.remove("fa-stop")
            abl_icon_msg.classList.add("fa-arrow-up")
            streaming = false;
            inputValue = "";
            errorDiv = appendErrorMessage();
            errorDiv.style.display = "flex";
            errorDiv.innerHTML = "Error: "+ error; 
            console.error('Error:', error);
        }
    }
}