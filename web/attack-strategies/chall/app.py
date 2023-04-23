import os
from flask import *

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():

	cookie = request.cookies.get('show_hidden')
	folder_path = 'strategies'

	folder_names = []
	if not cookie or cookie != 'true':
		for i in os.listdir(folder_path):
			if ".txt" in i:
				continue
			folder_names.append(i)
	else:
		for i in os.listdir(folder_path):
			folder_names.append(i)

	selected_folder = request.form.get('folder_select')
	file_names = []
	selected_file_name = ''
	selected_file_content = ''

	if not cookie:
		response = make_response(render_template('index.html', folder_names=folder_names, file_names=file_names, selected_folder=selected_folder, selected_file_name=selected_file_name, selected_file_content=selected_file_content))
		response.set_cookie('show_hidden', 'false')
		return response

	print(cookie)

	if selected_folder:
		selected_folder_path = os.path.join(folder_path, selected_folder)
		file_names = os.listdir(selected_folder_path)
		selected_file_name = request.form.get('file_select')
		if selected_file_name:
			selected_file_path = os.path.join(selected_folder_path, selected_file_name)
			with open(selected_file_path, 'r') as f:
				selected_file_content = f.read()

	return render_template('index.html', folder_names=folder_names, file_names=file_names, selected_folder=selected_folder, selected_file_name=selected_file_name, selected_file_content=selected_file_content)

@app.route('/files/<folder>')
def get_files(folder):
	folder_path = os.path.join('strategies', folder)
	file_names = os.listdir(folder_path)
	return jsonify(file_names)

if __name__ == '__main__':
	app.run(debug=True)
