import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { TokenCache } from "@clerk/clerk-expo/dist/cache";

const createTokenCache = (): TokenCache => {
   return {
      getToken: async (key: string) => {
         try {
            return await SecureStore.getItemAsync(key);
         } catch (error) {
            console.error("Secure store get item error: ", error);
            return null;
         }
      },
      saveToken: async (key: string, token: string) => {
         try {
            await SecureStore.setItemAsync(key, token);
         } catch (error) {
            console.error("Secure store save item error: ", error);
         }
      }
   }
}

// Securestore is not supported on the web
export const tokenCache = Platform.OS !== "web" ? createTokenCache() : undefined;