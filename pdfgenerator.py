from fpdf import FPDF

class PDFGenerator:
    def __init__(self, font='Arial', font_size=12, orientation='P', unit='mm', format='A4'):
        """
        :param font: Font family (e.g. 'Arial', 'Helvetica')
        :param font_size: Base font size
        :param orientation: Page orientation ('P' for portrait, 'L' for landscape)
        :param unit: Unit of measurement ('mm', 'cm', 'in')
        :param format: Page format ('A4', 'Letter', etc.)
        """
        self.font = font
        self.font_size = font_size
        self.orientation = orientation
        self.unit = unit
        self.format = format

    def generate_pdf(self, text_content, output_path):
        """
        Generates a PDF file from the input text_content.

        :param text_content: The content that you want to place in the PDF.
        :param output_path: Where to save the resulting PDF file.
        :return: The path to the generated PDF.
        """
        pdf = FPDF(self.orientation, self.unit, self.format)
        pdf.add_page()
        pdf.set_font(self.font, size=self.font_size)

        # Split by lines and add each line to PDF
        lines = text_content.split("\n")
        for line in lines:
            pdf.multi_cell(0, 10, line)
            pdf.ln(2)

        pdf.output(output_path)
        return output_path
    
    def create_pdf_from_text(self, text):
        self.generate_pdf(text, "outputs/output.pdf")
        return None

    
    