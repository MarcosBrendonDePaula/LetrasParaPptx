from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
import random

class PresentationGenerator:
    def __init__(self):
        self.default_config = {
            'fontSize': 34,
            'titleFontSize': 44,
            'titleSlideStyle': 'simple',
            'backgroundColor': '#FFFFFF',
            'textColor': '#000000',
            'alignment': 'center',
            'verseSpacing': 'normal',
            'transition': 'none',
            'template': 'blank',
            'fontFamily': 'Calibri'
        }

    def hex_to_rgb(self, hex_color):
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

    def get_alignment(self, align_str):
        alignments = {
            'left': PP_ALIGN.LEFT,
            'center': PP_ALIGN.CENTER,
            'right': PP_ALIGN.RIGHT,
            'justify': PP_ALIGN.JUSTIFY
        }
        return alignments.get(align_str.lower(), PP_ALIGN.CENTER)

    def create_pptx(self, lyrics_data, config=None):
        if config is None:
            config = {}
        
        # Merge with default config
        config = {**self.default_config, **config}
        
        # Convert colors
        bg_rgb = self.hex_to_rgb(config['backgroundColor'])
        text_rgb = self.hex_to_rgb(config['textColor'])
        
        # Create presentation
        prs = Presentation()
        prs.slide_width = Inches(13.333)
        prs.slide_height = Inches(7.5)

        # Title slide
        title_slide = prs.slides.add_slide(prs.slide_layouts[0])
        title_slide.background.fill.solid()
        title_slide.background.fill.fore_color.rgb = RGBColor(*bg_rgb)
        
        # Title
        title = title_slide.shapes.title
        title.text = lyrics_data['title']
        title_font = title.text_frame.paragraphs[0].font
        title_font.size = Pt(int(config['titleFontSize']))
        title_font.color.rgb = RGBColor(*text_rgb)
        title_font.name = config['fontFamily']

        # Subtitle (Artist)
        if config['titleSlideStyle'] in ['withArtist', 'full']:
            subtitle = title_slide.placeholders[1]
            subtitle.text = lyrics_data['artist']
            subtitle_font = subtitle.text_frame.paragraphs[0].font
            subtitle_font.color.rgb = RGBColor(*text_rgb)
            subtitle_font.name = config['fontFamily']

        # Content slides
        blank_layout = prs.slide_layouts[6]
        alignment = self.get_alignment(config['alignment'])
        
        # Verse spacing
        spacing_map = {
            'compact': 0.8,
            'normal': 1.0,
            'relaxed': 1.2,
            'spacious': 1.5
        }
        line_spacing = spacing_map.get(config['verseSpacing'], 1.0)
        
        # Create slides for verses
        left = top = Inches(1)
        width = Inches(11.333)
        height = Inches(5.5)

        for verse_lines in lyrics_data['verses']:
            slide = prs.slides.add_slide(blank_layout)
            slide.background.fill.solid()
            slide.background.fill.fore_color.rgb = RGBColor(*bg_rgb)
            
            textbox = slide.shapes.add_textbox(left, top, width, height)
            text_frame = textbox.text_frame
            text_frame.word_wrap = True
            
            # Add lines with proper formatting
            for i, line in enumerate(verse_lines):
                paragraph = text_frame.add_paragraph() if i > 0 else text_frame.paragraphs[0]
                paragraph.text = line
                paragraph.font.size = Pt(int(config['fontSize']))
                paragraph.font.color.rgb = RGBColor(*text_rgb)
                paragraph.font.name = config['fontFamily']
                paragraph.alignment = alignment
                paragraph.line_spacing = Pt(int(config['fontSize']) * line_spacing)

        # Generate unique filename
        fname = random.randint(0, 8000)
        file_name = f"{fname}_{lyrics_data['title'].replace(' ', '_')}"
        file_path = f"public/pptx/{file_name}.pptx"
        
        # Save presentation
        prs.save(file_path)
        return file_name
