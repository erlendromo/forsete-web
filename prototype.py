import gradio as gr

def callHtrFlow(image):
    return image

def buttonCreator(text, style):
    button = gr.Button(
        value=text,
        variant=[style]
    )
    return button

with gr.Blocks() as demo:
    gr.Markdown("# Prototype")
    with gr.Row():
        # Left column
        with gr.Column():
            input=gr.Image()
            # Bottom part of column
            with gr.Row():
                cancel = buttonCreator("Cancel", "stop")
                submit = buttonCreator("Submit", "secondary")
        # Right column
        with gr.Column():
            output=gr.JSON()
            # Bottom part of column
            with gr.Row():
                cancel = buttonCreator("Cancel", "stop")
                submit = buttonCreator("Submit", "secondary")
                PDF = buttonCreator("PDF", "huggingface")

demo.launch()
