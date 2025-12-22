# Cline & RooCode Integration

To use these protocols with Cline or RooCode (VS Code Extensions):

1.  **Rule Detection**: Cline/RooCode look for `.clinerules` or `.roocodes` in the root.
2.  **Configuration**: Create the rule file and add:
    ```markdown
    Always follow the instructions in MASTER_PROTOCOL.md.
    Consult specialized protocols (e.g., debug_protocol.md) based on the task.
    ```
3.  **Direct Reference**: Mention the protocols in the chat (e.g., *"Consult accessibility_protocol.md for this UI change"*).
4.  **Custom Instructions**: In settings, point the Custom Instruction field to the local path of `MASTER_PROTOCOL.md`.
