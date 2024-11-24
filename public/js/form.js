class FormManager {
    constructor() {
        this.form = $('#pptxForm');
        this.loadingIndicator = $('#loadingIndicator');
        
        this.initEventListeners();
    }

    initEventListeners() {
        this.form.on('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        const link = $('#link').val();
        if (!link.includes('letras.')) {
            alert('Por favor, insira um link válido do site letras.com');
            return false;
        }
        
        this.loadingIndicator.removeClass('hidden');
        
        // Create form data
        const formData = new FormData(this.form[0]);
        
        // Use XMLHttpRequest to handle binary data
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/gen', true);
        xhr.responseType = 'blob';
        
        xhr.onload = () => {
            this.loadingIndicator.addClass('hidden');
            
            if (xhr.status === 200) {
                // Get filename from response headers if available
                const disposition = xhr.getResponseHeader('Content-Disposition');
                let filename = 'presentation.pptx';
                if (disposition && disposition.indexOf('filename') !== -1) {
                    filename = disposition.split('filename=')[1].replace(/['"]/g, '');
                }
                
                // Create blob and download
                const blob = new Blob([xhr.response], {
                    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                });
                this.downloadFile(blob, filename);
            } else {
                // Handle error
                const reader = new FileReader();
                reader.onload = function() {
                    try {
                        const error = JSON.parse(this.result);
                        alert(error.error || 'Erro ao gerar apresentação');
                    } catch (e) {
                        alert('Erro ao gerar apresentação');
                    }
                };
                reader.readAsText(xhr.response);
            }
        };
        
        xhr.onerror = () => {
            this.loadingIndicator.addClass('hidden');
            alert('Erro ao gerar apresentação. Por favor, tente novamente.');
        };
        
        xhr.send(formData);
    }

    downloadFile(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
}

// Initialize on document ready
$(document).ready(() => {
    window.formManager = new FormManager();
});
