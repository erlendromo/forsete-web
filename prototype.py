import gradio as gr
import subprocess


def buttonCreator(text, style, path):
    button = gr.Button(
        value=text,
        variant=[style],
        icon=path
    )
    return button

def callHtrFlow(image_path):
    """
    Calls: htrflow pipeline <pipeline_path> <image_path>
    """
    command = ["htrflow", "pipeline", "model/pipeline.yaml", image_path]
    print(f"Executing: {' '.join(command)}")
    subprocess.run(command, check=True)

with gr.Blocks() as demo:
    gr.Markdown("# Prototype")
    with gr.Row():
        # Left column
        with gr.Column():
            gr.Markdown("## Input") 
            input=gr.Image(type="filepath")
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

    submit.click(fn=callHtrFlow, inputs=input, outputs=output)
    
demo.launch()
