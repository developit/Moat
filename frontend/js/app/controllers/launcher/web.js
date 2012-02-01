app.controller.register('launcher.web', {
	
	isDefault : true,
	title : 'Home',
	urlTemplate : '/launcher/web/{id}',
	
	load : function(params) {
		console.log('controller.launcher.web', arguments);
		
		this.ui = app.view.template(this.name, puredom.extend({
			title : this.title
		}, app.global), params.viewBase);
		this.ui.show();
	},
	
	unload : function() {
		this.ui.destroy();
	}
	
});