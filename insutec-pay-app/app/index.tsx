import { Redirect } from 'expo-router';

// O ficheiro físico é /telas/home/HomeScreen.tsx, portanto, a rota é /telas/home/HomeScreen.
export default function Index() {
  // ✅ CORREÇÃO: Usar o nome do ficheiro real
  return <Redirect href="/telas/home/HomeScreen" />;
}
