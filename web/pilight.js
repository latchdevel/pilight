var oWebsocket = false;
var bConnected = false;
var bInitialized = false;
var bSending = false;
var aDecimals = new Array();

function createSwitchElement(sTabId, sDevId, aValues) {
	if($('#'+sTabId+'_'+sDevId+'_switch').length == 0) {
		oTab = $('#'+sTabId).find('ul');
		oTab.append($('<li data-icon="false">'+aValues['name']+'<select id="'+sTabId+'_'+sDevId+'_switch" data-role="slider"><option value="off">Off</option><option value="on">On</option></select></li>'));
		$('#'+sTabId+'_'+sDevId+'_switch').slider();
		$('#'+sTabId+'_'+sDevId+'_switch').bind("change", function(event, ui) {
			event.stopPropagation();
			var json = '{"message":"send","code":{"location":"'+sTabId+'","device":"'+sDevId+'","state":"'+this.value+'"}}';
			if(oWebsocket) {
				oWebsocket.send(json);
			} else {
				bSending = true;
				$.get('http://'+location.host+'/send?'+encodeURIComponent(json));
				window.setTimeout(function() { bSending = false; }, 1000);
			}
		});
		oTab.listview();
		oTab.listview("refresh");
	}
	if(aValues['state'] == "on") {
		$('#'+sTabId+'_'+sDevId+'_switch')[0].selectedIndex = 1;
		$('#'+sTabId+'_'+sDevId+'_switch').slider('refresh');
	} else {
		$('#'+sTabId+'_'+sDevId+'_switch')[0].selectedIndex = 0;
		$('#'+sTabId+'_'+sDevId+'_switch').slider('refresh');
	}
	if(aValues['settings']['readonly']) {
		$('#'+sTabId+'_'+sDevId+'_switch').slider('disable');
	}
}

function createScreenElement(sTabId, sDevId, aValues) {
	if($('#'+sTabId+'_'+sDevId+'_screen').length == 0) {
		oTab = $('#'+sTabId).find('ul');
		oTab.append($('<li data-icon="false">'+aValues['name']+'<div id="'+sTabId+'_'+sDevId+'_screen" class="screen" data-role="fieldcontain" data-type="horizontal"><fieldset data-role="controlgroup" class="controlgroup" data-type="horizontal" data-mini="true"><input type="radio" name="'+sTabId+'_'+sDevId+'_screen" id="'+sTabId+'_'+sDevId+'_screen_down" value="down" /><label for="'+sTabId+'_'+sDevId+'_screen_down">Down</label><input type="radio" name="'+sTabId+'_'+sDevId+'_screen" id="'+sTabId+'_'+sDevId+'_screen_up" value="up" /><label for="'+sTabId+'_'+sDevId+'_screen_up">Up</label></fieldset></div></li>'));
		$("div").trigger("create");
		$('#'+sTabId+'_'+sDevId+'_screen_down').checkboxradio();
		$('#'+sTabId+'_'+sDevId+'_screen_up').checkboxradio();
		$('#'+sTabId+'_'+sDevId+'_screen_down').bind("change", function(event, ui) {
			event.stopPropagation();	
			i = 0;
			oLabel = this.parentNode.getElementsByTagName('label')[0];
			$(oLabel).removeClass('ui-btn-active');
			x = window.setInterval(function() {
				i++;
				if(i%2 == 1)
					$(oLabel).removeClass('ui-btn-active');
				else
					$(oLabel).addClass('ui-btn-active');
				if(i==4)
					window.clearInterval(x);
			}, 150);
			var json = '{"message":"send","code":{"location":"'+sTabId+'","device":"'+sDevId+'","state":"'+this.value+'"}}'
			if(oWebsocket) {
				oWebsocket.send(json);
			} else {
				bSending = true;
				$.get('http://'+location.host+'/send?'+encodeURIComponent(json));
				window.setTimeout(function() { bSending = false; }, 1000);
			}
		});
		$('#'+sTabId+'_'+sDevId+'_screen_up').bind("change", function(event, ui) {
			event.stopPropagation();
			i = 0;
			oLabel = this.parentNode.getElementsByTagName('label')[0];
			$(oLabel).removeClass('ui-btn-active');
			x = window.setInterval(function() {
				i++;
				if(i%2 == 1)
					$(oLabel).removeClass('ui-btn-active');
				else
					$(oLabel).addClass('ui-btn-active');
				if(i==4)
					window.clearInterval(x);
			}, 150);
			var json = '{"message":"send","code":{"location":"'+sTabId+'","device":"'+sDevId+'","state":"'+this.value+'"}}';
			if(oWebsocket) {
				oWebsocket.send(json);
			} else {
				bSending = true;
				$.get('http://'+location.host+'/send?'+encodeURIComponent(json));
				window.setTimeout(function() { bSending = false; }, 1000);
			}
		});
	}
	if(aValues['state'] == "up") {
		$('#'+sTabId+'_'+sDevId+'_screen_up').attr("checked","checked")
		$('#'+sTabId+'_'+sDevId+'_screen_up').checkboxradio("refresh");
	} else {
		$('#'+sTabId+'_'+sDevId+'_screen_down').attr("checked","checked")
		$('#'+sTabId+'_'+sDevId+'_screen_down').checkboxradio("refresh");
	}
	oTab.listview();
	oTab.listview("refresh");
	if(aValues['settings']['readonly']) {
		$('#'+sTabId+'_'+sDevId+'_screen_up').checkboxradio('disable');
		$('#'+sTabId+'_'+sDevId+'_screen_down').checkboxradio('disable');
	}
}

