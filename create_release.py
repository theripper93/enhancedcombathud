import os
import json
import zipfile

# Define selected folders
selected_folders = ['scripts', 'styles', 'assets', 'templates', 'languages', 'packs', 'storage']

def read_module_json():
    with open(file, 'r', encoding='utf-8') as file:
        data = json.load(file)
        module_id = data['id']
        module_version = data['version']
    return module_id, module_version

def create_dist_folder():
    if not os.path.exists('dist'):
        os.makedirs('dist')

def add_folder_to_zip(zip_file, folder):
    if os.path.exists(folder):
        for root, dirs, files in os.walk(folder):
            for file in files:
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, folder)
                zip_file.write(file_path, os.path.join(folder, relative_path))
    else:
        print(f"Warning: {folder} is missing. Skipping.")

def create_zip(module_id, module_version, folders):
    zip_filename = f'dist/{module_id}-{module_version}.zip'
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        zip_file.write('module.json')

        for folder in folders:
            add_folder_to_zip(zip_file, folder)

    print(f"Zip file '{zip_filename}' created successfully.")

def main():
    module_id, module_version = read_module_json()
    create_dist_folder()

    create_zip(module_id, module_version, selected_folders)

if __name__ == "__main__":
    main()