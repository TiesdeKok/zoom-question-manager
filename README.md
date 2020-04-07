<h1 align="center">
   <img src="https://i.imgur.com/tOv8anB.png" alt="Zoom Chat Manager" title="Zoom Chat Manager" />
</h1>
<p align="center">  
 <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-blue.svg"></a>

</p>

<p align="center">
  <strong>Zoom Question Manager</strong> is a Chrome Extension that provides a dashboard to manage questions aked in the Zoom chat. Primarily designed for teachers that are teaching online classes via Zoom.  <br> <br>
  <span><strong>Author:</strong> Ties de Kok (<a href="http://www.TiesdeKok.com">Personal Page</a>)</span><br>
  <span><strong>Chrome Extension: </strong><a href="https://chrome.google.com/webstore/detail/zoom-question-manager/babjamahlgjbgacemlagcpohencmghen ">Install Chrome Extension </a></span><br>
   <span><strong>Demo & Instructions: </strong><a href="https://youtu.be/7jJ8qsYlJoA">YouTube video</a></span><br>  

</p>

<h2>What does it do?</h2>

[![Demo](https://github.com/TiesdeKok/zoom-question-manager/blob/master/zqm.gif?raw=true)](https://youtu.be/7jJ8qsYlJoA)

* Provides a dashboard interface that sits on top of a Zoom web session. It does not communicate with any external sources, nor does it story any data. It only uses the information that is already exposed through the Chrome tab.   

* Students can ask questions by prepending their question with "!question" in the Zoom chat. You can manage these questions by highlighting them as answered and moving them to the history so that they are no longer on your screen.    

* Can be run on a second monitor or can be run on a second device (such as a spare laptop). Only requirement is internet connectivity + the ability to use Chrome extensions.    

* Also provides a microphone volume meter to monitor your audio levels. If you are using a tool such as ManyCam you can also show your webcam to monitor whether you are in frame.    

<h2>How to install it?</h2>  
<a href="https://youtu.be/7jJ8qsYlJoA">YouTube video</a>   <br>

1. Make sure you have the Chrome browser installed on your computer
2. Install my <b>Zoom Question Manager</b> from the Chrome Extension Store: <br><a href="https://chrome.google.com/webstore/detail/zoom-question-manager/babjamahlgjbgacemlagcpohencmghen ">Install Chrome Extension </a>
3. You should now see a "Z" icon in the top right in Chrome <br> --> you might have to click the 3 dots to see it

<h2>How to use it?</h2>

1. Start your zoom session as normal
2. Find your zoom session URL <br> --> click "invite" and then "copy url" in the bottom left corner. 
3. Create your Zoom web client URL by changing "/j/" to "/wc/" and add "/start" at the end. <br> <b>For example: </b><br>
URL copied: `https://server.zoom.us/j/1234567890`
Modify to:  `https://server.zoom.us/wc/1234567890/start`
4. Open up the Chrome browser and go to the new link your created in step 3.
5. Go through your normal login procedure, log in using the same account as the one you are using on your computer <br> --> yes, you can join the same meeting multiple times with one account
6. Once you've loaded into the actual zoom session using the link, don't click anything and click the Z icon in the top right corner. 
7. You should see the screen change and the (empty) question manager should pop, like the screenshot above. 

### **How do students ask questions?**

If a student starts their question with  `!question` it will show up in the question manager as a question. These questions you can highlight in green ("answered") or yellow ("todo"). You can also click on `archive` to hide the question, which will move it to the "archive" tab. 

**Note: archived questions only persist for as long as the tab is open. Once you refresh/close the page everything will reset to being empty. **

<h2 id="questions">Questions or Suggestions?</h2>

If you have questions / experience problems / or have suggestions please use the `issues` tab of this repository.   You can also e-mail me at tdekok [at] uw.edu .

<h2 id="license">License</h2>  

[MIT](LICENSE) - Ties de Kok - 2020

<h2 id="specialthanks">Special mentions</h2>

This project is inspired by and based on the excelent work of:  

- Volume-meter (https://github.com/cwilso/volume-meter/)

Contributors:  

