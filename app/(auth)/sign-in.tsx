import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import StyledButton from "@/components/StyledButton";
import SignInWithOAuth from "@/components/SignInWithOAuth";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      Alert.alert(
        "whoops!",
        "Looks like you've entered the wrong email or password. \n\nPlease try again."
      );
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{
        flex: 1,
        backgroundColor: "#5F5DEC",
        paddingHorizontal: 20,
        justifyContent: "center",
        gap: 10,
      }}
    >
      <MaterialIcons
        name="video-chat"
        size={160}
        color="white"
        style={{
          alignSelf: "center",
          paddingBottom: 20,
        }}
      />
      <TextInput
        style={{
          padding: 20,
          width: "100%",
          backgroundColor: "white",
          borderRadius: 10,
        }}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email..."
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        style={{
          padding: 20,
          width: "100%",
          backgroundColor: "white",
          borderRadius: 10,
        }}
        value={password}
        placeholder="Password..."
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <View
        style={{
          borderBottomColor: "white",
          borderBottomWidth: 1,
          marginVertical: 20,
        }}
      />
      <StyledButton title="SIgn In" onPress={onSignInPress} />

      <Text
        style={{
          textAlign: "center",
          color: "white",
        }}
      >
        OR
      </Text>
      <SignInWithOAuth/>
      <View
        style={{
          borderBottomColor: "white",
          borderBottomWidth: 1,
          marginVertical: 20,
        }}
      />
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>Don't have an account?</Text>
        <Link href="/sign-up">
          <Text style={{ color: "white" }}>Sign up</Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}