function createDimmerElement(sTabId, sDevId, aValues) {
	iOldDimLevel = aValues['dimlevel'];
	if($('#'+sTabId+'_'+sDevId+'_switch').length == 0) {
		oTab = $('#'+sTabId).find('ul');
		oTab.append($('<li data-icon="false">'+aValues['name']+'<select id="'+sTabId+'_'+sDevId+'_switch" data-role="slider"><option value="off">Off</option><option value="on">On</option></select><input type="range" name="slider-fill" id="'+sTabId+'_'+sDevId+'_dimmer" class="dimmer-slider" value="'+aValues['dimlevel']+'" min="'+aValues['settings']['min']+'" max="'+aValues['settings']['max']+'" data-highlight="true" /></li>'));
		$('#'+sTabId+'_'+sDevId+'_switch').slider();
		$('#'+sTabId+'_'+sDevId+'_switch').bind("change", function(event, ui) {
			event.stopPropagation();
			var json = '{"message":"send","code":{"location":"'+sTabId+'","device":"'+sDevId+'","state":"'+this.value+'"}}';
			if(oWebsocket) {
				oWebsocket.send(json);
			} else {
				bSending = true;
				$.get('http://'+location.host+'/send?'+encodeURIComponent(json));
				window.setTimeout(function() { bSending = false; }, 1000);
			}
		});

		$('#'+sTabId+'_'+sDevId+'_dimmer').slider({
			stop: function() {
				if(iOldDimLevel != this.value) {
					iOldDimLevel = this.value;
					$('#'+sTabId+'_'+sDevId+'_switch')[0].selectedIndex = 1;
					$('#'+sTabId+'_'+sDevId+'_switch').slider('refresh');					
					var json = '{"message":"send","code":{"location":"'+sTabId+'","device":"'+sDevId+'","state":"on","values":{"dimlevel":"'+this.value+'"}}}';
					if(oWebsocket) {
						oWebsocket.send(json);
					} else {
						bSending = true;
						$.get('http://'+location.host+'/send?'+encodeURIComponent(json));
						window.setTimeout(function() { bSending = false; }, 1000);
					}
				}
			}    
		});
		
		oTab.listview();
		oTab.listview("refresh");
	}
	$('#'+sTabId+'_'+sDevId+'_dimmer').val(iOldDimLevel);
	$('#'+sTabId+'_'+sDevId+'_dimmer').slider('refresh');
	if(aValues['state'] == "on") {
		$('#'+sTabId+'_'+sDevId+'_switch')[0].selectedIndex = 1;
		$('#'+sTabId+'_'+sDevId+'_switch').slider('refresh');
	} else {
		$('#'+sTabId+'_'+sDevId+'_switch')[0].selectedIndex = 0;
		$('#'+sTabId+'_'+sDevId+'_switch').slider('refresh');
	}
	if(aValues['settings']['readonly']) {
		$('#'+sTabId+'_'+sDevId+'_switch').slider('disable');
		$('#'+sTabId+'_'+sDevId+'_dimmer').slider('disable');
	}
}

