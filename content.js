// content.js

// State variables

var button_clicked = false;
var chatWindowObserver;
var observer;
var observerSmall;
var chatWindowOpen = false;
var most_recent_chat_box;
var currentOwner = '';
var receivedQuestions = [];
var receivedChats = [];

function startObservers(){
    // Close any running observers
    try {observer.disconnect();} catch (e){}

    // (re-)start main chat observer
    observer = new MutationObserver(callback);
    var targetNode = document.getElementsByClassName('chat-content__chat-scrollbar')[0];
    observer.observe(targetNode, { childList: true, subtree: true});

    // Restart the observer for small changes if existing
    try {
        try {observerSmall.disconnect();} catch (e){}
        // Get the most recent chat element (refresh link)
        var all_chat_boxes = document.getElementsByClassName('chat-content__chat-scrollbar')[0].getElementsByClassName('ReactVirtualized__Grid__innerScrollContainer');
        most_recent_chat_box = all_chat_boxes[all_chat_boxes.length - 1];

        //debugger;

        // (re-) start small chat observer
        observerSmall = new MutationObserver(callbackSmall);
        var chat_elements = most_recent_chat_box.getElementsByClassName('chat-item__chat-info-msg');
        var text_element_to_track = chat_elements[chat_elements.length-1];
        observerSmall.observe(text_element_to_track , {characterData: true, attributes: false, childList: true, subtree: true });
    } catch (e){
        //console.log(e)
    }
}

// Wait for extension button to be clicked and then load up the web-app
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
        if (!button_clicked) {
            button_clicked = true;
            console.log('Zoom question helper extension loaded!')

            // Modify body and insert the web-app HTML
            $('body').prepend('<div id="extWrapper"></div>')
            $('div.main').appendTo('#extWrapper')
            var jq_path = chrome.runtime.getURL('/jquery-3.4.1.js');
            var popper_path = chrome.runtime.getURL('/popper.min.js');
            var bootstrap_path = chrome.runtime.getURL('/bootstrap.min.js');
            var bootstrap_css_path = chrome.runtime.getURL('/bootstrap.min.css');

            var s = document.createElement("script");
            s.type = "text/javascript";
            s.src = jq_path;
            $("#extWrapper").append(s);

            setTimeout(function(){
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.src = popper_path;
                $("#extWrapper").append(s);
    
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.src = bootstrap_path;
                $("#extWrapper").append(s);
    
                var s = document.createElement("link");
                s.rel = "stylesheet";
                s.src = bootstrap_css_path;
                $("#extWrapper").append(s);
                setTimeout(function(){
                    $.get(chrome.runtime.getURL('/viewerWindow.html'), function(data) {
                        $(data).prependTo('#extWrapper');
                    });
                }, 500)
            }, 1000)


            // Close the overlay window 
            try {$('.close-jd.tab-button').click();} catch (e) {}

            // Disable video receiving to boost performance
            try {$("a[aria-label='Disable video receiving'")[0].click();} catch (e) {}

            // Start observer to check whether the chat window closes
            chatWindowObserver = new MutationObserver(chatWindowCallback);
            var targetWindow = document.getElementById('wc-content');
            chatWindowObserver.observe(targetWindow, { childList: true, subtree: true});

            // First time open chat window if nescessary
            if (document.getElementsByClassName('chat-content__chat-scrollbar').length == 0) {
                $('.footer-button__chat-icon').click();
            } else {}

            // Start chat message observers
            startObservers();

            // Hide Zoom window to reveal web-app
            $('div#extWrapper > div.main').hide();

            // Re-enable scrolling
            $("body").css({ 'overflow' : 'scroll'});
            }
        }   
    });

// Logic 

