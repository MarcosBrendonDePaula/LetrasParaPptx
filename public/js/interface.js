class InterfaceManager {
    constructor() {
        this.initializeGroups();
        this.initializeTooltips();
        this.initializeThemeControls();
        this.initializePreviewControls();
        this.initializeQuickSettings();
        this.initializeMarginControls();
    }

    initializeGroups() {
        // Inicializa todos os grupos como minimizados exceto o primeiro
        $('.config-group').each((index, group) => {
            const content = $(group).find('.group-content');
            const toggle = $(group).find('.group-toggle');
            if (index !== 0) {
                content.hide();
                toggle.addClass('collapsed');
            }
            
            toggle.on('click', () => {
                content.slideToggle(200);
                toggle.toggleClass('collapsed');
                const icon = toggle.find('.toggle-icon');
                icon.toggleClass('bi-chevron-down bi-chevron-right');
            });
        });
    }

    initializeTooltips() {
        // Inicializa tooltips em elementos com data-tooltip
        $('[data-tooltip]').each((_, element) => {
            const tooltip = $(element).data('tooltip');
            $(element).attr('title', tooltip);
        });
    }

    initializeThemeControls() {
        // Atualiza preview de cores quando mudam
        $('#backgroundColor, #textColor').on('input', (e) => {
            this.updatePreviewColors();
        });

        // Presets de cores
        $('.color-preset').on('click', (e) => {
            const button = $(e.currentTarget);
            const color = button.data('color');
            const input = button.closest('div').find('input[type="color"]');
            input.val(color).trigger('input');
        });

        // Sincroniza controles de range com inputs numéricos
        $('.range-with-number').each((_, group) => {
            const range = $(group).find('input[type="range"]');
            const number = $(group).find('input[type="number"]');
            
            range.on('input', () => number.val(range.val()));
            number.on('input', () => range.val(number.val()));
        });

        // Controle do tema
        $('#theme').on('change', (e) => {
            const theme = $(e.target).val();
            $('#customThemeSection').toggleClass('hidden', theme !== 'custom');
            
            if (theme === 'dark') {
                $('#backgroundColor').val('#000000');
                $('#textColor').val('#FFFFFF');
            } else if (theme === 'default') {
                $('#backgroundColor').val('#FFFFFF');
                $('#textColor').val('#000000');
            }
            this.updatePreviewColors();
        });
    }

    initializePreviewControls() {
        let currentZoom = 100;
        const previewBox = $('#previewBox');
        
        $('#zoomInBtn').on('click', () => {
            currentZoom = Math.min(currentZoom + 10, 200);
            previewBox.css('font-size', `${currentZoom}%`);
        });

        $('#zoomOutBtn').on('click', () => {
            currentZoom = Math.max(currentZoom - 10, 50);
            previewBox.css('font-size', `${currentZoom}%`);
        });
    }

    initializeQuickSettings() {
        // Botões de tema rápido
        $('.quick-theme').on('click', (e) => {
            const theme = $(e.currentTarget).data('theme');
            if (theme === 'light') {
                $('#backgroundColor').val('#FFFFFF');
                $('#textColor').val('#000000');
            } else if (theme === 'dark') {
                $('#backgroundColor').val('#000000');
                $('#textColor').val('#FFFFFF');
            }
            this.updatePreviewColors();
        });

        // Botão de reset
        $('#resetBtn').on('click', () => {
            // Reset dos valores para o padrão
            $('#theme').val('default');
            $('#backgroundColor').val('#FFFFFF');
            $('#textColor').val('#000000');
            $('#fontFamily').val('Calibri');
            $('#fontSize').val('34');
            $('#titleFontSize').val('44');
            $('#alignment').val('center');
            $('#verseSpacing').val('1.0');
            $('input[name^="slideMargins"]').val('1');
            $('#headerText, #footerText').val('');
            $('#slideNumber').prop('checked', true);
            $('#titleSlideStyle').val('simple');
            $('#verseTransition').val('none');

            // Atualiza ranges
            $('input[type="range"]').each((_, range) => {
                const number = $(range).closest('.range-with-number').find('input[type="number"]');
                $(range).val(number.val());
            });

            // Atualiza preview
            this.updatePreviewColors();
        });
    }

    initializeMarginControls() {
        // Botão de igualar margens
        $('#equalMarginsBtn').on('click', () => {
            const topMargin = $('#marginTop').val();
            $('input[name^="slideMargins"]').val(topMargin);
        });
    }

    updatePreviewColors() {
        const backgroundColor = $('#backgroundColor').val();
        const textColor = $('#textColor').val();
        const previewBox = $('#previewBox');
        
        previewBox.css({
            'background-color': backgroundColor,
            'color': textColor
        });
    }
}

// Initialize on document ready
$(document).ready(() => {
    window.interfaceManager = new InterfaceManager();
});
