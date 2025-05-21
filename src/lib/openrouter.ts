
interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
  }[];
}

/**
 * Sends a request to the OpenRouter API
 * @param messages Array of messages to send to the API
 * @returns The assistant's response
 */
export async function callOpenRouter(messages: OpenRouterMessage[]): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error("OpenRouter API key is not defined");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "Chat AI App"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-small-3.1-24b-instruct:free",
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }

    const data = await response.json() as OpenRouterResponse;
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    throw new Error("Failed to get response from AI model");
  }
}

/**
 * Creates a streaming request to the OpenRouter API
 * @param messages Array of messages to send to the API
 * @param onChunk Callback for each chunk of the stream
 * @returns Promise that resolves when the stream ends
 */
export async function streamOpenRouter(
  messages: OpenRouterMessage[],
  onChunk: (chunk: string) => void
): Promise<void> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error("OpenRouter API key is not defined");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "Chat AI App"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-small-3.1-24b-instruct:free",
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      
      if (value) {
        buffer += decoder.decode(value, { stream: true });
        
        // Process each line of the buffer
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.trim() === '') continue;
          
          // Remove the "data: " prefix
          const cleanedLine = line.replace(/^data: /, '');
          
          if (cleanedLine === '[DONE]') {
            done = true;
            break;
          }
          
          try {
            const json = JSON.parse(cleanedLine);
            const content = json.choices[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            console.warn('Failed to parse SSE message:', cleanedLine);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error streaming from OpenRouter API:", error);
    throw new Error("Failed to get streaming response from AI model");
  }
}
