

$(document).ready(function(){
      
        var j_connecting = false;

        //Set initial windows and fix click              
        $('.window').css('zIndex', '1');
        $('.window').click(function() {
          //$(this).css('zIndex', '2').siblings('.window').css('zIndex', '1');
          $(this).trigger("drag", event);
        });


        $('#r_messages').hide();
        $('#p_file_browser').hide();
        $('#p_cracker').hide();

		var r_ongoingMissions = 0,
			r_totalMessages = 0;
			
		var mission1File = 'AFS::75SF23GF8',
			mission2File = 'AFS::231ASD8SD';

        /*function Screen(windowName) {
            var windowTemplate = '<div class="window"><div class="handle"><button class="close"></button><span class="title">{{title}}</span></div><div class="content"><div class="contentinner clearfix">{{content}}</div></div></div>'.replace(/{{title}}/, windowName );
              $.ajax({
                url: "windows/" + windowName + ".html",
                success: function (data) { var newTemplate = windowTemplate.replace(/{{content}}/, data); },
                dataType: 'html'
              });
              $(newTemplate).appendTo('body');
        }

        //var something = new Screen("connector");
        */
        // Automatically sets proper height for the window.
        setWindowHeight($('.window'));
        setWindowHeight($('#r_messages'));

        $('#connector').hide();

        $( ".window" ).draggable({ stack: ".window",
                          handle: ".handle", containment: 'body' });

        $("#connector").resizable({handles: "all", snap: true, minHeight: 320, 
                          minWidth: 300, stack: "window", resize: function() {
                          setWindowHeight(this); } // Refreshes window height
                      });

        $("#r_messages").resizable({handles: "all", snap: true, minHeight: 320, 
                          minWidth: 300, stack: "window", resize: function() {
                          setWindowHeight(this); } // Refreshes window height
                      });
                      
        $("#p_file_browser").resizable({handles: "all", snap: true, minHeight: 320, 
                          minWidth: 280, stack: "window", resize: function() {
                          setWindowHeight(this); } // Refreshes window height
                      });

       
       


        // Close button functionality
        $( "button.close" ).on("click", function() {
          var $window = $(this).closest(".window");
          $window.hide().removeClass('j_visible');
          var id = $window.attr("id");
          var dock = $('.dock');

          if (id == "connector") {
            dock.find('.j_connect').parent('li').removeClass('j_opened');
          } else if (id == "r_messages") {
            dock.find('.j_missions').parent('li').removeClass('j_opened');
          } else if (id == "p_file_browser") {
            dock.find('.j_filesystem').parent('li').removeClass('j_opened');
          } else if (id == "p_cracker") {
            dock.find('.j_cracker').parent('li').removeClass('j_opened');
            resetPasscracker();
          }

        });
        
        function resetPasscracker() {
           var resetLock = $('<p>drag lock to password field</p><img draggable="true" id="p_lock" src="img/lock.png"/>');
           $('#p_cracker').find('#cypher').remove();
           //resetLock.appendTo($('#p_cracker .contentinner'));
           lock = $('#p_lock');
           lock.siblings('p').fadeIn(300);
           lock.fadeIn(300);
           pwString = "";
       }

        // Dynamically refresh a window's height
        function setWindowHeight(elem) {
            var $this = $(elem);
            if ($this.attr("id") == "connector") {
              var content = $this.find('.contentinner'); // Content wrapper
              var windowHeight = $this.height();
              var windowWidth = $this.width();
              var contentHeight = windowHeight - 20; // Height - handle bar
              var contentWidth = windowWidth - 10;
              var bounceWidth = content.width() - 105; // Width of bounce route (minus connect button)

              content.css("height", contentHeight); // Set content height
              content.find('.route').css('width', bounceWidth); // Set bounceroute width


              // Handles window/module resizing based on the state of the window.
              
              var mapHeight = contentHeight - 34 - 15;
              var scalar = (Math.min((windowWidth-10) / 468, mapHeight / 239));

              mapCanvas.setSize(468*scalar, 239*scalar);

              continents.transform('');
              continents.scale(0.016963*scalar, -0.016963*scalar, 0,0).translate(0,-15000);
              
              var canvasX = $('#worldmap svg').width() / 100;
              var canvasY = $('#worldmap svg').height() / 100;
              updateTooltips(canvasX, canvasY);

              $.each(lineArray, function(index, line) {
                var from = line.data("from");
                var to = line.data("to");
                line.remove();
                lineArray[index] = mapCanvas.path("M" + Math.floor(parseFloat(from.attr("cx")) * canvasX) + " " + Math.floor(parseFloat(from.attr("cy")) * canvasY) + "L" + Math.floor(parseFloat(to.attr("cx")) * canvasX) + " " + Math.floor(parseFloat(to.attr("cy")) * canvasY)).attr({stroke: "#7C7C7C", "stroke-dasharray": ". ", "stroke-width": 2, "stroke-linejoin": "round"})
                   .data("from",from).data("to", to);
              });

              $browser = $('div.browser');
              $('.screen').css("width", contentWidth);

              $('.browser').css("width", contentWidth * 3 + 20);
              
              if ($browser.hasClass("logs")) {
                setBrowserPos("logs", false);
              } else if ($browser.hasClass("files")) {
                setBrowserPos("files", false);
              } else {
                setBrowserPos("login", false);
              }

              connectorContent = $('#connector .contentinner');
              connectorContent.find('.map').css('height', mapHeight).siblings('.browser').css('height', mapHeight);
              if (!$this.hasClass("disconnected")) { 
                connectorContent.css({marginTop: -mapHeight -5});
              }

              $('.j_login-overlay').css({"width": contentWidth, "height": mapHeight, "paddingTop": mapHeight / 2 - 10});

              servers.toFront();
              server1.toFront();
            } else if ($this.attr("id") == "r_messages") {
              var content = $this.find('.contentinner'); // Content wrapper
              var windowHeight = $this.height();
              var windowWidth = $this.width();
              var contentWidth = windowWidth - 10;
              var contentHeight = windowHeight - 20; // Height - handle bar
              var tablessHeight = contentHeight - 36;

              content.css("height", contentHeight + "px");


              $('.j_ongoing-overlay').css({"width": contentWidth, "height": tablessHeight - 6, "paddingTop": tablessHeight / 2 - 20});
              $('.j_ongoing-overlay2').css({"width": contentWidth, "height": tablessHeight - 6, "paddingTop": tablessHeight / 2 - 20});
              $('.r_ongoing-tab').css("height", tablessHeight + "px");
              $('.r_ongoing-sidebar').css("height", tablessHeight - 6 + "px");
              $('.r_ongoing-main-inside').css("height", tablessHeight - 6 + "px");
              $('.r_freelance-tab').css("height", tablessHeight + "px");
              $('.r_bounties-tab').css("height", tablessHeight + "px");
              

            }
         }

         function setBrowserPos(pos, animate) {
            $content = $('#connector .contentinner');
            $browser = $content.find('.browser');
            contentWidth = $content.width();
            if (animate) {
              if (pos == "login") {
                $browser.animate({marginLeft: -(contentWidth + 5)}, 1000, "easeInOutExpo");
                $browser.removeClass("files").removeClass("logs").addClass("login");
              } else if (pos == "logs") {
                $browser.animate({marginLeft: 0}, 1000, "easeInOutExpo");
                $browser.removeClass("login").removeClass("files").addClass("logs");
              } else if (pos == "files") {
                $browser.animate({marginLeft: -(contentWidth * 2 + 10) }, 1000, "easeInOutExpo");
                $browser.removeClass("login").removeClass("logs").addClass("files");
              }
            } else {
              if (pos == "login") {
                $browser.removeClass("files").removeClass("logs").addClass("login");
                $browser.css({marginLeft: -(contentWidth + 5)});
              } else if (pos == "logs") {
                $browser.css("marginLeft", 0);
                $browser.removeClass("login").removeClass("files").addClass("logs");
              } else if (pos == "files") {
                $browser.css("marginLeft", -(contentWidth * 2 + 10));
                $browser.removeClass("login").removeClass("logs").addClass("files");
                console.log("happening");
              }
            }
         }


        // Connect button clicks
        $('button.connect').on("click", function() {
          var $this = $(this);
          openWindow = $this.closest(".window");

          var route = openWindow.find('.bounces');
          var bounces = route.children();
          console.log("length = " + route.children().length);
          if (route.children().length < 3) {
            var cantconnect = $('.cantconnect');
            cantconnect.fadeIn(200);
            setTimeout(function() {
            cantconnect.fadeOut(600);
            }, 1000)
          } else if (!j_connecting) {


              //Flag
              j_connecting = true;



              if (($('.destServer').text() == "158.110.32.188") || ($('.destServer').text() == "54.87.103.22")) {
                $('.j_login-overlay').hide();
              }
              /***** CONNECT BUTTON ******/
              
              var bounceList = [];
              var currentBounceIndex = 0;

              $('.servertitle').text($('.destServer').text());

              

              /* Queue connection animations for bounce route */

              bounces.each(function() {
                bounceList.push(this); 
              });

              function connectBounce() { 
                var currentBounce = bounceList[currentBounceIndex];
                openWindow.removeClass("disconnected");
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
                  changeMapIcon();
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
                setTimeout(function() {
                  $('.j_login-overlay').show();
                }, 1500);

                contentWindow.find('.destServer').animate({boxShadow: "0 0 2px #fff"});

                setTimeout(j_flagChange, 1000);
                setBrowserPos("login", true);

                $('#p_dropBox').val("");
                $('#p_dropBox').css("background", "#f8eed0");
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

        $('button.login').on("click", function() {
          console.log($('#p_dropBox').val());
          if ($('#p_dropBox').val() == "ROSEBUD" || $('#p_dropBox').val() == "rosebud") {
            setBrowserPos("files", true);
          } else {
            var passerror = $('.wrongpassword');
            passerror.fadeIn(200);
            setTimeout(function() {
              passerror.fadeOut(600);
            }, 1000);
            $('#p_dropBox').css("background", "#f8eed0");
          }

        });

        $('button.logs').on("click", function() {
          setBrowserPos("logs", true);
        });

        /* DOCK functionality */

        $('.j_connect').on("click", function() {
          j_openWindow.apply(this,[$('#connector')]);
        });

        $('.j_missions').on("click", function() {
          j_openWindow.apply(this,[$('#r_messages')]);
        });

        $('.j_filesystem').on("click", function() {
          j_openWindow.apply(this,[$('#p_file_browser')]);
        });

        $('.j_cracker').on("click", function() {
          j_openWindow.apply(this,[$('#p_cracker')]);
        });

        function j_openWindow($window) {
          if ($window.hasClass('j_visible')) {
            $window.fadeOut();
            $window.removeClass('j_visible');
            $(this).parent('li').removeClass('j_opened');
          } else {
            $window.fadeIn();            
            $window.addClass("j_visible");
            $window.css("zIndex", getWindowZ());
            $(this).parent('li').addClass('j_opened');
          }
        }

        function getWindowZ() {
          var largestZ = 1;
          $(".window").each(function(i) {
            var currentZ = parseFloat($(this).css("zIndex"));
            largestZ = currentZ > largestZ ? currentZ : largestZ;
          });
          largestZ++;
          return largestZ;
        }

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
        
        /* Messages window tabbing functionality -Robert */
        
        $(".r_messages .r_tabs li").click(function(){
        	var id = $(this).attr('id');
        	$(this).removeClass('r_inactive').siblings().addClass('r_inactive');
        
        	$("."+id+"-tab").removeClass('r_inactive-window').siblings('div').addClass('r_inactive-window');	
        });
        
        $(".r_ongoing-sidebar").on("click", ".r_mission-message", function(){
        	var id = $(this).attr('id');
        	        	
        	$(this).removeClass('r_inactive').siblings().addClass('r_inactive');
        	$("#"+id+"-tab").removeClass('r_inactive-message').siblings('.r_ongoing-main').addClass('r_inactive-message');
        });
        
        /* Messages window Accepting Missions functionality -Robert */
        
       $('.r_freelance-mission-item .r_action-button').click(function(){
       		var li = $(this).closest('li.r_freelance-mission-item');
       		
       		li.slideUp(200, function(){
       			addNewOngoingMission($(this).find('h1').text());
       			$(this).remove();
       			updateUnreadMessagesCount();
       		});
       });
       
       
       // Submit button click event
       $('.r_ongoing-tab').on('click','.r_ongoing-main .r_action-button:not(.r_clear)', function(){       
       		var message = $(this).closest('.r_ongoing-main'),
       			innerDiv = message.find('.r_ongoing-main-inside'),
       			children = innerDiv.children(),
       			correctFile;
       			
       		if(message.attr('id') == 'r_message1-tab') {
       			correctFile = mission1File;
       		} else if(message.attr('id') == 'r_message2-tab') {
       			correctFile = mission2File;
       		}
       		
          var j_droparea = innerDiv.find('.r_file-drop-area');

       		if(j_droparea.text() != correctFile) {
       		
            //ERROR!
          	var wrongfile = j_droparea.siblings('.j_wrongfile');
            wrongfile.fadeIn(200);
            setTimeout(function() {
              wrongfile.fadeOut(600);
            }, 1000);
            return;
       		}
       			
       		children.each(function(index){
       			$(this).animate({
       				'opacity' : 0
       			}, 100 * (children.length - index));
       		});
       		
       		setTimeout(function(){
            var j_completion = '<p class="r_mission-completed">Good job! This mission has been completed!</p>';       			
            innerDiv.html(j_completion);
       			children.hide();

            innerDiv.find('.r_mission-completed').hide().fadeIn(300);

            r_ongoingMissions--;
            updateUnreadMessagesCount();
       			
            var li = message.attr('id').substring(0, 10);
            var missionId = message.attr('id').substring(9, 10);
            revertMapIcon(missionId);
            console.log(li);
            $('#'+li).removeClass('r_unread');

       		}, children.length * 100);
       });
       
       
       // Clear button click event
       $('.r_ongoing-tab').on('click','.r_clear',function(){
       		$(this).siblings('.r_file-drop-area').html('Drag File Here').css("background", "#444444");
       });
       
       var updateUnreadMessagesCount = function() {
       		var badge = $('#r_badge');
       		
       		if(r_ongoingMissions == 0) {
       			badge.hide(0);
       		} else {
       			badge.show(0);
       			badge.text(r_ongoingMissions);
       		}
       }
       
      
      var addNewOngoingMission = function(missionTitle) {
 			r_totalMessages++;
          $('.j_ongoing-overlay').hide();
       		r_ongoingMissions++;

      		var mainWindow = generateMission(r_totalMessages),
       			sidebar = generateMissionSidebar(missionTitle, r_totalMessages);

       		$('.r_ongoing-sidebar ul').prepend(sidebar);
       		$('.r_ongoing-tab').append(mainWindow);	
          
          $('.r_unread:first-child').trigger("click");

          addDroppable();

       }
       
       var generateMission = function(id) {

          var j_thisip;
          var j_thisfile;
          var j_thismoney;

          if (id == 1) {
            j_thisip = "158.110.32.188";
            j_thisfile = "AFS::75SF23GF8";
            j_thismoney = "12,000";
          } else {
            j_thisip = "54.87.103.22";
            j_thisfile = "AFS::231ASD8SD";
            j_thismoney = "9,000";
          }

          changeMapIcon(id);

       		var baseDiv = $('<div class="r_ongoing-main clearfix r_inactive-message" id="r_message'+id+'-tab"></div>'),
       			innerDiv = $('<div class="r_ongoing-main-inside"></div>'),
       			to = $('<p class="r_to">Target: <span class="r_spanip">' + j_thisip + '</span></p>'),
       			subject = $('<p class="r_subject">Subject: Steal Key Files</p>'),
       			messageIntro = $('<p class="message">Hack into the company server and retrieve the following file:</p>'),
       			messageClose = $('<p class="message"> Reply to this message upon completion, and a payment of $' + j_thismoney + ' US will be transferred to you.</p>'),
       			fileNames = $('<span class="r_important-info">' + j_thisfile + '</span>'),
          		submitArea = $('<div class="r_file-drop-area">Drag file here</div>'),
          		submitButton = $('<button class="r_action-button">Submit File</button>'),
              wrongFile = $('<div class="j_wrongfile">Incorrect File!</div>'),
          		clearButton = $('<button class="r_action-button r_clear">Clear File</button>');
          		
       		innerDiv.append(subject)
       				.append(to)
       				.append(messageIntro)
       				.append(fileNames)
       				.append(messageClose)
       				.append(submitArea)
       				.append(submitButton)
              .append(wrongFile)
       				.append(clearButton)
       				.appendTo(baseDiv);

       		return baseDiv;
       }
       
       var firstMissionAdded = false;

       var generateMissionSidebar = function(missionTitle, id){
       		
          if (firstMissionAdded) {
            var baseLi = $('<li class="r_mission-message r_unread r_inactive" id="r_message'+id+'"></li>');
       		} else {
            var baseLi = $('<li class="r_mission-message r_unread" id="r_message'+id+'"></li>');
            firstMissionAdded = true;
          }

          missionTitle = missionTitle.replace('Level 1 ','');
          var title = $('<p>'+missionTitle+'</p>');
       		
       		baseLi.append(title);
       		
       		return baseLi;
       } 
        



        var lockIcon = document.createElement('img');
        lockIcon.src = 'img/lock.png'
        
        /* cypher functionality  -- aka cracking animation -Robert */
        var crackDuration = 4*1000,
        	passwordLength = 7,
        	timeStep = 100,
        	pwString = "";


        function lockDragStart(e) {
          this.style.opacity = '0';
          //this.fadeOut(4000);
          e.dataTransfer.setDragImage(lockIcon, 10, 10);
        }
        function lockDragOver(e) {
          if (e.preventDefault) {
            e.preventDefault(); 
          } 
          $(this).css("background", "#f0cd63");
          console.log('dragging over');
          return false;
        }
        function lockDragEnter(e) {
          console.log('dragEntered');
          $(this).css("background", "#f0cd63");
        }
        function lockDragLeave(e) {
          $(this).css("background", "#F8EED0");
        }

        function lockDrop(e) {
          
          $('#p_dropBox').css("background", "#F5F0CD");

          var pw = $(this);
          
          cypherStart(function(){
            //pw.attr("value", "rosebud");

            ///What happens on end
            setTimeout(moveCypher, 200);

        });

        function moveCypher() {
            var cypher = $('#cypher');
            var cypherOffset = $('#cypher').offset();
            var inputOffset = $('#p_dropBox').offset();

            cypher.appendTo('body');
            cypher.css({
              "position": "absolute",
              "top": cypherOffset.top,
              "left": cypherOffset.left,
              "zIndex": 10000,
              "paddingTop": 0,
            });

            cypher.animate({
              "top": inputOffset.top-15,
              "left": inputOffset.left,
              "-webkit-transform": "scale(2)"
            }, 500);

            setTimeout(function() {
              cypher.animate({
              "opacity": 0
              }, {
              duration: 300,
              queue: false
              });
            }, 300);

            setTimeout(function(){
               $('#p_dropBox').css("background", "#d9f7cf");
               $('#p_dropBox').attr("value", "rosebud");
            }, 450);

            resetPasscracker();
           
        }

     
          
          this.style.opacity = '1';
          console.log('dropped');
          //$(this).attr("value", "rosebud");
          if (e.stopPropagation) {
            e.stopPropagation(); 
          }
          return false;
        }

        function lockDragEnd(e) {
          this.style.opacity = '1';
        }

        var file_list = $('#p_file_list');
        var file_list2 = $('#p_file_list2');
        var file_name;

        file_list.children('li:odd').css('background-color','#2a362e');
        file_list.children('li:even').css('background-color','#232d26');

       file_list.sortable({
          revert: true,
          update: function(event, ui){
            file_list.children('li:odd').css('background-color','#2a362e');
            file_list.children('li:even').css('background-color','#232d26');
          },
          helper: 'clone',
          appendTo:'body',
          zIndex: 10000,
          start: function(event, ui){
            file_name = ui.item.text();
            console.log(file_name);
          },
          receive: function(event, ui){
            ///THIS IS WHERE I PUT THE THING
            console.log(ui);
            //setTimeout(resetFileColors,5000);
          },
          stop: function(event, ui) {
            if (ui.item.hasClass("serverfile")) {
              ui.item.removeClass("serverfile");
              downloadColors(ui.item, 1);
            }
          }
        });


        var file_name_set = false;

        $('.serverfile').draggable({
          connectToSortable: '#p_file_list',
          helper: 'clone',
          appendTo:'body',
          zIndex: 10000,
          revert: 'invalid',
          start: function(event, ui) {
            //file_name = ui.item.text();
            var fileWidth = $('#connector .contentinner').width();
            setTimeout(function() {
              var dragHelper = $('li.serverfile.ui-draggable-dragging');
              //dragHelper.css("width",fileWidth);
              console.log(dragHelper);
              if (!file_name_set) { file_name = $('li.serverfile.ui-draggable-dragging').html(); }
              console.log(file_name);
              file_name_set = true;
            },10);
            
          }
        });

        $('ul, li').disableSelection();

        // making this a function because I want this setup to re-trigger 
        // after accepting missions.
        function addDroppable() {
        var drop_area = $('.r_file-drop-area');
          drop_area.droppable({
            drop: function(event, ui){
              console.log(file_name);
              $(this).addClass("dropped_state").html(file_name);
              $(this).css("background", "#2B372D");
            },
            over: function(event, ui){
              drop_area.css("background", "#4a6c54");
            },
            out: function(event, ui){
              drop_area.css("background", "#434343");
            }

          });
        };

        addDroppable();
        
        function downloadColors(item, pct) {
          if (pct == 101) {
            item = $(item[0]);
            item.attr("style", "");
            item.css("background", "white");
            item.css("background","url('img/file.png') no-repeat");
            item.css("background-position","5px");

            resetFileColors();
          } else {
            console.log(item);
            $(item[0]).css("background", "-webkit-linear-gradient(left, #F28500 " + pct + "%,#ffffff " + pct + "%,#ffffff 100%)");
            console.log("hello pct: " + pct);
            //setTimeout(downloadColors, 50, [item, pct + 1]);
            setTimeout(function() {
              downloadColors(item, pct +4);
            }, 20);
          }
        }

        function resetFileColors() {
          file_list.children('li:odd').css('background-color','#2a362e');
          file_list.children('li:even').css('background-color','#232d26');
        }


        /* this is called in lockDrop */
        var cypherStart = function(callback){
        	var r_password = "ROSEBUD",
        		lock = $('#p_lock'),
        		cracker = lock.parents('.contentinner'),
        		cypher = $('<p id="cypher"></p>'),
        		characterTime = parseInt(crackDuration / passwordLength, 10);
        		
          lock.siblings('p').hide();
          lock.hide();
                    
          for(var i = 0; i < passwordLength; i++) {
          	var span = $('<span id="digit'+ (i+1) +'">A</span').css({
          		'left' : 36 * i
          	});
          	cypher.append(span);
          }
          
          cracker.append(cypher);
          
		  for(var i = 0; i < passwordLength; i++) {
		  	var cypherdigit = $('#digit'+ (i+1) );
		  	turnCypher(cypherdigit, characterTime * (i+1), r_password.charAt(i));
		  }
                    
          setTimeout(function(){
          	
          	$('#cypher').css({
          		'color' : '#56FF67'
          	});
          	callback.call(this)
          	
          	}, crackDuration);
        };
        
        var turnCypher = function(element, milliseconds, target){
        	var tick = timeStep,
        		randomChar;
        	
        	if(milliseconds <= 0) {
        		element.text(target);
        		pwString = pwString + target;
        		//$('#p_dropBox').attr('value', pwString);
        		return;
        	}
        	if(milliseconds <= 1000) {
        		tick = timeStep * 2;
        	}
        	
			randomChar = parseInt( Math.random() * 25 ) + 65;
        	element.text(String.fromCharCode(randomChar));
        	setTimeout(function(){
        		turnCypher(element, milliseconds - tick, target)
        	}, tick);
        };

        var lock = document.querySelector('#p_lock');
        var dropBox = document.querySelector('#p_dropBox');
        lock.addEventListener('dragstart', lockDragStart, false);
        lock.addEventListener('dragend', lockDragEnd, false);
        /*the lockDragEnd event fires regardless of whether it was dropped or not, so I'm removing it -r */
        dropBox.addEventListener('dragover', lockDragOver, false);
        dropBox.addEventListener('dragenter', lockDragEnter,false);
        dropBox.addEventListener('dragleave', lockDragLeave,false);
        dropBox.addEventListener('drop', lockDrop, false);

        
}); //end of the document.ready

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

centerLogo();

$(window).on("resize", centerLogo);

function centerLogo() {
  $window = $(window);
  wHeight = $window.height();
  wWidth = $window.width();
  $('.cryptlogo').css({
    "left": wWidth/2,
    "top": wHeight/2-40
  });
}

