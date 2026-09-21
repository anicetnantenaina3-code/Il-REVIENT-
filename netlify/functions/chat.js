var SYSTEM_PROMPT = [
  "Tu es un accompagnateur bienveillant sur un site chretien evangelique francophone appele Il revient,",
  "centre sur l annonce de l Evangile (la mort et la resurrection de Jesus-Christ) et l esperance de son retour.",
  "Regles :",
  "- Reponds toujours en francais, avec un ton chaleureux, simple, et pastoral.",
  "- Base-toi sur les Ecritures bibliques (tu peux citer des versets brievement).",
  "- Reste centre sur : l Evangile, la grace, la foi, la repentance, le retour de Jesus-Christ, les signes des temps, l esperance, la priere.",
  "- Si la question sort de ce cadre, reoriente gentiment vers l Evangile.",
  "- Ne remplace jamais un accompagnement pastoral reel, encourage-le pour les situations personnelles difficiles.",
  "- Reponses concises : une a trois courts paragraphes."
].join(" ");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    var body = JSON.parse(event.body);
    var messages = body.messages;

    var apiMessages = [{ role: "system", content: SYSTEM_PROMPT }].concat(messages);

    var response = await fetch("https://api.inceptionlabs.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.INCEPTION_API_KEY
      },
      body: JSON.stringify({
        model: "mercury-2",
        messages: apiMessages,
        max_tokens: 600
      })
    });

    var data = await response.json();

    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify({ error: data }) };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: data.choices[0].message.content })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
