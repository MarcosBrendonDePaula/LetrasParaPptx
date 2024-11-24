class ConfigManager:
    @staticmethod
    def get_available_configs():
        """Get all available configuration options"""
        return {
            'fontSize': {
                'type': 'select',
                'options': [
                    {'value': '28', 'label': 'Pequeno (28pt)'},
                    {'value': '34', 'label': 'Médio (34pt)'},
                    {'value': '40', 'label': 'Grande (40pt)'},
                    {'value': '48', 'label': 'Extra Grande (48pt)'}
                ],
                'default': '34'
            },
            'titleFontSize': {
                'type': 'select',
                'options': [
                    {'value': '44', 'label': 'Normal (44pt)'},
                    {'value': '52', 'label': 'Grande (52pt)'},
                    {'value': '60', 'label': 'Extra Grande (60pt)'}
                ],
                'default': '44'
            },
            'titleSlideStyle': {
                'type': 'select',
                'options': [
                    {'value': 'simple', 'label': 'Simples - Apenas Título'},
                    {'value': 'withArtist', 'label': 'Com Nome do Artista'},
                    {'value': 'full', 'label': 'Completo - Título, Artista e Data'}
                ],
                'default': 'simple'
            },
            'backgroundColor': {
                'type': 'color',
                'default': '#FFFFFF'
            },
            'textColor': {
                'type': 'color',
                'default': '#000000'
            },
            'alignment': {
                'type': 'select',
                'options': [
                    {'value': 'left', 'label': 'Esquerda'},
                    {'value': 'center', 'label': 'Centro'},
                    {'value': 'right', 'label': 'Direita'},
                    {'value': 'justify', 'label': 'Justificado'}
                ],
                'default': 'center'
            },
            'verseSpacing': {
                'type': 'select',
                'options': [
                    {'value': 'compact', 'label': 'Compacto'},
                    {'value': 'normal', 'label': 'Normal'},
                    {'value': 'relaxed', 'label': 'Relaxado'},
                    {'value': 'spacious', 'label': 'Espaçoso'}
                ],
                'default': 'normal'
            },
            'fontFamily': {
                'type': 'select',
                'options': [
                    {'value': 'Calibri', 'label': 'Calibri'},
                    {'value': 'Arial', 'label': 'Arial'},
                    {'value': 'Times New Roman', 'label': 'Times New Roman'},
                    {'value': 'Verdana', 'label': 'Verdana'},
                    {'value': 'Tahoma', 'label': 'Tahoma'}
                ],
                'default': 'Calibri'
            },
            'transition': {
                'type': 'select',
                'options': [
                    {'value': 'none', 'label': 'Nenhuma'},
                    {'value': 'fade', 'label': 'Desvanecer'},
                    {'value': 'push', 'label': 'Empurrar'},
                    {'value': 'wipe', 'label': 'Limpar'}
                ],
                'default': 'none'
            }
        }

    @staticmethod
    def validate_config(config):
        """Validate and sanitize configuration values"""
        available_configs = ConfigManager.get_available_configs()
        sanitized_config = {}

        for key, value in config.items():
            if key in available_configs:
                config_spec = available_configs[key]
                
                if config_spec['type'] == 'select':
                    valid_values = [opt['value'] for opt in config_spec['options']]
                    sanitized_config[key] = value if value in valid_values else config_spec['default']
                
                elif config_spec['type'] == 'color':
                    # Basic hex color validation
                    if isinstance(value, str) and value.startswith('#') and len(value) == 7:
                        sanitized_config[key] = value
                    else:
                        sanitized_config[key] = config_spec['default']

        return sanitized_config
