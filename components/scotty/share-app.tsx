import { useState } from "react";
import { Linking, Platform } from "react-native";
import { Body, Button, C } from "./ui";

export function ShareApp() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const share = async (email: boolean) => {
    setBusy(true);
    setMessage("");
    try {
      if (Platform.OS !== "web")
        throw new Error(
          "Open the published Scotty website to share its web link.",
        );
      const url = window.location.origin + (process.env.EXPO_PUBLIC_SCOTTY_BASE_PATH || '') + "/phone.html";
      if (["localhost", "127.0.0.1", "::1"].includes(window.location.hostname))
        throw new Error(
          "This is the local preview. Publish Scotty before sending its link to someone else.",
        );
      const title = "Try Scotty — your galaxy, one ride away";
      const text =
        "Explore Scotty, my fictional space-travel app. Try finding a ride and booking with demo credits. No real payment.";
      if (email) {
        await Linking.openURL(
          `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + "\n\n" + url)}`,
        );
      } else if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        setMessage("Scotty’s link was copied. Paste it into your message.");
      }
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError"))
        setMessage(
          error instanceof Error
            ? error.message
            : "Sharing is unavailable. Copy the website address from your browser.",
        );
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <Button
        label="Share Scotty"
        icon="share-outline"
        onPress={() => void share(false)}
        disabled={busy}
      />
      <Button
        label="Email a link"
        icon="mail-outline"
        secondary
        onPress={() => void share(true)}
        disabled={busy}
      />
      {!!message && <Body style={{ color: C.mint }}>{message}</Body>}
    </>
  );
}
