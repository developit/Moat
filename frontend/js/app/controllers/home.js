app.controller.register('home', {
	
	isDefault : true,
	title : 'Home{global.appTitle}',
	customUrl : '/',
	
	load : function(options) {
		var self = this,
			tpl = {
				global : app.tpl.global
			};
		
		this.params = options.params || {};
		document.title = tpl.title = puredom.template(this.title, tpl);
		this.ui = app.view.template(this.name, tpl, options.viewBase).show();
		
		this.handlers = {
			launcherClick : function() {
				self.launch(puredom(this).attr('launcher'));
			},
			launcherMousedown : function(e) {
				if (e.button===2) {
					self.currentLauncher = puredom(this).attr('launcher');
				}
			},
			launcherMenuAction : function() {
				var action = puredom(this).attr('data-action');
				self[action](self.currentLauncher);
			}
		};
		
		this.ui.query('#launcherContextMenu>command').on('click', this.handlers.launcherMenuAction);
		
		this.rebuild();
		
		tpl = options = null;
		this._kill = function(){ self=null; };
	},
	
	
	launch : function(name) {
		var launcher = app.model.launchers.get(name);
		setTimeout(function() {
			alert('Running "'+launcher.name+'" -> ' + launcher.path + ' ' + (launcher.args || []).join(' '));
		}, 100);
	},
	
	webInterface : function(name) {
		var launcher = app.model.launchers.get(name);
		if (launcher.web_url) {
			app.controller.load('launcher.web', {
				params : {
					name : launcher.name
				}
			});
		}
	},
	
	stop : function(name) {
		var launcher = app.model.launchers.get(name);
		setTimeout(function() {
			alert('Stopping "'+launcher.name+'" -> ' + launcher.path + ' ' + (launcher.args || []).join(' '));
		}, 100);
	},
	
	
	unload : function() {
		if (this._kill) {
			this._kill();
		}
		this.ui.destroy();
		this.ui = this._kill = this.handlers = null;
	},
	
	rebuild : function() {
		var base = this.ui.query('#launcherList'),
			self = this;
		base.query('>.launcher').destroy();
		puredom.foreach(app.model.launchers.list(), function(launcher) {
			var ui = app.view.template('launcher', {
				global : app.tpl.global,
				launcher : launcher
			}, base);
			ui.attr('launcher', launcher.name);
			ui.on('click', self.handlers.launcherClick);
			ui.on('mousedown', self.handlers.launcherMousedown);
		});
		self = base = null;
	}
	
});