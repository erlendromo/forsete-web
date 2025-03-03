import subprocess
import webbrowser
import threading
import time

def launch_reflex_server():
    """
    This calls the Reflex CLI to start the local development server.
    In production, you might call reflex.build() or reflex.run_prod() 
    if that’s supported in your version of Reflex.
    """
    subprocess.run(["reflex", "run"])

def main():
    # Start the Reflex server in a separate thread so it doesn’t block.
    server_thread = threading.Thread(target=launch_reflex_server, daemon=True)
    server_thread.start()

    # Give the server a brief moment to start up (optional).
    time.sleep(2)

    # Open a browser to localhost:3000.
    webbrowser.open("http://localhost:3000")

if __name__ == "__main__":
    main()
import subprocess
import webbrowser
import threading
import time

def launch_reflex_server():
    """
    This calls the Reflex CLI to start the local development server.
    In production, you might call reflex.build() or reflex.run_prod() 
    if that’s supported in your version of Reflex.
    """
    subprocess.run(["reflex", "run"])

def main():
    # Start the Reflex server in a separate thread so it doesn’t block.
    server_thread = threading.Thread(target=launch_reflex_server, daemon=True)
    server_thread.start()

    # Give the server a brief moment to start up (optional).
    time.sleep(2)

    # Open a browser to localhost:3000.
    webbrowser.open("http://localhost:3000")

if __name__ == "__main__":
    main()
