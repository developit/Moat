import tornado
import tornado.web

class LauncherHandler(tornado.web.RequestHandler):
	def initialize(self, launcher_manager):
		self._launcher_manager = launcher_manager

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")

class LauncherAdd(LauncherHandler):
	def post(self):
		name = self.get_argument('name')
		path = self.get_argument('path')
		args = []#self.get_argument('args')
		
		launcher = self._launcher_manager.add(name, path, args)
		
		self.write({
			"success":True,
			"message":"",
			"data":{
				"launcher":launcher.get_dict()
			}
		})

class LauncherGet(LauncherHandler):
	def post(self):
		id = self.get_argument('id')
		if not self._launcher_manager.has(id):
			raise tornado.web.HTTPError(404)
		
		launcher = self._launcher_manager.get(id)
		
		self.write({
			"success":True,
			"message":"",
			"data":{
				"launcher":launcher.get_dict()
			}
		})

class LauncherList(LauncherHandler):
	def post(self):
		self.write({
			"success":True,
			"message":"",
			"data":{
				"launchers": [launcher.get_dict() for launcher in self._launcher_manager.list()]
			}
		})

class LauncherRun(LauncherHandler):
	def post(self):
		id = self.get_argument('id')
		if not self._launcher_manager.has(id):
			raise tornado.web.HTTPError(404)
		
		launcher = self._launcher_manager.get(id)
		
		self.write({
			"message":"Pretending to run %s\n" % (launcher.path),
			"success":True,
			"data":{}
		})

class LauncherRemove(LauncherHandler):
	def post(self):
		id = self.get_argument('id')
		self._launcher_manager.remove(id)
		self.write({
			"message":"",
			"success":True,
			"data":{}
		})