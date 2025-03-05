"""Homepage for the FORSETE"""

import reflex as rx

from rxconfig import config


class State(rx.State):
    """The app state."""

    ...


def index() -> rx.Component:
    # Home page (index)
    return rx.box(
        
        navbar_searchbar(),
        rx.color_mode.button(position="top-right"),
        # Vertical stack
        rx.vstack(
            rx.heading("Last opp fil/er.", size="9"),
            # File uploader
            rx.center(
                rx.upload(
                    rx.vstack(
                        rx.button("Select File")
                    ),
                    width="fit-content",    
                    border_radius="10px",    # rounded corners
                    justify="center",
                    align="center",
                    id="upload"
                ),
            ),
            submit_and_cancel_button(),
            spacing="5",
            justify="center",
            align="center",
            min_height="85vh",
        ),
    )

def navbar_searchbar() -> rx.Component:
    return rx.box(
        rx.desktop_only(
            rx.hstack(
                rx.hstack(
                    # Heading
                    rx.heading(
                        "FORSETE", size="7", weight="bold"
                    ),
                    align_items="center",
                ),
                # Search area
                rx.input(
                    rx.input.slot(rx.icon("search")),
                    placeholder="Search...",
                    type="search",
                    size="2",
                    justify="end",
                ),
                justify="between",
                align_items="center",
            ),
        ),
        rx.mobile_and_tablet(
            rx.hstack(
                rx.hstack(
                    rx.heading(
                        "FORSETE", size="6", weight="bold"
                    ),
                    align_items="center",
                ),
                rx.input(
                    rx.input.slot(rx.icon("search")),
                    placeholder="Search...",
                    type="search",
                    size="2",
                    justify="end",
                ),
                justify="between",
                align_items="center",
            ),
        ),
        bg=rx.color("accent", 3),
        padding="1em",
        # position="fixed",
        # top="0px",
        # z_index="5",
        width="100%",
    )

@rx.event
async def handle_upload(
    self, files: list[rx.UploadFile]):
    """Handle the upload of file(s).

    Args:
        files: The uploaded files.
    """
    for file in files:
        upload_data = await file.read()
        # Joins the directory
        outfile = rx.get_upload_dir() / file.filename
        # Save the file.
        with outfile.open("wb") as file_object:
            file_object.write(upload_data)

        # Update the img var.
        self.img.append(file.filename)

def submit_and_cancel_button():
    return rx.hstack(
         # Clear button
        rx.button("Clear",
              color_scheme="red",
              on_click=rx.clear_selected_files("upload")),

        # Submit button
        rx.button("Submit",
              color_scheme="green",)
    )

app = rx.App()
app.add_page(index)
