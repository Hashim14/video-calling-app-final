import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Call,
  CallingState,
  StreamCall,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useLocalSearchParams } from "expo-router";
import CallRoom from "@/components/Room";
import { generateSlug } from "random-word-slugs";
import Toast from "react-native-root-toast";
import { copySlug } from "@/lib/slug";

export default function CallScreen() {
  const { id } = useLocalSearchParams();

  const [call, setCall] = useState<Call | null>(null);

  const client = useStreamVideoClient();
  const [slug, setSlug] = useState("");

  useEffect(() => {
    let slug: string;
    if (id !== "call" && id) {
      // joining the existing call
      slug = id.toString();
      const _call = client?.call("default", slug);
      _call?.join({ create: false }).then(() => {
        setCall(_call);
      });
    } else {
      slug = generateSlug(3, {
        categories : {
          adjective : ["color", "personality"],
          noun : ["animals", "food"]
        }
      })

      //creating a new call
      const _call = client?.call("default", slug);
      _call?.join({ create: true }).then(() => {
        //have a toast popup
        Toast.show(
          "Call Created Successfully \n Tap here to COPY the call ID to share!",
          {
            duration: Toast.durations.LONG,
            position : Toast.positions.CENTER,
            shadow : true,
            onPress : async () => {
              copySlug(slug)
            }
          }
        )
        setCall(_call);
      });
    }
    setSlug(slug);
  }, []);

  useEffect(() => {
    if (call?.state.callingState !== CallingState.LEFT) {
      call?.leave;
    }
  }, []);

  if (!call || !slug) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <StreamCall call={call}>
      <CallRoom slug={slug} />
    </StreamCall>
  );
}
 