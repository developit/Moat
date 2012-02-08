import tornado
import tornado.web
import handlers

class Server(object):
	
	
	def __init__(self, server_root, server_port, handler_options):
		self._server_root = server_root
		self._server_port = server_port
		self._application = tornado.web.Application([
			(r"/launchers/add", handlers.LauncherAdd, handler_options),
			(r"/launchers/get", handlers.LauncherGet, handler_options),
			(r"/launchers/list", handlers.LauncherList, handler_options),
			(r"/launchers/remove", handlers.LauncherRemove, handler_options),
			(r"/launchers/run", handlers.LauncherRun, handler_options),
			(r"/(.*)", tornado.web.StaticFileHandler, dict(path=server_root,default_filename="index.html")),
		], static_path=server_root)
	
	def start(self):
		self._application.listen(self._server_port)
		tornado.ioloop.IOLoop.instance().start()
