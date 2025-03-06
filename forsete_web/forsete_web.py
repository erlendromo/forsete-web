"""Homepage for the FORSETE"""

import reflex as rx

from rxconfig import config

uploadId: str = "uploadID"
# MIME type (Multipurpose Internet Mail Extensions)
supportedFileTypes: dict = {
    "application/pdf": [".pdf"],
    "image/png": [".png"],
    "image/jpeg": [".jpg", ".jpeg"],
}


class State(rx.State):
    """The app state."""

    # The file
    file: str

    @rx.event
    async def handle_upload(self, files: list[rx.UploadFile]):
        """
        Handle the upload of file(s).
        Args:
        files: The uploaded files.
        """
        current_file = files[0]
        upload_data = await current_file.read()
        outfile = rx.get_upload_dir() / current_file.filename
        # save the file: write binary
        with outfile.open("wb") as file_object:
            file_object.write(upload_data)
        # update the file var
        self.file = current_file.filename


def index() -> rx.Component:
    # Home page (index)
    return rx.box(
        navbar_searchbar(),
        rx.color_mode.button(position="top-right"),
        # Vertical stack
        rx.vstack(
            rx.heading("Last opp fil/er.", size="9"),
            # File uploader
            rx.center(uploaderArea()),
            inputButtons(),
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
                    rx.heading("FORSETE", size="7", weight="bold"),
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
                    rx.heading("FORSETE", size="6", weight="bold"),
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


def buttonCreator(name: str, color: str, onclick) -> rx.Component:
    """Function for creating button.

    Args:
        name: the name of the button.
        color: the color of the button.
        onclick: the action of the button.
    """
    return rx.button(name, color_scheme=color, on_click=onclick)


def inputButtons() -> rx.Component:
    """Function for organizing submit and cancel button."""
    return rx.cond(
        rx.selected_files(uploadId),  # Only show buttons if files are selected
        rx.hstack(
            buttonCreator(
                name="Submit",
                color="green",
                onclick=State.handle_upload(rx.upload_files(upload_id=uploadId)),
            ),
            buttonCreator(
                name="Clear", 
                color="red", 
                onclick=rx.clear_selected_files(uploadId)
            ),
        ),
        # Return None when no files selected
        None,
    )


def uploaderArea() -> rx.Component:
    """Function for organizing upload area."""
    return rx.upload(
        rx.vstack(rx.button("Select File")),
        width="fit-content",
        border_radius="10px",  # rounded corners
        justify="center",
        align="center",
        id=uploadId,
        accept=supportedFileTypes,
        multiple=False,
    )


app = rx.App()
app.add_page(index)
