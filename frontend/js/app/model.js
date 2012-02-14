app.model = (function() {
	var exports = puredom.extend(new puredom.EventEmitter(), {
			loaded : false
		});
	
	exports.db = new puredom.LocalStorage(app.name, function() {
		exports.loaded = true;
		exports._fireEvent('load');
	});
	
	exports.use = function(callback) {
		if (exports.loaded) {
			callback();
		}
		else {
			exports.on('load', callback);
		}
	};
	
	exports.api = new puredom.NativeAPI({
		root : './',
		endpoints : {
			launchers : {
				list : {
					endpoint : 'launchers/list',
					params : {},
					type : 'jsonp'
				},
				
				add : {
					endpoint : 'launchers/add',
					params : {},
					type : 'jsonp'
				},
				
				remove : {
					endpoint : 'launchers/remove',
					params : {},
					type : 'jsonp'
				}
			}
		}
	});
	
	return exports;
}());