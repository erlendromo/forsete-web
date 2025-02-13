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
    
    @staticmethod
    def generate_pdf(text_content, output_path, font='Arial', font_size=12, orientation='P', unit='mm', format='A4'):
        """
        Generates a PDF file from the input text_content.

        :param text_content: The content that you want to place in the PDF.
        :param output_path: Where to save the resulting PDF file.
        :param font: Font family (default: Arial)
        :param font_size: Font size (default: 12)
        :param orientation: Page orientation ('P' or 'L')
        :param unit: Measurement unit ('mm', 'cm', 'in')
        :param format: Page format ('A4', 'Letter', etc.)
        :return: The path to the generated PDF.
        """
        pdf = FPDF(orientation, unit, format)
        pdf.add_page()
        pdf.set_font(font, size=font_size)


        # Split by lines and add each line to PDF
        lines = text_content.split("\n")
        for line in lines:
            pdf.multi_cell(0, 10, line)
            pdf.ln(2)
        
        return pdf.output(f"{output_path}.pdf")

        #pdf.output(f"outputs/pdf/{output_path}.pdf")
        #print(f"PDF saved at: outputs/{output_path}")



    # def create_pdf_from_text(self, text):
      #  self.generate_pdf(text, "outputs/output.pdf")
       # return None

    
    