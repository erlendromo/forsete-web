import gradio as gr

def callHtrFlow(image):
    return image

def buttonCreator(text, style, path):
    button = gr.Button(
        value=text,
        variant=[style],
        icon=path

    )
    return button

with gr.Blocks() as demo:
    gr.Markdown("# Prototype")
    with gr.Row():
        # Left column
        with gr.Column():
            gr.Markdown("## Input") 
            input=gr.Image()
            # Bottom part of column
            with gr.Row():
                cancel = buttonCreator("Cancel", "stop", None)
                submit = buttonCreator("Submit", "secondary", None)
        # Right column
        with gr.Column():
            gr.Markdown("## Output") 
            output=gr.JSON()
            # Bottom part of column
            with gr.Row():
                cancel = buttonCreator("Cancel", "stop", None)
                save = buttonCreator("Save", "secondary", None)
                PDF = buttonCreator("PDF", "huggingface", "pdficon.svg")

demo.launch()
