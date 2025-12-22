# Gemini Integration

To use these protocols with Google Gemini (Web, 1.5 Pro, 2.0 Flash):

1.  **System Instructions**: Copy the contents of `MASTER_PROTOCOL.md` and paste it into Gemini's "System Instructions" or "Custom Instructions" if using the API/Vertex AI.
2.  **Web Context**: Upload `MASTER_PROTOCOL.md` as a file at the start of your session.
3.  **Prompting**: Start your requests with: *"Use the **MASTER_PROTOCOL** to..."* or trigger specific modes like **`DEEPDIVE`**.
4.  **Reference**: For best results, use the optimized markdown files; their lower token count ensures Gemini's context window stays focused on your code.
