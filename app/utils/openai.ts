/**
 * Calls the OpenAI API with the provided prompt
 * @param promptText The text prompt to send to the API
 * @returns The AI's response text or empty string if there's an error
 */
export async function callOpenAI(promptText: string): Promise<string> {
  // Get the API key from localStorage
  const openAiApiKey = localStorage.getItem("OPENAI_API_KEY") || "";
  
  if (!openAiApiKey) {
    alert("Please enter an API key first!");
    return "";
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: promptText }],
        max_tokens: 100,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      console.error("OpenAI API error:", await response.text());
      alert("Error calling OpenAI! Check console for details.");
      return "";
    }

    const data = await response.json();
    const aiText = data.choices[0].message.content.trim();
    return aiText;
  } catch (err) {
    console.error("Error:", err);
    alert("Error calling OpenAI! Check console for details.");
    return "";
  }
}
