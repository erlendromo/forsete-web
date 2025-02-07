import gradio as gr
import subprocess
import os


def buttonCreator(text, style, path):
    button = gr.Button(
        value=text,
        variant=[style],
        icon=path
    )
    return button

# Reading and returning filepath to be used in output
def formatImagePath(path):
    # /example.jpg
    filename = os.path.basename(path)
    # removal of ".jpg"
    filename, _ = os.path.splitext(filename)
    # /dir
    folder   = os.path.basename(os.path.dirname(path))
    # /dir/example
    last_two = os.path.join(folder, filename)
    print(last_two)
    return last_two

def callHtrFlow(image_path):
    """
    Calls: htrflow pipeline <pipeline_path> <image_path>
    """
    command = ["htrflow", "pipeline", "model/pipeline.yaml", image_path]
    print(f"Executing: {' '.join(command)}")
    subprocess.run(command, check=True)

    # returning filepath to be used in output
    filename_no_ext = formatImagePath(image_path)
    txt_path = f"outputs/{filename_no_ext}.json"
    print(txt_path)
    # Reading the file
    with open(txt_path, "r") as f:
        text_output = f.read()
        print(text_output)
    
    return text_output


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
            output=gr.Text()
            # Bottom part of column
            with gr.Row():
                cancel = buttonCreator("Cancel", "stop", None)
                save = buttonCreator("Save", "secondary", None)
                PDF = buttonCreator("PDF", "huggingface", "pdficon.svg")

    submit.click(fn=callHtrFlow, inputs=input, outputs=output)
    
demo.launch()
