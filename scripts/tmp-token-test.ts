import { createLiveKitToken } from "../src/lib/livekit/token";

async function main() {
  const token = await createLiveKitToken({ room: "test-room", identity: "test-user", name: "Ravi" });
  console.log("token minted, length:", token.length, "| JWT parts:", token.split(".").length === 3);
  // Decode the payload to confirm the grants (no secret involved).
  const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
  console.log("identity:", payload.sub ?? payload.name, "| grants room:", payload.video?.room, "| join:", payload.video?.roomJoin);
}
void main();
