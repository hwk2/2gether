

var LiveChat = {};

(function(liveChat) {
    liveChat.username = null;
    liveChat.pubNub = null;
    liveChat.users = [];
    liveChat.channelName = "Lobby";
    liveChat.backgroundColorNum = 0;
    liveChat.getUser = function(theUsername){
        
      for (var i = 0; i<liveChat.users.length; i++){
            var aUser = liveChat.users[i];
            if (aUser.username == theUsername){
                return aUser;
            }
        }
        return null;
    }
    
    liveChat.onWindowClose = function(){
        console.log("got window close");
        liveChat.pubNub.unsubscribe({
            channels: [liveChat.channelName]
        })
    }
    liveChat.changeChannelName = function(){
        var customChannelName = prompt("Enter the channel ID");
        liveChat.pubNub.unsubscribe({
            channels: [liveChat.channelName]
        })
        //liveChat.pubNub. unsubscribeAll ();
        liveChat.pubNub.subscribe({
            channels: [customChannelName],
        });
        liveChat.channelName = customChannelName;
        $("#channelName").text(customChannelName);

    }
    
    liveChat.addUser = function(theUsername){
        var aUser = {};
        aUser.username = theUsername;
        liveChat.users.push(aUser);
        return aUser;
    }
    
    liveChat.hookupInputField = function(){
        
        $("#typingBox").on('keyup',function(e){
            handleTyping(e);
        });
         $("#typingBox").on('keydown',function(e){
           var isReturn = e && e.keyCode==13;
           if (isReturn)
               handleTyping(e);
            return !isReturn;
        });
        // onkeyup="copyLetter();"    
    }
    
    liveChat.onPageLoad = function(){
        liveChat.hookupInputField();
       //  liveChat.setupPubNub();
      //  liveChat.setupPubNub();
        $("#channelName").text(liveChat.channelName);
        
         // Get a reference to the canvas object
		//var canvas = document.getElementById('paperCanvas');
		// Create an empty project and a view for the canvas:
		// paper.setup(canvas);
        
        var backgroundCanvas = document.getElementById('backgroundCanvas');
		// Create an empty project and a view for the canvas:
		paper.setup(backgroundCanvas);
        paper.setup(backgroundCanvas);
        //liveChat.runChainEffect();
       // liveChat.runCandyCrushEffect();
}
    
    liveChat.runBlankEffect = function(){
       var s = document.getElementById('blankEffect');
        var aCode = s.text;
        liveChat.clearPaperProject();
        paper.execute(aCode,paper);
        
    }
    
    liveChat.runChainEffect = function(){
        var s = document.getElementById('chainEffect');
        var aCode = s.text;
        liveChat.clearPaperProject();
        paper.execute(aCode,paper);
        
    }
    
     liveChat.runTadpoleEffect = function(){
       var s = document.getElementById('tadpoleEffect');
        var aCode = s.text;
         liveChat.clearPaperProject();
        paper.execute(aCode,paper);
    }
    liveChat.runRainbowEffect = function(){
        var s = document.getElementById('rainbowEffect');
        var aCode = s.text;
        liveChat.clearPaperProject();
        paper.execute(aCode,paper);
    }
    
    liveChat.runBallsEffect = function(){
       var s = document.getElementById('ballsEffect');
        var aCode = s.text;
         liveChat.clearPaperProject();
        paper.execute(aCode,paper);
    }
    
    liveChat.runRippleEffect = function(){
       var s = document.getElementById('rippleEffect');
        var aCode = s.text;
         liveChat.clearPaperProject();
        paper.execute(aCode,paper);
    }
    liveChat.runSpinEffect = function(){
       var s = document.getElementById('spinEffect');
        var aCode = s.text;
         liveChat.clearPaperProject();
        paper.execute(aCode,paper);
    }
    
    liveChat.clearPaperProject = function(){
        if (!paper.projects) return;
        $.each(paper.projects,function(i,theProject){
        	if (theProject) {
        		theProject.clear();
            }
        })
        while(paper.projects.length>1){
            paper.projects[0].remove();   
        }
        paper.projects[0].activate();
    }
    
     liveChat.runCandyCrushEffect = function(){
        var s = document.getElementById('candyCrushEffect');
        var aCode = s.text;
        liveChat.clearPaperProject();
        paper.execute(aCode,paper);
    }
     
    liveChat.setupBackgroundEffect = function(){
        var s = document.getElementById('candyCrushEffect');
        var aCode = s.text;
        
    }
    
    liveChat.resetTypingField = function(){
        console.log("reset typing field");
        document.getElementById('typingBox').value='';
    }
    
    liveChat.enterUsername = function(){
       liveChat.username = prompt("Enter your username");
        $("#username").html(liveChat.username);
    }
    
    liveChat.changeBackgroundColor = function(){
        liveChat.backgroundColorNum = liveChat.backgroundColorNum+0.5;
        if(Number.isInteger(liveChat.backgroundColorNum) == false){
            $('#outputArea').css({'background-color':'black'});
            $('#typingDiv').css({'background-color':'black'});
        }
        else{
            $('#outputArea').css({'background-color':"#02B5C8"});
            $('#typingDiv').css({'background-color':"#02B5C8"});
        }
        
    }
        
    function handleTyping(e){
        var typedMessage = $("#typingBox").val();
        // if (!typedMessage || !typedMessage.length) return;
        
        var isReturn = e && e.keyCode==13;
        var mess = ""+typedMessage; 
        if (liveChat.isCommand(mess)){
            if(isReturn) {
                liveChat.publishMessage(mess);
                liveChat.handleEffect(mess);
                liveChat.changeChannelViaMessage(mess);
                liveChat.help(mess);
                liveChat.backgroundHelp(mess);
                liveChat.resetTypingField();
            }
            return;
        }
        else if (!liveChat.username && typedMessage !== "/help"){
            if(isReturn) {
                liveChat.username = typedMessage;
                liveChat.setupPubNub();
                $("#username").html(liveChat.username);
                $("#typingBox").attr("placeholder",'Enter your message');
                liveChat.resetTypingField();
                return;
            }
            return;
           //  liveChat.enterUsername();
        }
        else if (typedMessage == "/help"){
            liveChat.help();
        }
        else {
            liveChat.publishMessage(mess);
            if (isReturn){
                liveChat.resetTypingField();
            }
        }
    }
    
    liveChat.changeChannelViaMessage = function(aTypedMessage){
        if (aTypedMessage.slice(0, 9) == "/channel "){
            var newChannelName = aTypedMessage.substring(9);
            liveChat.pubNub.unsubscribe({
                channels: [liveChat.channelName]
            })
            //liveChat.pubNub. unsubscribeAll ();
            liveChat.pubNub.subscribe({
                channels: [newChannelName],
            });
            liveChat.channelName = newChannelName;
            $("#channelName").text(newChannelName);
            liveChat.runBlankEffect();
            
        }
    }
    
    liveChat.help = function(aTypedMessage){
        if (aTypedMessage == "/help"){
            alert('Welcome to 2gether, a live chatting app. As you type, other users in your channel see the letters you type as you type them!');
            alert('To switch the theme, toggle the switch in the top right hand corner.');
            alert('You can send images, gifs, links, and videos by pasting the URL in the text box below.');
            alert('To see a list of wallpapers for your channel, type /wp');
            alert('The channel you are currently in is displayed at the top of the screen. To change to a different channel, type /channel (channel name).');
        }
    }
    
    liveChat.backgroundHelp = function(aTypedMessage){
        if (aTypedMessage == "/wp" ){
            alert('To change the background of your channel, type /wp [wallpaper type]. The wallpaper types are candy, tadpoles, rainbow, balls, spin, and crazy. To change the wallpaper color, type /wp [color]. To clear the wallpaper, type /wallpaper clear');
        }
    }
    
    
    liveChat.isCommand = function(theMsg){
       return theMsg && theMsg.length >0 && theMsg[0] == "/";
    }
    
    liveChat.handleSentMessage = function(theMsg){
        
       //  $("#otherUsername").html(theMsg.username);

        var aTypedMessage = theMsg.text;
         if (liveChat.isCommand(aTypedMessage)){
             liveChat.handleEffect(aTypedMessage);
            return;

        }

        liveChat.handleUserMessage(theMsg);
    }
    
   
    liveChat.handleEffect = function(theTypedMessage){
        aTypedMessage = theTypedMessage;

        if (aTypedMessage == "/wp clear"){
            liveChat.runBlankEffect();
        }
        if (aTypedMessage == "/wp candy"){
            liveChat.runCandyCrushEffect();
        }
        else if (aTypedMessage == "/wp tadpoles"){
            liveChat.runTadpoleEffect();
        }
        else if (aTypedMessage == "/wp rainbow"){
            liveChat.runRainbowEffect();
        }
        
        else if (aTypedMessage == "/wp balls"){
            liveChat.runBallsEffect();
        }
        
        else if (aTypedMessage == "/wp crazy"){
            liveChat.runRippleEffect();
        }
        else if (aTypedMessage == "/wp spin"){
            liveChat.runSpinEffect();
        }
        else if (aTypedMessage == "/wp blue"){
            liveChat.runBlankEffect();
            $('#outputArea').css({'background-color':'#02B5C8'});
            $('#typingDiv').css({'background-color':'#02B5C8'});
        }
        else if (aTypedMessage == "/wp red"){
            liveChat.runBlankEffect();
            $('#outputArea').css({'background-color':'#E72D63'});
            $('#typingDiv').css({'background-color':'#E72D63'});
        }
        else if (aTypedMessage == "/wp yellow"){
            liveChat.runBlankEffect();
            $('#outputArea').css({'background-color':'#FEEB15'});
            $('#typingDiv').css({'background-color':'#FEEB15'});
        }
        else if (aTypedMessage == "/wp black"){
            liveChat.runBlankEffect();
            $('#outputArea').css({'background-color':'black'});
            $('#typingDiv').css({'background-color':'black'});
        }
        else if (aTypedMessage == "/wp white"){
            liveChat.runBlankEffect();
            $('#outputArea').css({'background-color':'#FFF'});
            $('#typingDiv').css({'background-color':'#FFF'});
        }
        else if (aTypedMessage == "/wp purple"){
            liveChat.runBlankEffect();
            $('#outputArea').css({'background-color':'purple'});
            $('#typingDiv').css({'background-color':'purple'});
        }
        else if (aTypedMessage == "/wp orange"){
            liveChat.runBlankEffect();
            $('#outputArea').css({'background-color':'orange'});
            $('#typingDiv').css({'background-color':'orange'});
        }
        else if (aTypedMessage == "/wp green"){
            liveChat.runBlankEffect();
            $('#outputArea').css({'background-color':'green'});
            $('#typingDiv').css({'background-color':'green'});
        }
        else if (aTypedMessage == "/wp cyan"){
            liveChat.runBlankEffect();
            $('#outputArea').css({'background-color':'cyan'});
            $('#typingDiv').css({'background-color':'cyan'});
        }
        else if (aTypedMessage == "/wp indigo"){
            liveChat.runBlankEffect();
            $('#outputArea').css({'background-color':'indigo'});
            $('#typingDiv').css({'background-color':'indigo'});
        }
        else if (aTypedMessage == "/wp violet"){
            liveChat.runBlankEffect();
            $('#outputArea').css({'background-color':'violet'});
            $('#typingDiv').css({'background-color':'violet'});
        }
        else if (aTypedMessage == "/wp pink"){
            liveChat.runBlankEffect();
            $('#outputArea').css({'background-color':'pink'});
            $('#typingDiv').css({'background-color':'pink'});
        }
        else if (aTypedMessage == "/wp brown"){
            liveChat.runBlankEffect();
            $('#outputArea').css({'background-color':'#8B4513'});
            $('#typingDiv').css({'background-color':'#8B4513'});
        }
        else if (aTypedMessage == "/wp grey" || aTypedMessage == "/wp gray"){
            liveChat.runBlankEffect();
            $('#outputArea').css({'background-color':'grey'});
            $('#typingDiv').css({'background-color':'grey'});
        }
        else if (aTypedMessage == "/wp peach"){
            liveChat.runBlankEffect();
            $('#outputArea').css({'background-color':'#FFDAB9'});
            $('#typingDiv').css({'background-color':'#FFDAB9'});
        }
        else if (aTypedMessage == "/wp turquoise"){
            liveChat.runBlankEffect();
            $('#outputArea').css({'background-color':'#00CED1'});
            $('#typingDiv').css({'background-color':'#00CED1'});
        }
        else if (aTypedMessage == "/wp dark blue" || aTypedMessage == "/wp darkblue" || aTypedMessage == "/wp dark-blue"){
            liveChat.runBlankEffect();
            $('#outputArea').css({'background-color':'#00008B'});
            $('#typingDiv').css({'background-color':'#00008B'});
        }
        else if (aTypedMessage == "/wp light blue" || aTypedMessage == "/wp lightblue" || aTypedMessage == "/wp light-blue"){
            liveChat.runBlankEffect();
            $('#outputArea').css({'background-color':'#00008B'});
            $('#typingDiv').css({'background-color':'#00008B'});
        }
        
        
        
        
        
             
    }
    
    
    liveChat.getSafeString = function(s){
        return s.replace(/[ .,\/#!$%\^&\*;:{}=\-`~()<>@]/g,"_");  
    }
    liveChat.handleUserMessage = function(theMsg){
        var senderUsername =(theMsg.username );
        var aSafeName = liveChat.getSafeString(senderUsername);
        var aUserOutputDiv = $("#"+aSafeName);
        if (!aUserOutputDiv.length){
            $('#welcomeText').css({'display':'none'});
            var aUserOutputDiv = $("<div class='UserOutput' id='"+aSafeName+"'></div>");
            $(aUserOutputDiv).append("<img class='UserIcon' src='./userIcon.png'>");
            $(aUserOutputDiv).append("<div class='Username'>"+senderUsername+"</div>");
            $(aUserOutputDiv).append("<div class='TextOutput'></div></div>");
            
            $(".OutputArea").append(aUserOutputDiv);
            aUserOutputDiv = $("#"+senderUsername);
            
        }
        var aTypedMessage = theMsg.text;
        if (liveChat.isURL(aTypedMessage)){
           if(liveChat.isImage(aTypedMessage))
                liveChat.handleImage(aTypedMessage, aUserOutputDiv);
            else if (liveChat.isYTVid(aTypedMessage))
                liveChat.handleYTVid(aTypedMessage,aUserOutputDiv);
            else 
                liveChat.handleLink(aTypedMessage,aUserOutputDiv);
        }
        else 
            $(aUserOutputDiv).find(".TextOutput").html(aTypedMessage);
        if (theMsg.color){
            $(aUserOutputDiv).find(".TextOutput").css('color',theMsg.color);
        }
        
    }
    
     liveChat.isImage = function(aTypedMessage){
        var jpg = aTypedMessage.endsWith(".jpg");
        var jpeg = aTypedMessage.endsWith(".jpeg");
        var png = aTypedMessage.endsWith(".png");
         var gif = aTypedMessage.endsWith(".gif");
         return (jpg || jpeg || png || gif);
     }
     
     liveChat.isYTVid = function(aTypedMessage){
         return aTypedMessage.indexOf('youtube.com/')>=0;
     }
     
    liveChat.handleImage = function(aTypedMessage, aUserOutputDiv){
        var anImgEl = $("<img src='"+aTypedMessage+"'>");
        $(aUserOutputDiv).find(".TextOutput").html(anImgEl);
    }
    liveChat.handleLink = function(aTypedMessage, aUserOutputDiv){
        var anImgEl = $("<a target='_blank' href='"+aTypedMessage+"'>"+aTypedMessage+"</a>");
        $(aUserOutputDiv).find(".TextOutput").html(anImgEl);
    }
    liveChat.handleYTVid = function(aTypedMessage, aUserOutputDiv){
        var video_id =  aTypedMessage.split('v=')[1];
        var ampersandPosition = video_id.indexOf('&');
        if(ampersandPosition != -1) {
          video_id = video_id.substring(0, ampersandPosition);
        }
        var anEmbedURL = "https://www.youtube.com/embed/"+video_id;
        var anImgEl = $("<iframe width='500' height='315' src='"+anEmbedURL+"' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>");
        $(aUserOutputDiv).find(".TextOutput").html(anImgEl);
    }
    
    
    
    liveChat.isURL = function(str){
        if(str.indexOf('http://')==0 || str.indexOf('https://')==0){
            return true;
        }
        else{
            return false;
        }
    }
    
    liveChat.userLeft = function(aUsername){
        var aSafeName = liveChat.getSafeString(aUsername);
        var aUserOutputDiv = $("#"+aSafeName);
         $(aUserOutputDiv).find(".TextOutput").html("Just left");
        window.setTimeout(function(){
            $(aUserOutputDiv).hide();
        },5000);
    }
    
    
    function subscribe(){
        liveChat.pubNub.subscribe({
            channels: [liveChat.channelName],
            withPresence: true
        });    
        
        liveChat.pubNub.addListener({   
            message: function(m) {
                // handle message
                var actualChannel = m.actualChannel;
                var channelName = m.channel; // The channel for which the message belongs
                var msg = m.message; // The Payload
                if (m.channel != liveChat.channelName){
                    return;
                }
                if (msg.username == liveChat.username){
                    console.log('this is your own message: ')
                     return;
                 }
                
                
                liveChat.handleSentMessage(msg);
                
                
                //$("#talkingWith").html(msg.username);
                var publisher = m.publisher;
                var subscribedChannel = m.subscribedChannel;
                var channelGroup = m.subscriptions; // The channel group or wildcard subscription match (if exists)
                var pubTT = m.timetoken; // Publish timetoken        
            },
            presence: function(p) {
                // handle presence
                var presence = p.withPresence;
                var action = p.action; // Can be join, leave, state-change or timeout
                var channelName = p.channel; // The channel for which the message belongs
                var aUsername = p.uuid.replace(/-=-.*/,'');
                console.log("got presence vent: " + action  + " " + channelName + " " + aUsername);
                var anAction = action;
                if (aUsername == liveChat.username){
                    return;   
                }
                if (anAction == "leave" || anAction == "timeout"){
                    liveChat.userLeft(aUsername);
                    return;
                }
                else if (anAction == 'join')
                    anAction = "Just joined";
                
                var aMsg = { username: aUsername,
                    text: anAction,
                    color: "green"
                };
                liveChat.handleUserMessage(aMsg)
                var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
                var presenceEventTime = p.timestamp; // Presence event timetoken
                var status = p.status; // 200
                var message = p.message; // OK
                var service = p.service; // service
                var uuids = p.uuids;  // UUIDs of users who are connected with the channel with their state
                var occupancy = p.occupancy; // No. of users connected with the channel
            },
            status: function(s) {
                // handle status
                var category = s.category; // PNConnectedCategory
                var operation = s.operation; // PNSubscribeOperation
                var affectedChannels = s.affectedChannels; // The channels affected in the operation, of type array.
                var subscribedChannels = s.subscribedChannels; // All the current subscribed channels, of type array.
                var affectedChannelGroups = s.affectedChannelGroups; // The channel groups affected in the operation, of type array.
                var lastTimetoken = s.lastTimetoken; // The last timetoken used in the subscribe request, of type long.
                var currentTimetoken = s.currentTimetoken; // The current timetoken fetched in the subscribe response, which is going to be used in the next request, of type long.
            }
        });
        
    }
    
    liveChat.publishMessage = function(m){
        liveChat.pubNub.publish(
            {
                message: { 
                    text: m,
                    username: liveChat.username
                },
                channel: liveChat.channelName,
                
                sendByPost: false, // true to send via post
                storeInHistory: false, //override default storage options
            }, 
            function (status, response) {
                if (status.error) {
                    // handle error
                    console.log(status)
                } else {
                    console.log("message Published w/ timetoken", response.timetoken)
                }
            }
        );
        
    }
    
    liveChat.setupPubNub = function(){
        liveChat.pubNub = new PubNub({
            subscribeKey: 'sub-c-b1ae2dd8-dadf-11e7-a9ef-2291f454b5f8', // always required
            publishKey: 'pub-c-7d396c29-33d8-44e8-ad08-dc61694ca9cc', // only required if publishing
            uuid: liveChat.username + "-=-"+new Date()
        });
        subscribe();
       
        $(window).on('beforeunload', function(){
            liveChat.onWindowClose();
     });
        
    }
    
   
}(LiveChat));