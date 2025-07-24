// netlify/functions/callback.js

exports.handler = async (event, context) => {
  // Discord PING verification
  if (event.httpMethod === "POST") {
    const body = JSON.parse(event.body);

    if (body.type === 1) {
      return {
        statusCode: 200,
        body: JSON.stringify({ type: 1 }),
      };
    }

    // Handle other Discord interactions or OAuth here
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Received something else" }),
    };
  }

  return {
    statusCode: 405,
    body: "Method Not Allowed",
  };
};
