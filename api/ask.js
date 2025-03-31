export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Pas de question." });

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }]
      })
    });

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content;
    res.status(200).json({ reply: reply || "Réponse vide." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la requête à OpenAI." });
  }
}
