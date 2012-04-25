$(document).ready(function(){

        function Screen(windowName) {
            var windowTemplate = '<div class="window"><div class="handle"><button class="close"></button><button class="minimize"></button><span class="title">{{title}}</span></div><div class="content"><div class="contentinner clearfix">{{content}}</div></div></div>'.replace(/{{title}}/, windowName );
              $.ajax({
                url: "windows/" + windowName + ".html",
                success: function (data) { var newTemplate = windowTemplate.replace(/{{content}}/, data); },
                dataType: 'html'
              });
              $(newTemplate).appendTo('body');
        }

        //var something = new Screen("connector");

        // Automatically sets proper height for the window.
        setWindowHeight($('.window'));

        $( ".window" ).draggable({ stack: ".window",
                          handle: ".handle", containment: 'body' })
                      .resizable({handles: "all", snap: true, minHeight: 400, 
                          minWidth: 300, stack: "window", resize: function() {
                          setWindowHeight(this); } // Refreshes window height
                      });

        // Close button functionality
        $( "button.close" ).on("click", function() {
          $(this).closest(".window").hide();
        })
      

        // Dynamically refresh a window's height
        function setWindowHeight(elem) {
            $this = $(elem);
            content = $this.find('.contentinner'); // Content wrapper
            windowHeight = $this.height();
            contentHeight = windowHeight - 20; // Height - handle bar
            bounceWidth = content.width() - 105; // Width of bounce route (minus connect button)

            content.css("height", contentHeight); // Set content height
            content.find('.route').css('width', bounceWidth); // Set bounceroute width


            // Handles window/module resizing based on the state of the window.
            mapHeight = contentHeight - 34 - 15;

            if ($this.hasClass("disconnected")) {
              content.find('.map').css('height', mapHeight).siblings('.browser').css('height', mapHeight);
            } else {             
              content.find('.browser').css('height', mapHeight);
            }
         }

        // Connect button clicks
        $('button.connect').on("click", function() {
            var $this = $(this);

            openWindow = $(this).closest(".window");

            /***** CONNECT BUTTON ******/
            

            var route = openWindow.find('.bounces');
            var bounces = route.children();
            var bounceArray = [];
            var currentBounceIndex = 0;


            /* Queue connection animations for bounce route */

            bounces.each(function() {
              bounceArray.push(this); 
            });

                function connectBounce() { 
                  var currentBounce = bounceArray[currentBounceIndex];

                  onConnect(currentBounce);

                  currentBounceIndex++;
                  if (currentBounceIndex < bounceArray.length) {
                    setTimeout(connectBounce, 400);
                  } else {

                    setTimeout(moveRouteUp, 800);
                  }
                };

                function disconnectBounce(start) {
                  if (start) {
                    currentBounceIndex = bounceArray.length-1;
                  }
                  var currentBounce = $(bounceArray[currentBounceIndex]);
                  

                  if (!currentBounce.hasClass("you")) {
                    currentBounce.fadeOut();
                  } else { currentBounce.css("background", "white"); }
                  

                  currentBounceIndex--;
                  console.log(currentBounceIndex);
                  if (currentBounceIndex > 0) {
                    setTimeout(disconnectBounce, 100);
                  } else {
                    setTimeout(moveRouteDown, 100);
                  }
                }

                function moveRouteDown() {
                  setTimeout(toggleButton, 300);
                  contentWindow = $this.closest(".contentinner");

                  $this.closest(".window").switchClass("connected", "disconnected", 2000).find('.title').text("CONNECTOR");

                  // move route up
                  contentWindow.animate({
                  marginTop: "+=" + (contentWindow.find('.map').height() + 5) }, 1000, "easeOutExpo");

                  contentWindow.find('.destServer').animate({boxShadow: "0 0 2px #fff"});
                }

                function moveRouteUp() {
                  setTimeout(toggleButton, 300);
                  contentWindow = $this.closest(".contentinner");

                  $this.closest(".window").switchClass("disconnected", "connected", 2000).find('.title').text("BROWSER");

                  // move route up
                  contentWindow.animate({
                  marginTop: "-=" + (contentWindow.find('.map').height() + 5) }, 1000, "easeInOutExpo");

                  contentWindow.find('.destServer').animate({boxShadow: "0 0 2px #fff"});
                }

                function toggleButton() {
                  if ($this.hasClass("connect")) {
                    $this.switchClass("connect", "disconnect").text("DISCONNECT");
                    $this.animate({boxShadow: "0 5px 0 #95000A"}, {queue: false, duration: 100});
                  } else {
                    $this.switchClass("disconnect", "connect").text("CONNECT");
                    $this.animate({boxShadow: "0 5px 0 #1B9133"}, {queue: false, duration: 100});
                  }
                  
                  
                }
            if (openWindow.hasClass("disconnected")) { 
              connectBounce();
            /***** DISCONNECT BUTTON ******/
            } else {
              //openWindow.fadeOut();
              disconnectBounce(true);
            }
      
        });


        /* DOCK functionality */

        $('.connectoricon').on("click", function() {
          $('.window').fadeIn();
          //loadWindow("connector");
        });

        function onConnect(elem) {
          $this = $(elem);
          if ($this.hasClass("arrow")) {
              $this.css("color", "#3fd92f");
            } else if ($this.hasClass("you")) {
              $this.css("background", "#C4F1B4");
            } else {
                $this.css("background", "#3fd92f");
                if (!$this.hasClass("destServer")) {
                  $this.animate({width: "23px", textIndent: "-9999px"});
                } else { 
                  $this.animate({boxShadow: "0 0 60px #3fd92f"}, 1200);
                }
            }
        }
        


        function loadWindow(window) {
           var newWindow = $("<div>").addClass("window").addClass("disconnected").hide().appendTo('body');
           var handle = $("<div class='handle'>").appendTo(newWindow);
           handle.append("<button class='close'>").append("<button class='minimize'>");
           $("<span class='title'>").text(window).appendTo(handle);
           var contentInner = $("<div class='contentinner clearfix'>").appendTo($("<div class='content'>").appendTo(newWindow));

           $.ajax({
              url: window + ".html",
              success: function (data) { contentInner.append(data); },
              dataType: 'html'
          });

          newWindow.draggable({ stack: ".window",
                          handle: ".handle", containment: 'body' })
                      .resizable({handles: "all", snap: true, minHeight: 400, 
                          minWidth: 300, stack: "window", resize: function() {
                          setWindowHeight(this); } // Refreshes window height
                      });
          
          setWindowHeight(newWindow);

          newWindow.fadeIn();
         
        }
        
        /* Messages window tabbing functionality -Robert */
        
        $(".r_messages .r_tabs li").click(function(){
        	var id = $(this).attr('id');
        	$(this).removeClass('r_inactive').siblings().addClass('r_inactive');
        
        	$("."+id+"-tab").removeClass('r_inactive-window').siblings('div').addClass('r_inactive-window');		
        });
        
        
}); //end of the document.ready

    
      

