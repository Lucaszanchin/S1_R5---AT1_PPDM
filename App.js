import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// --- Importações das Telas ---
import HomeScreen from './src/screens/Home';
import CategoriaScreen from './src/screens/Categoria';
import CategoriaScreenIncluir from './src/screens/Categoria/incluirCategoria';
import CategoriaScreenEditar from './src/screens/Categoria/editarCategoria';
import ProdutoScreen from './src/screens/Produto';
import EditarProduto from './src/screens/Produto/editarProduto';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        // 🎨 Otimização global: Configura o estilo do cabeçalho para todas as telas de uma vez só
        screenOptions={{
          headerTintColor: '#1E293B', // Cor do texto e do botão de voltar alinhada ao seu tema COLORS
          headerTitleStyle: { fontWeight: '700', fontSize: 16 },
          headerShadowVisible: false, // Remove aquela linha feia divisória do header se preferir um visual clean
        }}
      >
        <Stack.Screen 
          name='HomeScreen' 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        
        {/* --- Fluxo de Categorias --- */}
        <Stack.Screen 
          name='CategoriaScreen' 
          component={CategoriaScreen} 
          options={{ title: 'Manutenção de categorias' }}
        />
        <Stack.Screen 
          name='CategoriaScreenIncluir' 
          component={CategoriaScreenIncluir} 
          options={{ title: 'Inclusão de categorias' }}
        />
        <Stack.Screen 
          name='CategoriaScreenEditar' 
          component={CategoriaScreenEditar} 
          options={{ title: 'Edição de categorias' }}
        />
        
        {/* --- Fluxo de Produtos --- */}
        <Stack.Screen 
          name='ProdutoScreen' 
          component={ProdutoScreen} 
          options={{ title: 'Manutenção de produtos' }}
        />
        <Stack.Screen 
          name='ProdutoScreenEditar' 
          component={EditarProduto} 
          options={{ title: 'Edição de produtos' }} // 🛠️ Correção: Adicionado o título que estava faltando
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}