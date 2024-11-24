class PresentationManager {
    constructor() {
        this.presentationMode = $('#presentationMode');
        this.slideContent = $('#slideContent');
        this.presentationBtn = $('#presentationBtn');
        this.currentSlideIndex = 0;
        this.slides = [];
        this.isFullscreen = false;
        
        this.initEventListeners();
    }

    initEventListeners() {
        // Handle presentation mode
        this.presentationBtn.on('click', () => {
            if (!window.currentPreview) return;
            this.currentSlideIndex = 0;
            this.presentationMode.removeClass('hidden');
            this.updateSlide(this.currentSlideIndex);
            this.toggleFullscreen();
        });

        // Handle keyboard navigation
        $(document).on('keydown', (e) => {
            if (!this.isFullscreen) {
                if (e.key === 'F11') {
                    e.preventDefault();
                    this.presentationBtn.click();
                }
                return;
            }

            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    if (this.currentSlideIndex < this.slides.length - 1) {
                        this.currentSlideIndex++;
                        this.updateSlide(this.currentSlideIndex);
                    }
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    if (this.currentSlideIndex > 0) {
                        this.currentSlideIndex--;
                        this.updateSlide(this.currentSlideIndex);
                    }
                    break;
                case 'Escape':
                    this.presentationMode.addClass('hidden');
                    break;
            }
        });

        // Handle fullscreen change
        $(document).on('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                this.presentationMode.addClass('hidden');
                this.isFullscreen = false;
            }
        });
    }

    prepareSlides(preview) {
        this.slides = [];
        // Add title slide
        this.slides.push({
            type: 'title',
            content: preview.lyrics.title,
            artist: preview.lyrics.artist
        });
        // Add verse slides
        preview.lyrics.verses.forEach(verse => {
            this.slides.push({
                type: 'verse',
                content: verse
            });
        });
    }

    updateSlide(index) {
        const config = window.configManager.getCurrentConfig();
        const slide = this.slides[index];
        let html = '';

        // Apply theme-specific background
        let bgColor = config.backgroundColor;
        if (config.theme === 'dark') {
            bgColor = '#282828';
        } else if (config.theme === 'gradient') {
            bgColor = `linear-gradient(135deg, ${config.customTheme.primary}, ${config.customTheme.secondary})`;
        }

        if (slide.type === 'title') {
            html = `
                <div class="slide-content" style="
                    color: ${config.textColor};
                    font-family: ${config.fontFamily};
                    text-align: ${config.alignment};
                    background: ${bgColor};
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                ">
                    <h1 style="font-size: ${parseInt(config.fontSize) * 1.5}px; margin-bottom: 1rem;">
                        ${slide.content}
                    </h1>
                    ${slide.artist ? `<h2 style="font-size: ${parseInt(config.fontSize)}px;">${slide.artist}</h2>` : ''}
                </div>
            `;
        } else {
            html = `
                <div class="slide-content" style="
                    color: ${config.textColor};
                    font-family: ${config.fontFamily};
                    text-align: ${config.alignment};
                    background: ${bgColor};
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                ">
                    ${slide.content.map(line => 
                        `<p style="
                            font-size: ${config.fontSize}px;
                            line-height: ${config.verseSpacing};
                            margin: 0.5rem 0;
                        ">${line}</p>`
                    ).join('')}
                </div>
            `;
        }

        this.slideContent.html(html);
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.presentationMode.get(0).requestFullscreen();
            this.isFullscreen = true;
        } else {
            document.exitFullscreen();
            this.isFullscreen = false;
        }
    }
}

// Initialize on document ready
$(document).ready(() => {
    window.presentationManager = new PresentationManager();
});
