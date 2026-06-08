import { StatusBar } from "expo-status-bar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";

import api from "../../api/api";

export default function CategoriaScreenEditar() {
  const route = useRoute();
  const navigation = useNavigation();

  const [idCategoria, setIdCategoria] = useState(null);
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (route.params) {
      setIdCategoria(route.params.id);
      setNomeCategoria(route.params.nome || "");
      setDescricao(route.params.descricao || "");
    }
  }, [route.params]);

  async function salvar() {
    try {
      if (!nomeCategoria || nomeCategoria.trim().length < 3) {
        Alert.alert(
          "Atenção",
          "Informe um nome de categoria com pelo menos 3 caracteres."
        );
        return;
      }

      if (!idCategoria) {
        Alert.alert("Atenção", "Categoria inválida.");
        return;
      }

      await api.put(`/categorias/${idCategoria}`, {
        nome: nomeCategoria,
        descricao: descricao,
      });

      Alert.alert("Sucesso", "Categoria atualizada com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível atualizar a categoria.");
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Text style={styles.titulo}>Editar Categoria</Text>

      {/* Bloco do ID foi removido visualmente daqui, mas o valor continua salvo no estado */}

      {/* Bloco do Nome */}
      <Text style={styles.label}>Nome da Categoria</Text>
      <TextInput
        placeholder="Digite o nome da categoria"
        placeholderTextColor={COLORS.textMuted}
        value={nomeCategoria}
        onChangeText={setNomeCategoria}
        style={styles.input}
      />

      {/* Bloco da Descrição */}
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        placeholder="Digite uma descrição"
        placeholderTextColor={COLORS.textMuted}
        value={descricao}
        onChangeText={setDescricao}
        style={[styles.input, styles.textArea]}
        multiline
      />

      {/* Botões de Ação na base do formulário */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>

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

// 🎨 Objeto Centralizado de Cores (Design System)
const COLORS = {
  primary: "#000eab",
  background: "#ffffff",
  textTitle: "#1E293B",
  textBody: "#334155",
  textMuted: "#94A3B8",
  border: "#E2E8F0",
  white: "#ffffff",
  // Estados específicos
  bgDisabled: "#F1F5F9",
  textDisabled: "#64748B",
  bgCancel: "#E2E8F0",
  textCancel: "#475569",
};

const styles = StyleSheet.create({
  // --- Estrutura de Tela ---
  container: {
    flex: 1,
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
    textAlignVertical: "top", 
    paddingTop: 12,           
  },

  // --- Rodapé de Botões ---
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,                  
    marginTop: 12,
  },
  button: {
    flex: 1,                  
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cancelButton: {
    backgroundColor: COLORS.bgCancel,
    elevation: 0,             
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