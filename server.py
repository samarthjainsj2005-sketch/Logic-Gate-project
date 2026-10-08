"""
Logic Gates — Local & Public Sharing Server
Run this script to host and share the website with others!
"""

import http.server
import socket
import socketserver
import sys
import webbrowser
import os

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def get_local_ip():
    """Detects the machine's local Wi-Fi / LAN IP address."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    # Disable noisy logging of static asset GET requests
    def log_message(self, format, *args):
        if "200" not in args[1]:  # only log non-200 requests or errors
            super().log_message(format, *args)

def main():
    local_ip = get_local_ip()
    os.chdir(DIRECTORY)

    # Allow immediate socket reuse on restart
    socketserver.TCPServer.allow_reuse_address = True

    try:
        with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
            print("\n" + "=" * 65)
            print("   ⚡ LOGIC GATES — WEB SERVER IS RUNNING!")
            print("=" * 65)
            print(f"\n1. On this computer:")
            print(f"   👉 http://localhost:{PORT}")
            print(f"\n2. Share with friends/phones on the SAME Wi-Fi network:")
            print(f"   👉 http://{local_ip}:{PORT}")
            print(f"\n3. Share over the internet (anywhere in the world):")
            print(f"   Run this in a second terminal to generate a public link:")
            print(f"   👉 ssh -R 80:localhost:{PORT} nokey@localhost.run")
            print("=" * 65)
            print("Press Ctrl + C to stop the server.\n")

            if "--open" in sys.argv:
                webbrowser.open(f"http://localhost:{PORT}")

            httpd.serve_forever()

    except OSError as e:
        if e.errno in (98, 10048):
            print(f"\n[!] Port {PORT} is already in use by a running instance.")
            print(f"    Open in your browser: http://localhost:{PORT}")
            print(f"    Or share on your Wi-Fi: http://{local_ip}:{PORT}\n")
        else:
            raise e
    except KeyboardInterrupt:
        print("\n[+] Server stopped successfully.")

if __name__ == "__main__":
    main()
