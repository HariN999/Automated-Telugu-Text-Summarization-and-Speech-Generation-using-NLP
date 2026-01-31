const BASE_URL = "http://127.0.0.1:8000";

export async function summarizeText(text, method = "tfidf") {

  const response = await fetch(`${BASE_URL}/summarize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text,
      method
    })
  });

  if (!response.ok) {
    throw new Error("Backend error");
  }

  return await response.json();
}
