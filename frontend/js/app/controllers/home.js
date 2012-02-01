app.controller.register('home', {
	
	isDefault : true,
	title : 'Home',
	urlTemplate : '/home',
	
	load : function(params) {
		this.db = params.db;
		console.log('controller.home', arguments);
		
		this.ui = app.view.template(this.name, {
			title : this.title,
			global : app.tpl.global
		}, params.viewBase);
		
		this.ui.show();
		this.rebuild();
	},
	
	unload : function() {
		this.ui.destroy();
	},
	
	rebuild : function() {
		var base = this.ui.query('#launcherList');
		base.query('>.launcher').destroy();
		puredom.each(this.db.getValue('launchers') || [], function(launcher) {
			app.view.template('launcher', launcher, base);
		});
	}
	
});