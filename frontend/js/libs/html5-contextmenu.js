/*jslint browser: true, devel: true, evil: true, onevar: true, undef: true, eqeqeq: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true */
/**
 *  Cross-Browser HTML5 Context Menu (Partial) Implementation
 */
"use strict";
(function() {
	var styleText,
		head,
		stylesheet,
		addEvent,
		removeEvent,
		fireEvent,
		cancelEvent,
		getElementPosition,
		removeMenu,
		cancelContextMenuEvent,
		commandActionHandler,
		showMenu,
		currentMenu,
		menuOpenTime;
	
	styleText = "menu[type=context]{ z-index:1999; display:none; position:absolute; left:0; top:-9999px; padding:4px 0; margin:1px 0 0 1px; border:1px solid #AAA; background:#F6F6F6; border-radius:5px; -moz-border-radius:5px; -webkit-border-radius:5px; box-shadow:0 3px 20px rgba(0,0,0,0.3); -webkit-box-shadow:0 3px 20px rgba(0,0,0,0.3); -moz-box-shadow:0 3px 20px rgba(0,0,0,0.3); font:15px/1.21 Arial,helvetica,sans; cursor:default; } menu[type=context] command{ background:none; color:#000; display:block; padding:1px 20px; border:none; border-top:1px solid #F6F6F6; border-bottom:1px solid #F6F6F6; cursor:default; } menu[type=context] command:hover{ background:#2A50F4; border-top-color:#6A90FF; border-bottom-color:#1A37D4; color:#FFF; } menu[type=context] command[disabled], menu[type=context] command[disabled]:hover{ color:#999; background:none; border-top-color:#F6F6F6; border-bottom-color:#F6F6F6; } menu[type=context] hr{ display:block; margin:0 2px; font-size:1px; line-height:0; overflow:visible; border:none; border-top:1px solid #D5D5D5; border-bottom:1px solid #FFF; cursor:default; }";
	
	head = document.getElementsByTagName("head");
	if (head && head[0]) {
		stylesheet = document.createElement("style");
		stylesheet.setAttribute("type", "text/css");
		stylesheet.appendChild(document.createTextNode(styleText));
		head[0].appendChild(stylesheet);
	}
	head = null;
	
	
	addEvent = function( obj, type, fn ) {
		if (obj.attachEvent) {
			obj['e'+type+fn] = fn;
			obj[type+fn] = function(){obj['e'+type+fn]( window.event );};
			obj.attachEvent('on'+type, obj[type+fn]);
		}
		else {
			obj.addEventListener(type, fn, false);
		}
	};
	removeEvent = function( obj, type, fn ) {
		if (obj.detachEvent) {
			obj.detachEvent('on'+type, obj[type+fn]);
			obj[type+fn] = null;
		}
		else {
			obj.removeEventListener(type, fn, false);
		}
	};
	
	fireEvent = function (options) {
		var evt, rval, p, preventDefault;
		options = options || {};
		if (document.createEventObject) {		// IE
			evt = document.createEventObject();
			for (p in options) {
				if (options.hasOwnProperty(p)) {
					evt[p] = options[p];
				}
			}
			rval = options.target.fireEvent('on'+options.type.toLowerCase().replace(/^on/,''), evt);
			preventDefault = evt.preventDefault===true;
		}
		else {									// Firefox
			evt = document.createEvent("HTMLEvents");
			evt.initEvent(options.type.toLowerCase().replace(/^on/,''), true, true);
			for (p in options) {
				if (options.hasOwnProperty(p)) {
					try {
						evt[p] = options[p];
					} catch(err) {}
				}
			}
			rval = !options.target.dispatchEvent(evt);
			preventDefault = evt.preventDefault===true;
		}
		
		return {
			evt				: evt,
			preventDefault	: preventDefault,
			rval			: rval
		};
	};
	
	cancelEvent = function(e) {
		e = e || window.event;
		e.preventDefault && e.preventDefault();
		e.stopPropagation && e.stopPropagation();
		e.cancelBubble = true;
		e.returnValue = false;
		return false;
	};
	
	getElementPosition = function(el) {
		var pos = {x:0,y:0};
		do {
			pos.x += parseFloat(el.offsetLeft) || 0;
			pos.y += parseFloat(el.offsetTop) || 0;
		} while ((el=el.parentNode) && el!==document.body);
		return pos;
	};
	
	removeMenu = function() {
		var children, x;
		if (currentMenu && (new Date().getTime()-menuOpenTime)>400) {
			currentMenu.style.display = "none";
			currentMenu.style.top = "-9999px";
			currentMenu.style.left = "0";
			if (currentMenu.__parent) {
				currentMenu.__parent.appendChild(currentMenu);
				delete currentMenu.__parent;
			}
			children = currentMenu.childNodes;
			for (x=0; x<children.length; x++) {
				if ((children[x].nodeName+"").toLowerCase()==="command" && children[x].__action) {
					removeEvent(children[x], "mouseup", children[x].__action);
					delete children[x].__action;
				}
				if (children[x].__labelText) {
					children[x].removeChild(children[x].__labelText);
					delete children[x].__labelText;
				}
			}
			currentMenu = null;
			return false;
		}
	};
	
	cancelContextMenuEvent = function(e) {
		e = e || window.event;
		var target = e.target || e.srcElement,
			button = e.button || e.which,
			cmenu;
		if (button===2) {
			while (!cmenu && target.parentNode && target!==document.body) {
				if (target && target.getAttribute && target.getAttribute("contextmenu")) {
					cmenu = document.getElementById(target.getAttribute("contextmenu"));
				}
				if (!cmenu) {
					target = target.parentNode;
				}
			}
			if (cmenu) {
				return cancelEvent(e);
			}
		}
	};
	
	commandActionHandler = function(e) {
		e = e || window.event;
		/*
		if (this.getAttribute("onclick")) {
			eval('(function(){'+this.getAttribute("onclick")+'})');
		}
		*/
		if (e.button===2 || e.which===2) {
			fireEvent({
				type : "click",
				target : this,
				pageX : e.pageX || e.clientX,
				pageY : e.pageY || e.clientY
			});
		}
		setTimeout(removeMenu, 10);
		return cancelEvent(e);
	};
	
	showMenu = function(e) {
		e = e || window.event;
		var target = e.target || e.srcElement,
			pageX = e.pageX || e.clientX,
			pageY = e.pageY || e.clientY,
			button = e.button || e.which,
			cmenu, attr,
			targetButtonOverride,
			menuShown = false,
			hitMenu = false,
			hitCmenu = false,
			pos, children, x, width, height, posX, posY;
		
		do {
			attr = target.getAttribute("contextmenu");
			cmenu = attr && document.getElementById(attr);
			if (cmenu) {
				hitCmenu = true;
				break;
			}
			else if ((target.nodeName+"").toLowerCase()==="menu" && target.getAttribute("type")==="context") {
				hitMenu = true;
				break;
			}
		} while ((target=target.parentNode) && target!==document.body);
		
		targetButtonOverride = hitCmenu && (/^(on|yes|true|1)$/gim).test(target.getAttribute('data-contextmenu-onclick') || '');
		
		if (button===2 || targetButtonOverride) {
			menuOpenTime = 0;
			removeMenu();
			
			if (hitCmenu && cmenu) {
				fireEvent({
					type	: "show",
					target	: cmenu
				});
				if (cmenu.parentNode!==document.body) {
					cmenu.__parent = cmenu.parentNode;
					document.body.appendChild(cmenu);
				}
				pos = getElementPosition(cmenu.parentNode);
				children = cmenu.childNodes;
				for (x=0; x<children.length; x++) {
					if ((children[x].nodeName+"").toLowerCase()==="command") {
						//addEvent(children[x], "mousedown", cancelEvent);
						addEvent(children[x], "mouseup", commandActionHandler);
						/*
						children[x].__action = children[x].action || (children[x].getAttribute("action") && eval('(function(){'+children[x].getAttribute("action")+'})'));
						if (children[x].__action && !(children[x].getAttribute("disabled")+"").match(/^(disabled|true)?$/gim)) {
							addEvent(children[x], "mouseup", children[x].__action);
						}
						*/
						children[x].__labelText = children[x].appendChild(document.createTextNode(children[x].getAttribute('label') || children[x].label));
					}
				}
				cmenu.style.left = '0';
				cmenu.style.top = '-999em';
				cmenu.style.display = "inline-block";
				width = cmenu.offsetWidth;
				height = cmenu.offsetHeight;
				posX = Math.max(0, Math.min(document.body.offsetWidth-width-10, pageX-pos.x));
				//posX = Math.max(0, pageX-pos.x);
				posY = Math.max(0, pageY-pos.y);
				//if ((posX+width) > document.body.offsetWidth) {
					//posX -= width;
				//}
				if ((posY+height+10) > document.body.offsetHeight) {
					posY -= height+10;
				}
				//posX = Math.max(0, Math.min(document.body.offsetWidth-width-10, pageX-pos.x));
				//posY = Math.max(0, Math.min(document.body.offsetHeight-height-10, pageY-pos.y));
				cmenu.style.left = posX + "px";
				cmenu.style.top = posY + "px";
				currentMenu = cmenu;
				menuShown = true;
				menuOpenTime = new Date().getTime();
			}
			
			if (menuShown || hitMenu) {
				return cancelEvent(e);
			}
		}
	};
	
	//addEvent(document, "mousedown", showMenu);
	//addEvent(document, "mouseup", removeMenu);
	
	addEvent(window, "mousedown", showMenu);
	addEvent(window, "contextmenu", cancelContextMenuEvent);
	addEvent(window, "mouseup", removeMenu);
}());