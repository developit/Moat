app.controller.register('launcher.web', {
	
	title : '{launcher.name} Web Interface{global.appTitle}',
	customUrl : '/launcher/web/{params.name}',
	
	load : function(options) {
		var self = this,
			tpl = {
				global : app.tpl.global
			};
		
		this.params = options.params || {};
		this.launcher = app.model.launchers.get(this.params.name);
		tpl.launcher = this.launcher;
		document.title = tpl.title = puredom.template(this.title, tpl);
		
		this.handlers = {
			back : function() {
				history.go(-1);
				return false;
			},
			reload : function() {
				var frame = self.ui.query('iframe');
				try {
					frame.prop('contentWindow').location.reload();
				} catch(err) {
					frame.prop('src', frame.prop('src'));
				}
			}
		};
		
		this.ui = app.view.template(this.name, tpl, options.viewBase).show();
		this.ui.query('[data-action]').each(function(node) {
			node.on('click', self.handlers[node.attr('data-action')]);
		});
		
		tpl = options = null;
		this._kill = function(){ self=null; };
	},
	
	unload : function() {
		if (this._kill) {
			this._kill();
		}
		this.ui.destroy();
		this.ui = this.handlers = this._kill = null;
	}
	
});