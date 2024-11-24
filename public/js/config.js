class ConfigManager {
    constructor() {
        this.themeSelect = $('#theme');
        this.customThemeSection = $('#customThemeSection');
        
        this.initEventListeners();
    }

    initEventListeners() {
        // Show/hide custom theme section based on theme selection
        this.themeSelect.on('change', () => {
            if (this.themeSelect.val() === 'custom') {
                this.customThemeSection.removeClass('hidden');
            } else {
                this.customThemeSection.addClass('hidden');
            }
            this.updatePreviewStyles();
        });

        // Handle configuration changes
        $('select, input[type="color"], input[type="number"], input[type="text"]').on('change input', 
            () => this.updatePreviewStyles()
        );
    }

    getCurrentConfig() {
        return {
            fontSize: $('#fontSize').val(),
            titleFontSize: $('#titleFontSize').val(),
            backgroundColor: $('#backgroundColor').val(),
            textColor: $('#textColor').val(),
            alignment: $('#alignment').val(),
            verseSpacing: $('#verseSpacing').val(),
            fontFamily: $('#fontFamily').val(),
            theme: $('#theme').val(),
            customTheme: {
                primary: $('#primaryColor').val(),
                secondary: $('#secondaryColor').val(),
                accent: $('#accentColor').val()
            },
            headerText: $('#headerText').val(),
            footerText: $('#footerText').val(),
            slideNumber: $('#slideNumber').is(':checked'),
            titleSlideStyle: $('#titleSlideStyle').val(),
            verseTransition: $('#verseTransition').val(),
            slideMargins: {
                top: $('#marginTop').val(),
                right: $('#marginRight').val(),
                bottom: $('#marginBottom').val(),
                left: $('#marginLeft').val()
            }
        };
    }

    updatePreviewStyles() {
        if (!window.currentPreview) return;

        const config = this.getCurrentConfig();

        // Update preview title
        $('.preview-title').css({
            'color': config.textColor,
            'font-family': config.fontFamily
        });

        // Apply theme-specific styles
        let bgColor = config.backgroundColor;
        if (config.theme === 'dark') {
            bgColor = '#282828';
        } else if (config.theme === 'gradient') {
            bgColor = `linear-gradient(135deg, ${config.customTheme.primary}, ${config.customTheme.secondary})`;
        }

        // Update preview verses
        $('.preview-verse').css({
            'background': bgColor,
            'text-align': config.alignment,
            'padding': `${config.slideMargins.top}rem ${config.slideMargins.right}rem ${config.slideMargins.bottom}rem ${config.slideMargins.left}rem`
        });

        // Update preview lines
        $('.preview-line').css({
            'color': config.textColor,
            'font-family': config.fontFamily,
            'font-size': `${parseInt(config.fontSize) / 2}px`,
            'line-height': config.verseSpacing
        });

        // Update presentation mode if active
        if (window.presentationManager && window.presentationManager.isFullscreen) {
            window.presentationManager.updateSlide(window.presentationManager.currentSlideIndex);
        }
    }
}

// Initialize on document ready
$(document).ready(() => {
    window.configManager = new ConfigManager();
});
