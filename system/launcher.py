import hashlib
import json

class LauncherManager(object):
	
	def __init__(self):
		self._launchers = {}
	
	def has(self, id):
		return id in self._launchers
	
	def add(self, name, path, args=[]):
		""" Instantiate and manage a new Launcher from the given parameters. """
		
		launcher = Launcher(name, path, args)
		if launcher.get_id() in self._launchers:
			return self._launchers[launcher.get_id()]
		
		self._launchers[launcher.get_id()] = launcher
		
		return launcher
	
	def list(self):
		return self._launchers.values()
	
	def get(self, id):
		if not id in self._launchers:
			return None
		
		return self._launchers[id]
	
	def remove(self, id):
		if not id in self._launchers:
			return None
		
		del self._launchers[id]
	
	def run(self, id):
		if not id in self._launchers:
			return None
		
		print "Pretending to run '%s'" % (self._launchers[id].get_path())

class Launcher(object):
	
	def __init__(self, name, path, args=[]):
		self._name = name
		self._path = path
		self._args = args
		
		self._id = hashlib.sha1(json.dumps({"name":name, "path":path, "args":args})).hexdigest()
	
	def get_id(self):
		return self._id
	
	def get_name(self):
		return self._name
	
	def set_name(self, name):
		self._name = name
	
	def get_path(self):
		return self._path
	
	def set_path(self, path):
		self._path = path
	
	def get_args(self):
		return self._args
	
	def set_args(self, args):
		self._args = args
	
	def get_dict(self):
		return {
			"id": self._id,
			"name": self._name,
			"path": self._path,
			"args": self._args
		}