function minutes_with_leading_zeros(dt) 
{ 
  return (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes();
}

function processChat(owner, raw_qText) {
    var currentdate = new Date(); 
    var timestring =  currentdate.getHours() + ":"  + minutes_with_leading_zeros(currentdate);
    var qItems = raw_qText.split(' ')
    if (qItems[0] == '!question') {
        var msg_to_send = qItems.slice(1,).join(' ');
        if (!receivedQuestions.includes(owner + '_' + msg_to_send)) {
            inputQuestion(timestring, owner, msg_to_send)
        }
    } else {
        if (!receivedChats.includes(owner + '_' + raw_qText)) {
            inputChat(timestring, owner, raw_qText)
        }
    }
}

function inputQuestion(time, owner, qText) {
    if (qText.length > 0) {
        var template = $('#q-template').html();
        var new_q = $('<div class="card question-element"></div>')
        var new_q_filled = new_q.append(template);
        new_q_filled.find('.q-time').html(time);
        new_q_filled.find('.q-owner').html(owner)
        new_q_filled.find('.card-text').html(qText)
        $('#current-questions').prepend(new_q_filled)

        // Add to list of received messages to avoid duplicates
        receivedQuestions.push(owner + '_' + qText);

        // Make sure the list doesn't explode to avoid performance issues
        if (receivedQuestions.length > 20) {
            receivedQuestions.shift();
        }
    }
}

function inputChat(time, owner, qText) {
    if (qText.length > 0) {
        var template = $('#chat-template').html();
        var new_q = $('<div class="card chat-element"></div>')
        var new_q_filled = new_q.append(template);
        new_q_filled.find('.q-time').html(time);
        new_q_filled.find('.q-owner').html(owner)
        new_q_filled.find('.card-text').html(qText)
        $('#current-chat').prepend(new_q_filled)
    
        if ($('#current-chat > .chat-element').length > 10) {
            $('#current-chat > .chat-element').last().remove();
        }
        // Add to list of received messages to avoid duplicates
        receivedChats.push(owner + '_' + qText);

        // Make sure the list doesn't explode to avoid performance issues
        if (receivedChats.length > 20) {
            receivedChats.shift();
        }
    }
}


function chatWindowCallback(records){
    // Usually the video overlay will pop up, so hide if nescessary
    try {$('.video-in-sharing-container').hide()} catch (e){}

    // Empty the screen sharing element to improve performance
    try {$('.sharee-container__viewport').empty()} catch (e){}

    // Make sure the chat window and observers remain functional
    if (document.getElementsByClassName('chat-content__chat-scrollbar').length == 1) {
        if (!chatWindowOpen) {
            console.log('Chat opened - (re-)starting observers.')
            chatWindowOpen = true
            startObservers()
        } else {}
    } else {
        console.log('Chat window not open (or no longer open), opening chat window.')
        chatWindowOpen = false
        $('.footer-button__chat-icon').click();
    }  
}

function callback(records) {
    records.forEach(function (record) {
      var list = record.addedNodes;
      var i = list.length - 1;
      
      for ( ; i > -1; i-- ) {
        if (list[i].nodeName === 'DIV') {
            //console.log('A new message found.')
            most_recent_chat_box = list[i];
            most_recent_cb_jq = $(most_recent_chat_box);
            var chat_message = most_recent_cb_jq.find('.chat-item__chat-info-msg').html();
            var owner = most_recent_chat_box.querySelectorAll('span[role="presentation"]')[0].textContent
            processChat(owner, chat_message);
            currentOwner = owner;
            try {observerSmall.disconnect();} catch (e){}
            observerSmall = new MutationObserver(callbackSmall);
            var text_element_to_track = most_recent_chat_box.getElementsByClassName('chat-item__chat-info-msg')[0];
            observerSmall.observe(text_element_to_track , {characterData: true, attributes: false, childList: true, subtree: true });
        }
      }
    });
  }

function callbackSmall(records) {
    //console.log('A continuation message found.')
    records.forEach(function (record) {
        var new_chat_message = record.target.textContent.split('\n').slice(-1)[0];
        processChat(currentOwner, new_chat_message);
    });
  }