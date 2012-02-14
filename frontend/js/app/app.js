var app = (function() {
	var exports = {
			view : new puredom.ViewManager({
				init : true
			}),
			state : new puredom.StateManager({
				adapter : 'url',
				adaptorOptions : {
					html5UrlPrefix : '/rnd/moat/',
					urlMapping : 'controller.current_url',
					/*
					beforeParse : function(url) {
						console.log('beforeParse, "'+url+'"');
						return url;
					},
					*/
					usePreceedingSlash : true
				},
				init : false
			}),
			controller : new puredom.RouteManager({
				singular : true,
				allowLoadDefault : false,
				autoRestoreOnInit : false
			}),
			ui : {},
			tpl : {
				global : {}
			}
		},
		priv = {
			config : {
				appName : 'Moat',
				appTitle : ' | Moat',
				appVersion : '0.1.2'
			}
		};
	
	exports.name = priv.config.appName;
	
	exports.init = function() {
		priv.gatherViews();
		console.log('app', exports);
		
		priv.initUI();
		
		exports.model.use(function() {
			puredom.extend(exports.controller.controllerOptions, {
				viewBase : exports.ui.base.query('#viewBase'),
				db : exports.model.db
			});
			
			exports.state.init({
				restore : true,
				objects : {
					controller : exports.controller
				}
			});
			exports.controller.on('change', priv.handleResize);
			exports.controller.init();
			
			if (!exports.controller.current()) {
				console.log('falling back to default controller');
				exports.controller.loadDefault();
			}
		});
	};
	
	
	priv.initUI = function() {
		puredom.extend(exports.tpl.global, priv.config);
		exports.ui.base = puredom('#app');
		exports.ui.base.template(priv.config);
		puredom(window).on('resize', priv.handleResize);
		priv.handleResize();
	};
	
	
	priv.handleResize = function() {
		exports.ui.base.query('[data-bbox]').each(function(node) {
			var parent = node.parent(),
				h = parent.height({padding:false,border:false}),
				w = parent.width({padding:false,border:false}),
				bbox = node.attr('data-bbox').split(' '),
				//widthMod = node.width({border:true,padding:true}) - node.width({border:false,padding:false}),
				//heightMod = node.height({border:true,padding:true}) - node.height({border:false,padding:false}),
				widthMod = 0,
				heightMod = 0,
				i;
			if (bbox.length===2) {
				bbox = bbox.concat(bbox);
			}
			else if (bbox.length===3) {
				bbox.push(bbox[1]);
			}
			for (i=bbox.length; i--; ) {
				bbox[i] = Math.round(bbox[i]);
			}
			node.css({
				position : 'absolute',
				top : bbox[0] + 'px',
				left : bbox[3] + 'px',
				height : (h - heightMod - bbox[0] - bbox[2]) + 'px',
				width : (w - widthMod - bbox[3] - bbox[1]) + 'px'
			});
		});
	};
	
	
	priv.gatherViews = function() {
		puredom('script[type="text/view-template"]').each(function(n) {
			var t = (n.text() || '').replace(/(^<\!\[CDATA\[|\]\]>$)/gm,'');
			if (t) {
				exports.view.addView(n.attr('data-view-name') || n.attr('name'), t);
			}
		});
	};
	
	return exports;
}());


puredom(app.init);