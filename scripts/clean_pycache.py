import os
import shutil

def clean_pycache(directory):
    """Remove all __pycache__ directories"""
    for root, dirs, _ in os.walk(directory):
        for dir in dirs:
            if dir == "__pycache__":
                path = os.path.join(root, dir)
                shutil.rmtree(path)
                print(f"Removed: {path}")

if __name__ == "__main__":
    clean_pycache("src") 