var app = (function() {
	var exports = {
			view : new puredom.ViewManager({
				init : true
			}),
			controller : new puredom.ControllerManager({
				singular : true,
				allowLoadDefault : false,
				init : true
			}),
			ui : {},
			tpl : {
				global : {}
			}
		},
		priv = {
			config : {
				appName : 'Moat',
				appVersion : '0.1'
			}
		};
	
	exports.init = function() {
		priv.gatherViews();
		console.log('app', exports);
		
		priv.initUI();
		
		puredom.extend(exports.controller.controllerOptions, {
			viewBase : exports.ui.base.query('#viewBase')
		});
		
		exports.controller.load('home');
	};
	
	priv.initUI = function() {
		puredom.extend(exports.tpl.global, priv.config);
		exports.ui.base = puredom('#app');
		exports.ui.base.template(priv.config);
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