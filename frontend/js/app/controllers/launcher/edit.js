app.controller.register('launcher.edit', {
	
	isDefault : true,
	title : 'Home',
	urlTemplate : '/launcher/edit/{id}',
	
	load : function(params) {
		console.log('controller.launcher.edit', arguments);
		
		this.ui = app.view.template(this.name, puredom.extend({
			title : this.title
		}, app.global), params.viewBase);
		this.ui.show();
	},
	
	unload : function() {
		this.ui.destroy();
	}
	
});