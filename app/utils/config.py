class ConfigManager:
    @staticmethod
    def get_available_configs():
        """Get all available configuration options"""
        return {
            # Theme settings
            'theme': {
                'type': 'select',
                'options': [
                    {'value': 'default', 'label': 'Padrão'},
                    {'value': 'dark', 'label': 'Escuro'},
                    {'value': 'gradient', 'label': 'Gradiente'},
                    {'value': 'custom', 'label': 'Personalizado'}
                ],
                'default': 'default'
            },
            'customTheme': {
                'type': 'object',
                'properties': {
                    'primary': {'type': 'color', 'default': '#007bff'},
                    'secondary': {'type': 'color', 'default': '#6c757d'},
                    'accent': {'type': 'color', 'default': '#28a745'}
                }
            },
            
            # Font settings
            'fontSize': {
                'type': 'number',
                'min': 12,
                'max': 72,
                'default': 34
            },
            'titleFontSize': {
                'type': 'number',
                'min': 16,
                'max': 96,
                'default': 44
            },
            'fontFamily': {
                'type': 'text',
                'default': 'Calibri'
            },
            
            # Color settings
            'backgroundColor': {
                'type': 'color',
                'default': '#FFFFFF'
            },
            'textColor': {
                'type': 'color',
                'default': '#000000'
            },
            
            # Layout settings
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
                'type': 'number',
                'min': 0.8,
                'max': 3.0,
                'step': 0.1,
                'default': 1.0
            },
            'slideMargins': {
                'type': 'object',
                'properties': {
                    'top': {'type': 'number', 'min': 0, 'max': 3, 'step': 0.1, 'default': 1},
                    'right': {'type': 'number', 'min': 0, 'max': 3, 'step': 0.1, 'default': 1},
                    'bottom': {'type': 'number', 'min': 0, 'max': 3, 'step': 0.1, 'default': 1},
                    'left': {'type': 'number', 'min': 0, 'max': 3, 'step': 0.1, 'default': 1}
                }
            },
            
            # Header and Footer
            'headerText': {
                'type': 'text',
                'default': ''
            },
            'footerText': {
                'type': 'text',
                'default': ''
            },
            'slideNumber': {
                'type': 'boolean',
                'default': True
            },
            
            # Slide settings
            'titleSlideStyle': {
                'type': 'select',
                'options': [
                    {'value': 'simple', 'label': 'Simples - Apenas Título'},
                    {'value': 'withArtist', 'label': 'Com Nome do Artista'},
                    {'value': 'full', 'label': 'Completo - Título, Artista e Data'}
                ],
                'default': 'simple'
            },
            'verseTransition': {
                'type': 'select',
                'options': [
                    {'value': 'none', 'label': 'Nenhuma'},
                    {'value': 'fade', 'label': 'Desvanecer'},
                    {'value': 'slide', 'label': 'Deslizar'},
                    {'value': 'zoom', 'label': 'Zoom'}
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
                
                elif config_spec['type'] == 'number':
                    try:
                        num_value = float(value)
                        min_val = config_spec.get('min', float('-inf'))
                        max_val = config_spec.get('max', float('inf'))
                        if min_val <= num_value <= max_val:
                            sanitized_config[key] = num_value
                        else:
                            sanitized_config[key] = config_spec['default']
                    except (ValueError, TypeError):
                        sanitized_config[key] = config_spec['default']
                
                elif config_spec['type'] == 'text':
                    sanitized_config[key] = str(value) if value is not None else config_spec['default']
                
                elif config_spec['type'] == 'boolean':
                    if isinstance(value, bool):
                        sanitized_config[key] = value
                    elif isinstance(value, str):
                        sanitized_config[key] = value.lower() == 'true'
                    else:
                        sanitized_config[key] = config_spec['default']
                
                elif config_spec['type'] == 'object':
                    sanitized_config[key] = {}
                    for prop_name, prop_spec in config_spec['properties'].items():
                        prop_value = value.get(prop_name) if isinstance(value, dict) else None
                        
                        if prop_spec['type'] == 'color':
                            if isinstance(prop_value, str) and prop_value.startswith('#') and len(prop_value) == 7:
                                sanitized_config[key][prop_name] = prop_value
                            else:
                                sanitized_config[key][prop_name] = prop_spec['default']
                        
                        elif prop_spec['type'] == 'number':
                            try:
                                num_value = float(prop_value)
                                min_val = prop_spec.get('min', float('-inf'))
                                max_val = prop_spec.get('max', float('inf'))
                                if min_val <= num_value <= max_val:
                                    sanitized_config[key][prop_name] = num_value
                                else:
                                    sanitized_config[key][prop_name] = prop_spec['default']
                            except (ValueError, TypeError):
                                sanitized_config[key][prop_name] = prop_spec['default']

        return sanitized_config
