import gradio as gr

with gr.Blocks() as demo:
    gr.Markdown("#MVP")

def callHtrFlow(image):
    return image

demo = gr.Interface(
    fn=callHtrFlow,
    inputs=gr.Image(),
    outputs=gr.JSON(),
)

demo.launch()
