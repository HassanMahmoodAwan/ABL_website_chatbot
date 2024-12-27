window.onload = ()=>{
    let suggestion_data;
    const suggestedQuestions = {};
    let chat_id;
    let Question;
    let answer;

    // const suggestedQuestions = {
    //     "products info": [", does it offer online shopping?", " does it provide Virtual Debit Card?", ", What features it offers?", ", How to get out Account Statement."],
    //     "branch/atm details": [", How to find nearest branch?", ", How to find nearest ATM?", ", How to find nearest Cash Deposit Machine?"],
    //     "discounts": [", How to avail discounts?", ", How to avail discounts on Debit Card?", ", How to avail discounts on Credit Card?"],
    //     "security": [", How to secure my account?", ", How to secure my account from fraud?", ", How to secure my account from hacking?"],
    //     "finances": [", How to apply for loan?", ", How to apply for credit card?", ", How to apply for debit card?"],
    // }



    let sugGroupList = document.getElementById("suggestionsGroupList")
    async function getSuggestionGroupsEarly() {
        let group_url = "http://localhost:7000/api/get_alldata";
        try {
            response = await fetch(group_url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            suggestion_data = await response.json();
            suggestion_data.forEach((each) => {
                suggestedQuestions[each.category_name.toLowerCase()] = each.questions;

                // Create suggested group
                const divElement = document.createElement('div');
                divElement.className = "suggestion_group";
                divElement.innerHTML = `
                    <i class="${each.icon_theme}" style="color: ${each.color_theme};"></i>
                    ${each.category_name}`;
                sugGroupList.appendChild(divElement);
    
                // Attach click event listener to the group
                divElement.addEventListener("click", () => {
                    const msgText = each.category_name.trim();
                    inputField_startTemplate.value = msgText;
                    inputField_startTemplate.focus();
    
                    const questions = suggestedQuestions[msgText.toLowerCase()];
                    if (questions) {
                        sugGroupList.style.display = "none";
                        sugQuestionsElement.style.display = "flex";
    
                        sugQuestionsElement.innerHTML = ""; // Clear old suggestions
                        questions.forEach((question) => {
                            const questionDiv = document.createElement('div');
                            questionDiv.className = "suggestedQuestion";
                            // questionDiv.innerHTML = `<span style="font-weight:bold;">${msgText}</span>${question}`;
                            questionDiv.innerHTML = `${question}`;
                            sugQuestionsElement.appendChild(questionDiv);
    
                            // Question Click handler
                            questionDiv.addEventListener("click", () => {
                                const msgText = questionDiv.textContent.trim();
    
                                inputField_startTemplate.value = null;
                                inputValue = msgText
                                widgetStartTemplate.style.display = "none";
                                widget_mainTemplate.style.display = "block";
                                refresh_btn.style.display = "block";
    
                                sugGroupList.style.display = "flex";
                                sugQuestionsElement.style.display = "none";
                                sugQuestionsElement.innerHTML = ""; // Clear after sending
    
                                onSendingMsg();
                            });
                        });
                    } else {
                        console.log("No Questions Found");
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
        
        if (ablmuawin_widget.style.display == "none"){
            if (nameInput_authentication != "" && cnicInput_authentication != ""){
                ablmuawin_authentication_widget.style.visibility = "hidden"
                ablMuawin_authentication_widget.className = "";
                ablmuawin_widget.style.display = "flex";
            }
            else{
                ablMuawin_authentication_widget.style.visibility = "visible";}
        }
        ablMuawin_authentication_widget.className = "show"
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
            posturl = "http://localhost:7000/api/add_chathistory";
            let data = {
              userName: nameInput_authentication,
              user_cnic: cnicInput_authentication,
              chat_history: [
                {}
              ]
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
                throw new Error(`Error while processing Authentication Data with Status:  ${response.status}`);
              }
          
              result = await response.json();
              chat_id = result.id

            } catch (error) {
              console.error("Error while sending Authenication Post request:", error);
            }
          };
          postAuthenicationData();

                
        ablmuawin_authentication_widget.style.visibility = "hidden"
        ablMuawin_authentication_widget.className = "";
        ablmuawin_widget.style.display = "flex";
        
        cnicTag_authentication.value = ""
        nameTag_authentication.value = ""
    })
    // =================================================================



    // ***************** Starter Theme of ABL Muawin *******************

    inputField_startTemplate.addEventListener("input", (event)=>{
        inputValue = event.target.value;

        if (Object.keys(suggestedQuestions).includes(inputValue.toLowerCase())){
            sugGroupList.style.display =  "none"
            sugQuestionsElement.style.display = "flex"
            
            questions = suggestedQuestions[inputValue.toLowerCase()]
            questions.forEach((question)=>{
            divElement =  document.createElement('div')
            divElement.className = "suggestedQuestion"
            divElement.innerHTML = `<span style="font-weight:bold;">${inputValue}</span>${question}`
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
        if (window.innerWidth <= 900 && window.innerWidth >= 561){
            ablMuawin_expand_compress.style.display = "none"
            ablmuawin_widget.style.height = "79.2%";
            inputField_container.style.width = "89%";
            ablmuawin_widget.style.width = "500px";
            msgContainer.style.fontSize = "17px";
            ablMuawin_expand_compress.className = "fa-regular fa-square"
        }
        else if (window.innerWidth <= 560){
            inputField_container.style.width = "96%";
            sugGroupList.style.width = "92%"
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
            if (window.innerWidth < 980){
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


    

    ablmuawin_close.addEventListener("click", ()=>{
        ablmuawin_widget.className = "close";
        // ablmuawin_widget.style.display = 'none';
        ablmuawin_widget.addEventListener('transitionend', () => {
            ablmuawin_widget.style.display = 'none';
            ablmuawin_widget.className = "";

          });

    })
    

    
    // =========== ABL Muawin Refresh Chats ==========
    refresh_btn.addEventListener('click', () => {
        console.log("In the refreshbtn")
        const parentDiv = document.getElementById('ABLMuawin_body');
        
        const currentDiv = parentDiv.firstElementChild;
    
        parentDiv.innerHTML = "";
        console.log(currentDiv)
        if (currentDiv) {
          parentDiv.appendChild(currentDiv);
        }
        widgetStartTemplate.style.display = "flex"
        widget_mainTemplate.style.display = "none"
        refresh_btn.style.display = "none"

      });
    // ===============================================
    
    let inputValue = '';
    // =============== Dragable Message Handling =================
    const messages = document.querySelectorAll('.ablMuawin_defined_message');
    messages.forEach(message => {
      message.addEventListener('click', () => {
        console.log(`You clicked: ${message.textContent}`);
        inputValue = message.textContent; 
        if (abl_icon_msg.textContent == "send"){
            onSendingMsg()
        }
        // onSendingMsg()
      });
    });
    // ===========================================================
    


    // ============== MESSAGE ZOOM In and Out ===============
    
    let fSize = 17; 
    msgContainer.addEventListener('wheel', (event) => {
        if (event.ctrlKey || event.metaKey) {
            event.preventDefault(); // Prevent default zoom behavior

            console.log(event.deltaY)

            if (event.deltaY < 0 && fSize <= 33) {
                fSize += 2;
            } else if (event.deltaY > 0 && fSize > 13) {
                fSize -= 2;
            }
            console.log("fontSIze is this: ", fSize)

            // const userMessages = document.querySelectorAll('.ABLMuawin_userMsg');
            // const ResponseMessages = document.querySelectorAll('.ABLMuawin_responseMsg');

            // userMessages.forEach(message => {
            //     message.style.fontSize = `${fSize}px`;
            // });
            // ResponseMessages.forEach(message => {
            //     message.style.fontSize = `${fSize}px`;     
            // });
            msgContainer.style.fontSize = `${fSize}px`;

        }
    });

    // ======================================================


    ablmuawin_open = document.getElementById("ablmuawin_sideBtn")


    // ********** TRacking user Msg and sending it to backend ***********
    
    //let apiUrl = getStreamUrlFromFile('URL.txt')
    //console.log(apiUrl);
    
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
            console.log("steaming: "+ streaming);
            abl_icon_msg.classList.remove("fa-stop")
            abl_icon_msg.classList.add("fa-arrow-up")
        }
    })

    var chatHistory = [];

    function onSendingMsg(){
        if (inputValue == ""){
            return
        }
        Question = inputValue
        console.log(Question)

        inputField.value = null;
        abl_icon_msg.classList.remove("fa-arrow-up")
        abl_icon_msg.classList.add("fa-stop")
        // chatHistory["userInput"] = inputValue
        //chatHistory.push("user", inputValue)

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
        const textElement = document.createElement("div");
        textElement.className = 'ABLMuawin_responseMsg';
        // textElement.style.display = "none";
        textElement.innerHTML = `
        <div class="chatbot-message">
            <span class="wait-dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </span>
        </div>
        `;
    
        messageElement.appendChild(textElement);
    
        chatContainer.appendChild(messageElement);
    
        // Scroll to the bottom of the chat container
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return textElement;
    }

    function appendErrorMessage(sender, message) {
        const chatContainer = document.getElementById("ABLMuawin_body");
        const messageElement = document.createElement("div");
        messageElement.style.width = "100%"
        messageElement.style.display = "flex"
        messageElement.style.justifyContent = "start"
        const textElement = document.createElement("div");
        textElement.className = 'ABLMuawin_errorMsg';
        textElement.innerHTML = `
        <div class="chatbot-message">
            <span class="wait-dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </span>
        </div>
        `;
    
        messageElement.appendChild(textElement);
    
        chatContainer.appendChild(messageElement);
    
        // Scroll to the bottom of the chat container
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return textElement;
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

                    Answer = outputDiv.innerHTML

                    const patchChatHistoryData = async () => {
                        posturl = "http://localhost:7000/api/update_chathistory";

                        let data = [
                            {id: chat_id, userName: nameInput_authentication, user_cnic: cnicInput_authentication}, 
                            {question: Question, answer: Answer}
                        ]                                             
                      
                        try {
                          let response = await fetch(posturl, {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json"
                            },
                            body: JSON.stringify(data)
                          });
                      
                          if (!response.ok) {
                            throw new Error(`Error while processing Authentication Data with Status:  ${response.status}`);
                          }
                      
                        
                          
            
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