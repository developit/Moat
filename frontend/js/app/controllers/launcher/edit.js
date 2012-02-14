app.controller.register('launcher.edit', {
	
	title : 'Edit {launcher.name}{global.appTitle}',
	customUrl : '/launcher/edit/{name}',
	
	load : function(options) {
		console.log('controller.'+this.name, arguments);
		var self = this,
			tpl = {
				global : app.tpl.global
			};
		
		this.params = options.params || {};
		this.launcher = app.model.launchers.get(options.params.name);
		tpl.launcher = this.launcher;
		document.title = tpl.title = puredom.template(this.title, tpl);
		
		this.ui = app.view.template(this.name, tpl, options.viewBase).show();
		
		this.handlers = {
		};
		
		tpl = options = null;
		this._kill = function(){ self=null; };
	},
	
	unload : function() {
		if (this._kill) {
			this._kill();
		}
		this.ui.destroy();
		this.ui = this._kill = null;
	}
	
});