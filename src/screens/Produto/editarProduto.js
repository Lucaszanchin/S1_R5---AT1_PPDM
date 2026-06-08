import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Importa a sua instância centralizada da API
import api from '../../api/api';

export default function EditarProduto() {
    const navigation = useNavigation();
    const route = useRoute();

    // Captura o produto que foi passado por parâmetro na navegação
    const produtoAtual = route.params;

    // Estados do formulário pré-preenchidos com os dados atuais do produto
    const [nome, setNome] = useState(produtoAtual?.nome || '');
    const [valor, setValor] = useState(produtoAtual?.valor ? String(produtoAtual.valor) : '');
    const [idCategoria, setIdCategoria] = useState(produtoAtual?.idCategoria || null);
    const [categorias, setCategorias] = useState([]);

    // Carrega as categorias para o Picker (igual à tela de inclusão)
    useEffect(() => {
        const carregarCategorias = async () => {
            try {
                const response = await api.get('/categorias');
                if (response.data && response.data.result) {
                    setCategorias(response.data.result);
                }
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
                Alert.alert('Erro', 'Não foi possível carregar as categorias.');
            }
        };
        carregarCategorias();
    }, []);

    async function salvarEdicao() {
        if (!nome || nome.trim().length < 3) {
            Alert.alert('Atenção', 'Informe corretamente o nome do produto.');
            return;
        }
        if (!valor || parseFloat(valor) <= 0) {
            Alert.alert('Atenção', 'Informe um valor válido.');
            return;
        }
        if (!idCategoria) {
            Alert.alert('Atenção', 'Selecione uma categoria.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('nome', nome.trim());
            formData.append('valor', valor);
            formData.append('idCategoria', idCategoria);

            // IMPORTANTE: Usando o método PUT e passando o ID do produto na rota
            const idProduto = produtoAtual?.id || produtoAtual?.Id;
            const response = await api.put(`/produtos/${idProduto}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200 || response.status === 201) {
                Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
                navigation.goBack(); // Volta para a listagem (que vai atualizar sozinha pelo GET)
            }

        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            const msgErro = error.response?.data?.message || 'Erro ao conectar com o servidor.';
            Alert.alert('Erro', msgErro);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.titulo}>Editar Produto</Text>
                <StatusBar style="auto" />

                <TextInput
                    placeholder="Nome do produto"
                    value={nome}
                    onChangeText={setNome}
                    style={styles.input}
                />

                <TextInput
                    placeholder="Valor do produto"
                    value={valor}
                    style={styles.input}
                    keyboardType="decimal-pad"
                    onChangeText={(text) => {
                        const cleaned = text.replace(/[^0-9.]/g, '');
                        const parts = cleaned.split('.');
                        if (parts.length > 2) return;
                        setValor(cleaned);
                    }}
                />

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={idCategoria}
                        onValueChange={(itemValue) => setIdCategoria(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label='Selecione uma categoria' value={null} color="#888" />
                        {categorias.map((cat) => (
                            <Picker.Item
                                key={String(cat.id)}
                                label={cat.nome}
                                value={cat.id}
                            />
                        ))}
                    </Picker>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.textButton}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.saveButton]}
                        onPress={salvarEdicao}
                    >
                        <Text style={[styles.textButton, { color: '#fff', fontWeight: 'bold' }]}>Atualizar</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const COLORS = {
  primary: '#000eab',         // Cor principal herdada das suas telas anteriores
  background: '#ffffff',      // Fundo principal da tela
  textTitle: '#1E293B',       // Títulos destacados (Slate 800)
  textBody: '#334155',        // Textos comuns e valores digitados (Slate 700)
  border: '#E2E8F0',          // Bordas suaves e modernas (Slate 200)
  inputBg: '#F8FAFC',         // Fundo sutil para campos de entrada (Slate 50)
  white: '#ffffff',
  // Estados dos botões
  bgCancel: '#E2E8F0',
  textCancel: '#475569',
};

const styles = StyleSheet.create({
  // --- Estrutura de Tela ---
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,    // Gerencia as margens laterais da tela inteira de forma uniforme
    paddingBottom: 24,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textTitle,
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 28,
  },

  // --- Componentes de Formulário (Inputs e Picker) ---
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 50,               // Altura confortável para o toque (Touch Target ideal)
    fontSize: 15,
    color: COLORS.textBody,
    backgroundColor: COLORS.inputBg,
    marginBottom: 20,
    width: '100%',            // Ocupa toda a área disponível descontando o padding do scrollContainer
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: COLORS.inputBg,
    overflow: 'hidden',       // Garante que o Picker interno respeite o borderRadius do container
  },
  picker: {
    height: 50,
    color: COLORS.textBody,
  },

  // --- Rodapé de Botões (Ações) ---
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,                  // Espaçamento perfeito e automático entre os botões filhos
    width: '100%',
    marginTop: 8,
  },
  button: {
    flex: 1,                  // Força ambos os botões a dividirem o espaço igualmente (50% para cada)
    height: 48,               // Padroniza a altura dos botões de ação
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // Leve sombreamento para dar hierarquia visual de clique
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cancelButton: {
    backgroundColor: COLORS.bgCancel,
    elevation: 0,             // Remove sombra do botão secundário para não brigar com o principal
    shadowOpacity: 0,
  },
  saveButton: {
    backgroundColor: COLORS.primary, // Vinculado à cor padrão do seu projeto
  },

  // --- Textos dos Botões ---
  cancelText: {
    color: COLORS.textCancel,
    fontWeight: '600',
    fontSize: 15,
  },
  saveText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 15,
  },
});