import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import api from "../../api/api";

export default function CategoriaScreenIncluir() {
  const navigation = useNavigation();

  // Evita o erro de passar valor 'undefined' para o componente TextInput
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [descricaoCategoria, setDescricaoCategoria] = useState("");

  async function salvar() {
    // Validação: campo obrigatório e mínimo de 3 caracteres
    if (!nomeCategoria || nomeCategoria.trim().length < 3) {
      Alert.alert("Atenção", "Informe corretamente o nome da categoria");
      return;
    }
    if (!descricaoCategoria || descricaoCategoria.trim().length < 3) {
      Alert.alert("Atenção", "Informe corretamente a descrição da categoria");
      return;
    }

    try {
      // Insere nova categoria no banco
      await api.post("/categorias", {
        nome: nomeCategoria,
        descricao: descricaoCategoria,
      });

      Alert.alert("Sucesso", "Categoria inclusa com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar a categoria.");
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Text style={styles.titulo}>Incluir Categoria</Text>

      <Text style={styles.label}>Nome da Categoria</Text>
      <TextInput
        placeholder="Digite o nome da categoria"
        placeholderTextColor={COLORS.textMuted}
        value={nomeCategoria}
        onChangeText={setNomeCategoria}
        style={styles.input}
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        placeholder="Digite a descrição da categoria"
        placeholderTextColor={COLORS.textMuted}
        value={descricaoCategoria}
        onChangeText={setDescricaoCategoria}
        style={[styles.input, styles.textArea]}
        multiline
      />

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
          <Text style={styles.saveText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 🎨 Sistema de Cores Centralizado e Padronizado
const COLORS = {
  primary: "#000eab",
  background: "#ffffff",
  textTitle: "#1E293B",
  textBody: "#334155",
  textMuted: "#94A3B8",
  border: "#E2E8F0",
  white: "#ffffff",
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
    color: COLORS.textTitle,
    textAlign: "center",
    marginBottom: 28,
  },

  // --- Formulários ---
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
    color: COLORS.textBody,
    backgroundColor: COLORS.white,
    marginBottom: 20,
    width: "100%",
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

  // --- Textos dos Botões ---
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