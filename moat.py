import tornado.ioloop
import tornado.web

import hashlib
import json

launchers = {}

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")

class LauncherAdd(tornado.web.RequestHandler):
	def post(self):
		name = self.get_argument('name')
		path = self.get_argument('path')
		args = []#self.get_argument('args')
		
		hash = hashlib.sha1(path)
		id = hash.hexdigest()
		
		launcher = {
			"id": id,
			"name": name,
			"path": path,
			"args": args
		}
		
		launchers[id] = launcher
		self.write(json.dumps(launcher))

class LauncherList(tornado.web.RequestHandler):
	def post(self):
		self.write(json.dumps(launchers))

class LauncherRun(tornado.web.RequestHandler):
	def post(self):
		id = self.get_argument('id')
		if id not in launchers:
			raise tornado.web.HTTPError(404)
		
		self.write("Pretending to run %s\n" % (launchers[id]['path']))

class LauncherRemove(tornado.web.RequestHandler):
	def post(self):
		id = self.get_argument('id')
		del launchers[id]

application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/launchers/add", LauncherAdd),
    (r"/launchers/list", LauncherList),
    (r"/launchers/remove", LauncherRemove),
    (r"/launchers/run", LauncherRun),
    #(r"/apps/add", AppAdd),
    #(r"/apps/remove", AppRemove),
])

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()