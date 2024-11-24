from flask import Flask, jsonify, render_template, request, redirect, send_file
from app.utils.scraper import LyricsScraper
from app.utils.presentation import PresentationGenerator
from app.utils.file_manager import FileManager
from app.utils.config import ConfigManager
import os

app = Flask('flaskapp', static_url_path='/', static_folder='public')

# Initialize components
scraper = LyricsScraper()
presentation_generator = PresentationGenerator()
file_manager = FileManager()
config_manager = ConfigManager()

@app.route("/preview", methods=['POST'])
def preview_lyrics():
    try:
        data = request.json
        link = data.get('link')
        config = data.get('config', {})
        
        if not link:
            return jsonify({'error': 'Link não fornecido'}), 400
            
        # Get lyrics
        html = scraper.load_page(link)
        lyrics_data = scraper.get_lyrics(html)
        
        if not lyrics_data:
            return jsonify({'error': 'Erro ao obter letra'}), 400
        
        # Validate config
        sanitized_config = config_manager.validate_config(config)
            
        return jsonify({
            'lyrics': lyrics_data,
            'config': sanitized_config
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/gen", methods=['POST'])
def generate_pptx():
    try:
        # Get lyrics
        link = request.form.get('link')
        if not link:
            return jsonify({'error': 'Link não fornecido'}), 400
            
        html = scraper.load_page(link)
        lyrics_data = scraper.get_lyrics(html)
        
        if not lyrics_data:
            return jsonify({'error': 'Erro ao obter letra'}), 400
        
        # Get and validate config
        config = {
            'fontSize': request.form.get('fontSize'),
            'titleFontSize': request.form.get('titleFontSize'),
            'titleSlideStyle': request.form.get('titleSlideStyle'),
            'backgroundColor': request.form.get('backgroundColor'),
            'textColor': request.form.get('textColor'),
            'alignment': request.form.get('alignment'),
            'verseSpacing': request.form.get('verseSpacing'),
            'fontFamily': request.form.get('fontFamily'),
            'transition': request.form.get('transition')
        }
        
        sanitized_config = config_manager.validate_config(config)
        
        # Generate presentation
        filename = presentation_generator.create_pptx(lyrics_data, sanitized_config)
        
        # Get the full file path
        file_path = os.path.join('public', 'pptx', f'{filename}.pptx')
        
        # Send file directly in response
        return send_file(
            file_path,
            as_attachment=True,
            download_name=f'{filename}.pptx',
            mimetype='application/vnd.openxmlformats-officedocument.presentationml.presentation'
        )
        
    except Exception as e:
        print(f"Error generating presentation: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route("/config/options", methods=['GET'])
def get_config_options():
    """Get all available configuration options"""
    return jsonify(config_manager.get_available_configs())

@app.route("/", methods=['GET'])
def index():
    return render_template('index.html')

if __name__ == "__main__":
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', debug=False, port=port)