function createWeatherElement(sTabId, sDevId, aValues) {
	if($('#'+sTabId+'_'+sDevId+'_weather').length == 0) {
		oTab = $('#'+sTabId).find('ul');
		aDecimals[sTabId+'_'+sDevId] = aValues['settings']['decimals'];
		aValues['temperature'] /= Math.pow(10, aValues['settings']['decimals']);
		aValues['humidity'] /= Math.pow(10, aValues['settings']['decimals']);
		oTab.append($('<li class="weather" id="'+sTabId+'_'+sDevId+'_weather" data-icon="false">'+aValues['name']+'</li>'));
	}
	if(aValues['settings']['battery']) {
		oTab.find('#'+sTabId+'_'+sDevId+'_weather').append($('<div id="'+sTabId+'_'+sDevId+'_batt" class="battery"></div>'));
		if(aValues['battery']) {
			$('#'+sTabId+'_'+sDevId+'_batt').addClass('green');
		} else {
			$('#'+sTabId+'_'+sDevId+'_batt').addClass('red');
		}
	}		
	if(aValues['settings']['humidity']) {
		oTab.find('#'+sTabId+'_'+sDevId+'_weather').append($('<div class="percentage">%</div><div class="humidity" id="'+sTabId+'_'+sDevId+'_humi">'+aValues['humidity']+'</div>'));
	}
	if(aValues['settings']['temperature']) {
		oTab.find('#'+sTabId+'_'+sDevId+'_weather').append($('<div class="degrees">o</div><div class="temperature" id="'+sTabId+'_'+sDevId+'_temp">'+aValues['temperature']+'</div>'));
	}
	oTab.listview();
	oTab.listview("refresh");
}

function createGUI(data) {
	$.each(data, function(root, locations) {
		if(root == 'version') {
			if(locations[0] != locations[1]) {
				$('#version').text("pilight v"+locations[0]+" - available v"+location[1]);
			} else {
				$('#version').text("pilight v"+locations[0]);
			}
		} else if(root == 'config') {
			$('#tabs').append($("<ul></ul>"));
			$.each(locations, function(lindex, lvalues) {
				$.each(lvalues, function(dindex, dvalues) {
					if(dindex == 'name') {
						if($('#'+lindex).length == 0) {
							var oNavBar = $('#tabs');
							var oLi = $("<li></li>");
							var oA  = $('<a href="#'+lindex+'"></a>');
							oA.text(dvalues);
							oLi.append(oA);
							oNavBar.find("*").andSelf().each(function(){
								$(this).removeClass(function(i, cn){
									var matches = cn.match(/ui-[\w\-]+/g) || [];
									return (matches.join (' '));
								});
								if($(this).attr("class") == "") {
									$(this).removeAttr("class");
								}
							});
							oNavBar.navbar("destroy");
							oLi.appendTo($("#tabs ul"));
							oNavBar.navbar();
							$('#content').append($('<div class="content" id="'+lindex+'"><ul data-role="listview" data-inset="true" data-theme="c"></ul></div>'));
						}
					} else if(dindex != 'order') {
						aValues = new Array();
						$.each(dvalues, function(sindex, svalues) {
							aValues[sindex] = svalues;
						});
						if(aValues['type'] == 1 || aValues['type'] == 4) {
							createSwitchElement(lindex, dindex, aValues);
						} else if(aValues['type'] == 2) {
							createDimmerElement(lindex, dindex, aValues);
						} else if(aValues['type'] == 3) {
							createWeatherElement(lindex, dindex, aValues);
						} else if(aValues['type'] == 5) {
							createScreenElement(lindex, dindex, aValues);
						}
					}
				});
			});
			$(document).delegate('[data-role="navbar"] a', 'click', function(e) {
				var iPos = this.href.indexOf('#');
				var iLen = this.href.length;
				var sId = this.href.substring(iPos, iLen);

				$('#content .content').each(function() {
					if(this.id != sId.substring(1, sId.length) && $(this).css("display") != 'none') {
						$(this).toggle();
					}
				});

				if($(sId).css("display") == "none") {
					$(sId).toggle();
				}
				e.preventDefault();
			});
			if(!bInitialized) {
				$('#tabs a').each(function() {
					$(this).click();
					$(this).addClass("ui-btn-active");
					return false;
				});
			}
			$.mobile.hidePageLoadingMsg();
			bInitialized = true;			
		}
	});	
}

