

$(document).ready(function(){

        var j_connecting = false;

        //Set initial windows and fix click              
        $('.window').css('zIndex', '1');
        $('.window').click(function() {
          //$(this).css('zIndex', '2').siblings('.window').css('zIndex', '1');
          $(this).trigger("drag", event);
        });


       


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
                      .resizable({handles: "all", snap: true, minHeight: 320, 
                          minWidth: 300, stack: "window", resize: function() {
                          setWindowHeight(this); } // Refreshes window height
                      });

       


        // Close button functionality
        $( "button.close" ).on("click", function() {
          $(this).closest(".window").hide();
          $('.j_opened').removeClass('j_opened');
        });

        // Dynamically refresh a window's height
        function setWindowHeight(elem) {
            var $this = $(elem);
            var content = $this.find('.contentinner'); // Content wrapper
            var windowHeight = $this.height();
            var windowWidth = $this.width();
            var contentHeight = windowHeight - 20; // Height - handle bar
            var bounceWidth = content.width() - 105; // Width of bounce route (minus connect button)

            content.css("height", contentHeight); // Set content height
            content.find('.route').css('width', bounceWidth); // Set bounceroute width


            // Handles window/module resizing based on the state of the window.
            
            var mapHeight = contentHeight - 34 - 15;

            //mapCanvas.scaleAll(Math.min((windowWidth-10) / 468, mapHeight / 239));

            var scalar = (Math.min((windowWidth-10) / 468, mapHeight / 239));

            mapCanvas.setSize(468*scalar, 239*scalar);

            continents.transform('');
            continents.scale(0.016963*scalar, -0.016963*scalar, 0,0).translate(0,-15000);
            
            var canvasX = $('#worldmap svg').width() / 100;
            var canvasY = $('#worldmap svg').height() / 100;
           /* if (line) line.remove();
            if (line2) line2.remove();
            line = mapCanvas.path("M" + Math.floor(parseFloat(server1.attr("cx")) * canvasX) + " " + Math.floor(parseFloat(server1.attr("cy")) * canvasY) + "L" + Math.floor(parseFloat(server2.attr("cx")) * canvasX) + " " + Math.floor(parseFloat(server2.attr("cy")) * canvasY)).attr({stroke: "#7C7C7C", "stroke-dasharray": ". ", "stroke-width": 2, "stroke-linejoin": "round"});
            line2 = mapCanvas.path("M" + Math.floor(parseFloat(server2.attr("cx")) * canvasX) + " " + Math.floor(parseFloat(server2.attr("cy")) * canvasY) + "L" + Math.floor(parseFloat(server3.attr("cx")) * canvasX) + " " + Math.floor(parseFloat(server3.attr("cy")) * canvasY)).attr({stroke: "#7C7C7C", "stroke-dasharray": ". ", "stroke-width": 2, "stroke-linejoin": "round"});
            line.toBack();
            line2.toBack();
            continents.toBack(); */

            $.each(lineArray, function(index, line) {
            
              var from = line.data("from");
              var to = line.data("to");
              line.remove();
              lineArray[index] = mapCanvas.path("M" + Math.floor(parseFloat(from.attr("cx")) * canvasX) + " " + Math.floor(parseFloat(from.attr("cy")) * canvasY) + "L" + Math.floor(parseFloat(to.attr("cx")) * canvasX) + " " + Math.floor(parseFloat(to.attr("cy")) * canvasY)).attr({stroke: "#7C7C7C", "stroke-dasharray": ". ", "stroke-width": 2, "stroke-linejoin": "round"})
                 .data("from",from).data("to", to);
            });


            if ($this.hasClass("disconnected")) {
              
              content.find('.map').css('height', mapHeight).siblings('.browser').css('height', mapHeight);
            } else {             
              content.find('.browser').css('height', mapHeight);
            }

            servers.toFront();
            server1.toFront();
         }


        // Connect button clicks
        $('button.connect').on("click", function() {
          if (!j_connecting) {
              var $this = $(this);
              openWindow = $this.closest(".window");

              /***** CONNECT BUTTON ******/
              

              var route = openWindow.find('.bounces');
              var bounces = route.children();
              var bounceList = [];
              var currentBounceIndex = 0;

              //Flag
              j_connecting = true;

              /* Queue connection animations for bounce route */

              bounces.each(function() {
                bounceList.push(this); 
              });

              function connectBounce() { 
                var currentBounce = bounceList[currentBounceIndex];

                onConnect(currentBounce, currentBounceIndex);

                currentBounceIndex++;
                if (currentBounceIndex < bounceList.length) {
                  setTimeout(connectBounce, 400);
                } else {
                  setTimeout(moveRouteUp, 800);
                }
              };

              function disconnectBounce(start) {
                if (start) {
                  currentBounceIndex = bounceList.length-1;
                }
                var currentBounce = $(bounceList[currentBounceIndex]);
                

                if (!currentBounce.hasClass("you")) {
                  currentBounce.fadeOut("fast",function() {
                    currentBounce.remove();
                  });
                } else { currentBounce.css("background", "white"); }
                

                currentBounceIndex--;
                
                if (currentBounceIndex > 0) {
                  setTimeout(disconnectBounce, 100);
                } else {
                  clearBounces();
                  server1.attr("fill", "#fff");
                  servers.attr("fill", "#7C7C7C");
                  $(".you").css("background", "#fff");
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

                setTimeout(j_flagChange, 1000);
              }

              function moveRouteUp() {
                setTimeout(toggleButton, 300);
                contentWindow = $this.closest(".contentinner");

                $this.closest(".window").switchClass("disconnected", "connected", 2000).find('.title').text("BROWSER (" + bounceArray[bounceArray.length-1].data("ip") + "}");

                // move route up
                contentWindow.animate({
                marginTop: "-=" + (contentWindow.find('.map').height() + 5) }, 1000, "easeInOutExpo");

                contentWindow.find('.destServer').animate({boxShadow: "0 0 2px #fff"});
                setTimeout(j_flagChange, 1000);
              }

              function toggleButton() {
                if ($this.hasClass("connect")) {
                  $this.switchClass("connect", "disconnect").text("DISCONNECT");
                  $this.animate({boxShadow: "0 5px 0 #95000A"}, {queue: false, duration: 100});
                } else {
                  $this.switchClass("disconnect", "connect").text("CONNECT");
                  $this.animate({boxShadow: "0 5px 0 #1B9133"}, {queue: false, duration: 100});
                  servers.data("onPath", false);
                }
              }

              function j_flagChange() {
                j_connecting = false;
              }

              function clearBounces() {
                  $.each(lineArray, function(idx, line) {
                    line.remove();
                  });
                  lineArray = [];
                  bounceArray = [server1];
              }

              if (openWindow.hasClass("disconnected")) { 
                connectBounce();
              /***** DISCONNECT BUTTON ******/
              } else {
                //openWindow.fadeOut();
                disconnectBounce(true);
              }
          }
        });


        /* DOCK functionality */

        $('.j_connect').on("click", function() {
          $('.window').fadeToggle();
          $(this).parent('li').toggleClass('j_opened');
          //loadWindow("connector");
        });

        function onConnect(elem, index) {
          $this = $(elem);
          if ($this.hasClass("arrow")) {
              $this.css("color", "#3fd92f");
              lineArray[(index - 1) / 2].attr("stroke", "#3fd92f");
          } else if ($this.hasClass("you")) {
            $this.css("background", "#C4F1B4");
            server1.attr("fill", "#C4F1B4")
          } else {
              $this.css("background", "#3fd92f");
              if (!$this.hasClass("destServer")) {
                $this.animate({width: "23px", textIndent: "-9999px"});
                bounceArray[(index) / 2].attr("fill", "#3fd92f")
              } else { 
                $this.animate({boxShadow: "0 0 60px #3fd92f"}, 1200);
                bounceArray[bounceArray.length - 1].attr("fill", "#3fd92f");
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
                      .resizable({handles: "all", snap: true, minHeight: 320, 
                          minWidth: 300, stack: "window", resize: function() {
                          setWindowHeight(this); } // Refreshes window height
                      });
          
          setWindowHeight(newWindow);

          newWindow.fadeIn();
         
        }
});

(function ($) {
    var _create =  $.ui.draggable.prototype._create;

    $.ui.draggable.prototype._create = function () {
        var self = this;

        self.element.mousedown(function (e) {
            self._mouseStart(e);
            self._trigger('start', e);
            self._clear();
        });

        _create.call(self);
    };
})(jQuery);


 
      

