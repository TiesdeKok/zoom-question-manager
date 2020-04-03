// content.js

var button_clicked = false;
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
        if (!button_clicked) {
            button_clicked = true;
            console.log('Zoom helper loaded!')
            $('body').prepend('<div id="extWrapper"></div>')
            $('div.main').appendTo('#extWrapper')
            $.get(chrome.runtime.getURL('/viewerWindow.html'), function(data) {
                $(data).prependTo('#extWrapper');
            });
            var chat_open = false;
            while (!chat_open) {
                if (document.getElementsByClassName('chat-content__chat-scrollbar').length == 0) {
                    $('.footer-button__chat-icon').click();
                } else {
                    chat_open = true;
                    var observer = new MutationObserver(callback);
                    var targetNode = document.getElementsByClassName('chat-content__chat-scrollbar')[0];
                    observer.observe(targetNode, { childList: true, subtree: true});
                    $('div#extWrapper > div.main').hide();
                }
            }
        }
    }
    }
    );

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
        inputQuestion(timestring, owner, qItems.slice(1,).join(' '))
    } else {
        inputChat(timestring, owner, raw_qText)
    }

}

function inputQuestion(time, owner, qText) {
    var template = $('#q-template').html();
    var new_q = $('<div class="card question-element"></div>')
    var new_q_filled = new_q.append(template);
    new_q_filled.find('.q-time').html(time);
    new_q_filled.find('.q-owner').html(owner)
    new_q_filled.find('.card-text').html(qText)
    $('#current-questions').prepend(new_q_filled)
}

function inputChat(time, owner, qText) {
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
}

var most_recent_chat_box;
var observerSmall;
var currentOwner = '';

function callback(records) {
    records.forEach(function (record) {
      var list = record.addedNodes;
      var i = list.length - 1;
      
      for ( ; i > -1; i-- ) {
        if (list[i].nodeName === 'DIV') {
            console.log('Big change found')
            most_recent_chat_box = list[i];
            most_recent_cb_jq = $(most_recent_chat_box);
            var chat_message = most_recent_cb_jq.find('.chat-item__chat-info-msg').html();
            var owner = most_recent_chat_box.querySelectorAll('[role="presentation"]')[1].innerHTML;
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
    console.log('small triggered')
    records.forEach(function (record) {
        var new_chat_message = record.target.textContent.split('\n').slice(-1)[0];
        processChat(currentOwner, new_chat_message);
    });
  }