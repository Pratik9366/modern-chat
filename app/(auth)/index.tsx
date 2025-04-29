import { DarkTheme } from "@react-navigation/native";
import { StatusBar, Text, View, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import {
  isClerkAPIResponseError,
  useSignIn,
  useSSO,
  useUser,
} from "@clerk/clerk-expo";
import { useCallback, useState, useEffect } from "react";
import { ClerkAPIError } from "@clerk/types";




export const useWarmUpBrowser = () => {
  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);
};

export default function Index() {
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const { setActive, signIn } = useSignIn();
  const { isSignedIn } = useUser();
  const [errors, setErrors] = useState<ClerkAPIError[]>([]);

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/(chat)");
    }
  }, [isSignedIn, router]);



  const redirectUrl = makeRedirectUri({
    path: "(auth)",
  });


  console.log("Generated Redirect URL: ", redirectUrl);
  console.log("Full Redirect URL details: ", {
    scheme: redirectUrl.split("://")[0],
    path: redirectUrl.split("://")[1],
    fullUrl: redirectUrl,
  });

  const handleSignInWithGoogle = useCallback(async () => {
    try {
      console.log("Starting Google Sign In...");
      if (!setActive) {
        console.log("setActive is not available");
        setErrors([
          {
            code: "SET_ACTIVE_ERROR",
            message: "Authentication service is not available",
          },
        ]);
        return;
      }

      const { createdSessionId } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: redirectUrl,
      });

      console.log("SSO Flow completed. Session ID:", createdSessionId);

      if (createdSessionId) {
        console.log("Setting active session...");
        try {
          await setActive({ session: createdSessionId });
          console.log("Session set active successfully");
        } catch (error) {
          console.error("Error setting active session:", error);
          setErrors([
            { code: "SESSION_ERROR", message: "Failed to set active session" },
          ]);
        }
      } else {
        console.log("No session ID received");
        setErrors([
          { code: "NO_SESSION", message: "Failed to create session" },
        ]);
      }
    } catch (error) {
      console.error("Authentication error details:", error);
      if (isClerkAPIResponseError(error)) {
        setErrors(error.errors);
      } else {
        console.error("Authentication error:", error);
        setErrors([
          {
            code: "UNKNOWN_ERROR",
            message: "An unexpected error occurred during authentication",
          },
        ]);
      }
    }
  }, [startSSOFlow, setActive, redirectUrl]);


  const heandleSigninWithPasskey = async () => {
    try {
      console.log("Starting Passkey Sign In...");
      if (!signIn || !setActive) {
        console.log("signIn or setActive is not available");
        setErrors([
          {
            code: "AUTH_ERROR",
            message: "Authentication service is not available",
          },
        ]);
        return;
      }

      const signInAttempt = await signIn.authenticateWithPasskey({
        flow: "discoverable",
      });

      console.log("Passkey authentication attempt:", signInAttempt);

      if (
        signInAttempt?.status === "complete" &&
        signInAttempt.createdSessionId
      ) {
        console.log("Setting active session for passkey...");
        try {
          await setActive({
            session: signInAttempt.createdSessionId,
          });
          console.log("Session set active successfully");
        } catch (error) {
          console.error("Error setting active session:", error);
          setErrors([
            { code: "SESSION_ERROR", message: "Failed to set active session" },
          ]);
        }
      } else {
        console.log("Passkey authentication incomplete");
        setErrors([
          {
            code: "INCOMPLETE_AUTH",
            message: "Authentication was not completed successfully",
          },
        ]);
      }
    } catch (error) {
      console.error("Passkey authentication error details:", error);
      if (isClerkAPIResponseError(error)) {
        setErrors(error.errors);
      } else {
        console.error("Passkey authentication error:", error);
        setErrors([
          {
            code: "UNKNOWN_ERROR",
            message:
              "An unexpected error occurred during passkey authentication",
          },
        ]);
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StatusBar
        backgroundColor="black"
        translucent
        barStyle="light-content"
        hidden={true}
      />
      <View
        style={{
          backgroundColor: "#303030",
          height: 250,
          width: 340,
          borderRadius: 6,
          borderColor: "#4A4A4A",
          borderWidth: 0.5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 20,
            gap: 10,
            paddingVertical: 20,
          }}
        >
          <Text
            style={{
              color: "grey",
              fontSize: 28,
              fontFamily: "InterDisplay-Medium",
            }}
          >
            Sign up with
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 28,
              fontFamily: "Inter-SemiBold",
            }}
          >
            Google
          </Text>
        </View>
        <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 28,
              bottom: 20,
              color: "grey",
              fontFamily: "InterDisplay-Medium",
            }}
          >
            &{" "}
          </Text>
          <Text
            style={{
              fontSize: 28,
              bottom: 20,
              color: "white",
              fontFamily: "Inter-SemiBold",
            }}
          >
            PassKeys
          </Text>
        </View>

        <View
          style={{
            alignSelf: "center",
            top: 50,
            flexDirection: "row",
            gap: 10,
          }}
        >
          <TouchableOpacity
            onPress={handleSignInWithGoogle}
            style={{
              flexDirection: "row",
              height: 50,
              width: 120,
              backgroundColor: "black",
              borderRadius: 6,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 0.2,
              borderColor: "grey",
            }}
          >
            <AntDesign name="google" size={24} color="white" />
            <Text style={{ color: "white" }}> Google</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={heandleSigninWithPasskey}
            style={{
              flexDirection: "row",
              height: 48,
              width: 120,
              backgroundColor: "grey",
              borderRadius: 6,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 0.2,
              borderColor: "grey",
            }}
          >
            <Entypo name="key" size={24} color="black" />
            <Text style={{ color: "black", fontFamily: "Inter-Bold" }}>
              {" "}
              PassKey
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        {errors.map((error, index) => (
          <Text
            key={error.code || index}
            style={{ color: "red", fontSize: 14, textAlign: "center" }}
          >
            {error.message}
          </Text>
        ))}
      </View>
    </View>
  );
}
