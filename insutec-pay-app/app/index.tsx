import { Redirect } from 'expo-router';

// Quando um utilizador chega ao caminho raiz ("app/"), 
// ele será imediatamente redirecionado para a tela Home (telas/home/Home).
// A lógica de autenticação (se vai para Home ou Login) é gerida no _layout.tsx.

export default function Index() {
  // Rota absoluta do Expo Router, garantindo que vai para o ecrã Home correto.
  return <Redirect href="/telas/home/Home" />;
}

