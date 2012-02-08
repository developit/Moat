import system, system.launcher
import server
import os

def start_moat(server_root, port):
	manager = system.launcher.LauncherManager()
	moat = server.Server(server_root, port, {"launcher_manager":manager})
	moat.start()

if __name__ == "__main__":
	start_moat(os.path.join(os.path.dirname(__file__), "frontend"), 8888)