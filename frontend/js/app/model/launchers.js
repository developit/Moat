app.model.launchers = (function() {
	var exports = {
		list : function() {
			return app.model.db.getValue('launchers') || [];
		},
		
		get : function(name) {
			var r = false;
			puredom.foreach(exports.list(), function(launcher) {
				if (launcher.name===name) {
					r = launcher;
					return false;
				}
			});
			return r;
		}
	};
	
	return exports;
}());