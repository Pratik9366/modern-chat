import { Stack, Slot } from "expo-router";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { passkeys } from "@clerk/expo-passkeys";
import { tokenCache } from "../utils/cache";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) throw new Error("Missing publishable key");

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={publishableKey}
      __experimental_passkeys={passkeys}
      // afterSignInUrl="/(chat)"
      // afterSignUpUrl="/(chat)"
      signInUrl="/(auth)"
      signUpUrl="/(auth)"
    >
      <ClerkLoaded>
        <ThemeProvider value={DarkTheme}>
          <Slot />
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
