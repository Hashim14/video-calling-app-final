import { Text } from "@/components/Themed";
import { SignedIn, useAuth } from "@clerk/clerk-expo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Dialog from "react-native-dialog";

export default function TabOneScreen() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { signOut } = useAuth();

  return (
    <View>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 100,
        }}
        onPress={() => setDialogOpen(true)}
      >
        <MaterialCommunityIcons name="exit-run" size={24} color="#5F5DEC" />
      </TouchableOpacity>

      <Dialog.Container visible={dialogOpen}>
        <Dialog.Title>Account delete</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to sign out?
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={() => setDialogOpen(false)} />
        <Dialog.Button
          label="Sign Out"
          onPress={async() => {
            await signOut();
            setDialogOpen(false);
          }}
        />
      </Dialog.Container>

      <Text>All Calls</Text>
      <SignedIn>
        <Text>You are signed in</Text>
      </SignedIn>
    </View>
  );
}
