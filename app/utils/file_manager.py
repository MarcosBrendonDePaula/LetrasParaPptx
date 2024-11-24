import os
import time
import threading

class FileManager:
    def __init__(self, base_dir="public/pptx"):
        self.base_dir = base_dir
        self._ensure_directory_exists()

    def _ensure_directory_exists(self):
        """Ensure the pptx directory exists"""
        if not os.path.exists(self.base_dir):
            os.makedirs(self.base_dir)

    def cleanup_file(self, filename, minutes=1):
        """Schedule a file for deletion after specified minutes"""
        def delete_file():
            time.sleep(60 * minutes)
            try:
                file_path = os.path.join(self.base_dir, f"{filename}.pptx")
                if os.path.exists(file_path):
                    os.remove(file_path)
                    print(f"Removed: {filename}")
            except Exception as e:
                print(f"Error removing {filename}: {str(e)}")

        thread = threading.Thread(target=delete_file)
        thread.daemon = True
        thread.start()

    def get_file_path(self, filename):
        """Get the full path for a file"""
        return os.path.join(self.base_dir, f"{filename}.pptx")
