const nacl = require("tweetnacl");

exports.handler = async (event) => {
  const PUBLIC_KEY = "d9c374c998a5cfdb69a8cf7cb596c006a9510e050bc253467d86b2d4f3624718"; // insert yours here

  const signature = event.headers["x-signature-ed25519"];
  const timestamp = event.headers["x-signature-timestamp"];
  const body = event.body;

  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + body),
    Buffer.from(signature, "hex"),
    Buffer.from(PUBLIC_KEY, "hex")
  );

  if (!isVerified) {
    return {
      statusCode: 401,
      body: "Invalid request signature",
    };
  }

  const json = JSON.parse(body);
  if (json.type === 1) {
    return {
      statusCode: 200,
      body: JSON.stringify({ type: 1 }),
    };
  }

  return {
    statusCode: 400,
    body: "Unhandled interaction type",
  };
};

