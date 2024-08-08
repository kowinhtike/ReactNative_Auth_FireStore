import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{title:"Account Info"}} />
      <Stack.Screen name="projects" options={{title:"Project List"}} />
      <Stack.Screen name="storage" options={{title:"Firebase Storage"}} />
      <Stack.Screen name="notes/[id]" options={{title:"Note List"}} />
    </Stack>
  );
}