function parseData(data) {
	if(data.hasOwnProperty("config")) {
		createGUI(data);
	} else if(data.hasOwnProperty("values") && data.hasOwnProperty("origin") && data.hasOwnProperty("devices") && data.hasOwnProperty("type")) {
		var aValues = data.values;
		var aLocations = data.devices;
		var iType = data.type;
		$.each(aLocations, function(lindex, lvalues) {
			$.each(lvalues, function(dindex, dvalues) {
				$.each(aValues, function(vindex, vvalues) {
					if(iType == 1 || iType == 4) {
						if(vindex == 'state') {
							if(vvalues == 'on') {
								$('#'+lindex+'_'+dvalues+'_switch')[0].selectedIndex = 1;
							} else {
								$('#'+lindex+'_'+dvalues+'_switch')[0].selectedIndex = 0;
							}
							$('#'+lindex+'_'+dvalues+'_switch').slider('refresh');
						}
					} else if(iType == 2) {
						if(vindex == 'state') {
							if(vvalues == 'on') {
								$('#'+lindex+'_'+dvalues+'_switch')[0].selectedIndex = 1;
							} else {
								$('#'+lindex+'_'+dvalues+'_switch')[0].selectedIndex = 0;
							}
							$('#'+lindex+'_'+dvalues+'_switch').slider('refresh');
						}
						if(vindex == 'dimlevel') {
							$('#'+lindex+'_'+dvalues+'_dimmer').val(vvalues);
							$('#'+lindex+'_'+dvalues+'_dimmer').slider('refresh');
						}
					} else if(iType == 3) {
						if(vindex == 'temperature' && $('#'+lindex+'_'+dvalues+'_temp')) {
							vvalues /= Math.pow(10, aDecimals[lindex+'_'+dvalues]);
							$('#'+lindex+'_'+dvalues+'_temp').text(vvalues);
						} else if(vindex == 'humidity' && $('#'+lindex+'_'+dvalues+'_humi')) {
							vvalues /= Math.pow(10, aDecimals[lindex+'_'+dvalues]);
							$('#'+lindex+'_'+dvalues+'_humi').text(vvalues);
						} else if(vindex == 'battery' && $('#'+lindex+'_'+dvalues+'_batt')) {
							if(vvalues == 1) {
								$('#'+lindex+'_'+dvalues+'_batt').removeClass('red').addClass('green');
							} else {
								$('#'+lindex+'_'+dvalues+'_batt').removeClass('green').addClass('red');
							}
						}
					}
				});
			});
		});
	};
}

$(document).ready(function() {
	if($('body').length == 1) {
		$.mobile.showPageLoadingMsg("b", "Connecting...", true);	
		if(typeof MozWebSocket != "undefined") {
			oWebsocket = new MozWebSocket("ws://"+location.host);
		} else if(typeof WebSocket != "undefined") {
			/* The characters after the trailing slash are needed for a wierd IE 10 bug */
			oWebsocket = new WebSocket("ws://"+location.host+'/websocket');
		} else {
			var load = window.setInterval(function() {
				$.get('http://'+location.host+'/config?'+$.now(), function(txt) {
					bConnected = true;
					if(!bSending) {
						var data = $.parseJSON(txt);
						parseData(data);
					}
				}).fail(function() {
					window.clearInterval(load);
					if(bConnected) {
						$.mobile.showPageLoadingMsg("b", "Connection lost", true);
					} else {
						$.mobile.showPageLoadingMsg("b", "Failed to connect", true);
					}
				});
			}, 1000);
		}
		
		if(oWebsocket) {
			oWebsocket.onopen = function(evt) {
				bConnected = true;
				oWebsocket.send("{\"message\":\"request config\"}");
			};
			oWebsocket.onclose = function(evt) {
				if(bConnected) {
					$.mobile.showPageLoadingMsg("b", "Connection lost", true);
				} else {
					$.mobile.showPageLoadingMsg("b", "Failed to connect", true);
				}
			};
			oWebsocket.onerror = function(evt) {
				$.mobile.showPageLoadingMsg("b", "An unexpected error occured", true);
			};
			oWebsocket.onmessage = function(evt) {
				var data = $.parseJSON(evt.data);
				parseData(data);
			}
		}
	}
});