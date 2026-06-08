import { StatusBar } from "expo-status-bar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import api from "../../api/api";

export default function CategoriaScreenEditar() {
  // hooks de navegação: route para pegar parâmetros passados e navigation para navegar entre telas
  const route = useRoute();
  const navigation = useNavigation();

  // Estados locais para controlar os dados da categoria que está sendo editada
  const [idCategoria, setIdCategoria] = useState(null);
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [descricao, setDescricao] = useState("");

  // useEffect que monitora os parâmetros da rota. 
  // Quando a tela abre, ela recebe os dados da categoria vindos da tela anterior e preenche os estados.
  useEffect(() => {
    if (route.params) {
      setIdCategoria(route.params.id);
      setNomeCategoria(route.params.nome || ""); // Fallback para string vazia caso venha nulo
      setDescricao(route.params.descricao || "");
    }
  }, [route.params]); // Executa novamente se os parâmetros da rota mudarem

  // Função assíncrona para enviar as alterações para o servidor
  async function salvar() {
    try {
      // Validação: Garante que o nome não está vazio e tem pelo menos 3 caracteres válidos
      if (!nomeCategoria || nomeCategoria.trim().length < 3) {
        Alert.alert(
          "Atenção",
          "Informe um nome de categoria com pelo menos 3 caracteres."
        );
        return; // Interrompe a execução da função
      }

      // Validação de segurança: Garante que o ID da categoria existe antes de atualizar
      if (!idCategoria) {
        Alert.alert("Atenção", "Categoria inválida.");
        return;
      }

      // Requisição HTTP PUT para atualizar a categoria específica na API
      await api.put(`/categorias/${idCategoria}`, {
        nome: nomeCategoria,
        descricao: descricao,
      });

      // Feedback de sucesso para o usuário e retorno para a tela anterior
      Alert.alert("Sucesso", "Categoria atualizada com sucesso!");
      navigation.goBack();
    } catch (error) {
      // Log do erro no console para o desenvolvedor e alerta amigável para o usuário
      console.log(error);
      Alert.alert("Erro", "Não foi possível atualizar a categoria.");
    }
  }

  return (
    <View style={styles.container}>
      {/* Configura a barra de status do celular (bateria, hora) automaticamente */}
      <StatusBar style="auto" />

      <Text style={styles.titulo}>Editar Categoria</Text>

      {/* Bloco do ID foi removido visualmente daqui, mas o valor continua salvo no estado */}

      {/* Bloco do Input de Nome */}
      <Text style={styles.label}>Nome da Categoria</Text>
      <TextInput
        placeholder="Digite o nome da categoria"
        placeholderTextColor={COLORS.textMuted}
        value={nomeCategoria}
        onChangeText={setNomeCategoria} // Atualiza o estado conforme o usuário digita
        style={styles.input}
      />

      {/* Bloco do Input de Descrição */}
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        placeholder="Digite uma descrição"
        placeholderTextColor={COLORS.textMuted}
        value={descricao}
        onChangeText={setDescricao}
        style={[styles.input, styles.textArea]} // Combina estilos normais com os de área de texto
        multiline // Permite quebra de linhas
      />

      {/* Botões de Ação na base do formulário (Lado a Lado) */}
      <View style={styles.actions}>
        {/* Botão Cancelar: Apenas volta para a tela anterior sem salvar nada */}
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>

        {/* Botão Salvar: Dispara a função assíncrona de validação e envio */}
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={salvar}
        >
          <Text style={styles.saveText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 🎨 Objeto Centralizado de Cores (Design System para fácil manutenção de layout)
const COLORS = {
  primary: "#000eab",
  background: "#ffffff",
  textTitle: "#1E293B",
  textBody: "#334155",
  textMuted: "#94A3B8",
  border: "#E2E8F0",
  white: "#ffffff",
  bgDisabled: "#F1F5F9",
  textDisabled: "#64748B",
  bgCancel: "#E2E8F0",
  textCancel: "#475569",
};

// Estilizações da tela usando Flexbox
const styles = StyleSheet.create({
  // --- Estrutura de Tela ---
  container: {
    flex: 1, // Ocupa a tela inteira
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 28,
    textAlign: "center",
    color: COLORS.textTitle,
  },

  // --- Formulários e Inputs ---
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: COLORS.textTitle,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 20,
    backgroundColor: COLORS.white,
    color: COLORS.textBody,
  },
  inputDisabled: {
    backgroundColor: COLORS.bgDisabled,
    borderColor: COLORS.border,
    color: COLORS.textDisabled, 
  },
  textArea: {
    height: 110,
    textAlignVertical: "top", // Garante que o texto comece no topo esquerdo no Android
    paddingTop: 12,           
  },

  // --- Rodapé de Botões ---
  actions: {
    flexDirection: "row", // Coloca os botões lado a lado
    justifyContent: "space-between",
    gap: 12, // Espaçamento moderno entre os botões
    marginTop: 12,
  },
  button: {
    flex: 1, // Faz com que ambos os botões dividam o espaço disponível igualmente
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    // Configurações de sombra para iOS:
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    // Configuração de sombra para Android:
    elevation: 1,
  },
  cancelButton: {
    backgroundColor: COLORS.bgCancel,
    elevation: 0, // Remove a sombra no botão de cancelar para dar menos destaque
    shadowOpacity: 0,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  cancelText: {
    color: COLORS.textCancel,
    fontWeight: "600",
    fontSize: 15,
  },
  saveText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 15,
  },
});