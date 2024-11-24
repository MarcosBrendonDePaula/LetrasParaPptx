class PreviewManager {
    constructor() {
        this.previewBtn = $('#previewBtn');
        this.previewBox = $('#previewBox');
        this.presentationBtn = $('#presentationBtn');
        
        this.initEventListeners();
    }

    initEventListeners() {
        this.previewBtn.on('click', () => this.handlePreviewClick());
    }

    handlePreviewClick() {
        const link = $('#link').val();
        if (!link) {
            alert('Por favor, insira um link da letra primeiro.');
            return;
        }
        if (!link.includes('letras.')) {
            alert('Por favor, insira um link válido do site letras.*');
            return;
        }

        this.previewBox.html('<div class="flex justify-center items-center h-full"><div class="loading-spinner w-8 h-8"></div></div>');

        // Get current config
        const config = window.configManager.getCurrentConfig();

        // Make AJAX call to preview endpoint
        $.ajax({
            url: '/preview',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ 
                link: link,
                config: config
            }),
            success: (response) => {
                window.currentPreview = response;
                let previewHtml = `<h3 class="preview-title text-xl font-bold mb-4">${response.lyrics.title}</h3>`;
                
                response.lyrics.verses.forEach(verse => {
                    previewHtml += '<div class="preview-verse mb-4 p-4 rounded">';
                    verse.forEach(line => {
                        previewHtml += `<p class="preview-line">${line}</p>`;
                    });
                    previewHtml += '</div>';
                });

                this.previewBox.html(previewHtml);
                window.configManager.updatePreviewStyles();
                this.presentationBtn.removeClass('hidden');
                window.presentationManager.prepareSlides(response);
            },
            error: (xhr) => {
                let errorMessage = 'Erro ao carregar prévia';
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    errorMessage = xhr.responseJSON.error;
                }
                this.previewBox.html(`<div class="bg-red-50 text-red-500 p-4 rounded-lg">${errorMessage}</div>`);
                this.presentationBtn.addClass('hidden');
            }
        });
    }
}

// Initialize on document ready
$(document).ready(() => {
    window.previewManager = new PreviewManager();
});
