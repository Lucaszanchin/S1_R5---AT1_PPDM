import { StatusBar } from 'expo-status-bar';
import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Importa a sua instância centralizada da API
import api from '../../api/api';

export default function ProdutoScreen() {
  const navigation = useNavigation();
  const [produtos, setProdutos] = useState([]);

  // O useFocusEffect roda na montagem e sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      async function load() {
        if (ativo) await loadData();
      }
      load();
      return () => { ativo = false; };
    }, [])
  );

  async function loadData() {
    try {
      const response = await api.get('/produtos');

      if (response.data) {
        if (Array.isArray(response.data)) {
          setProdutos(response.data);
        } else if (response.data.result && Array.isArray(response.data.result)) {
          setProdutos(response.data.result);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setProdutos(response.data.data);
        } else if (response.data.produtos && Array.isArray(response.data.produtos)) {
          setProdutos(response.data.produtos);
        } else {
          console.log("O backend respondeu, mas não encontramos um array válido.");
        }
      }
    } catch (error) {
      console.error("❌ ERRO COMPLETO NO GET PRODUTOS:", error);

      if (!error.response) {
        Alert.alert(
          "Erro de Conexão",
          "Não foi possível alcançar o servidor. Verifique se o IP no arquivo api.js está atualizado e se o PC/celular estão no mesmo Wi-Fi."
        );
      } else {
        Alert.alert("Erro", `Erro do servidor: ${error.response.status}`);
      }
    }
  }

  const handleDelete = (id, nomeProduto = "Produto") => {
    Alert.alert(
      "Excluir Produto",
      `Tem certeza que deseja apagar o produto "${nomeProduto}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/produtos/${id}`);
              Alert.alert("Sucesso", "Produto excluído com sucesso!");
              await loadData();
            } catch (error) {
              console.error("Erro ao excluir:", error);
              Alert.alert(
                "Erro",
                error.response?.data?.message || "Não foi possível excluir o produto."
              );
            }
          },
        },
      ]
    );
  };

  function openEdit(item) {
    if (!item) return;
    navigation.navigate('ProdutoScreenEditar', item);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Cabeçalho Ajustado: Agora focado apenas no título da listagem */}
      <View style={styles.header}>
        <Text style={styles.titleScreen}>Gestão de produtos</Text>
      </View>

      <FlatList
        data={produtos}
        keyExtractor={(item, index) => String(item.id || item.Id || index)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.sideBar} />

            <View style={styles.cardInner}>
              <View style={styles.cardContent}>
                <Text style={styles.productText}>
                  <Text style={styles.label}>ID: </Text>{item.id || item.Id}
                </Text>
                <Text style={styles.productText}>
                  <Text style={styles.label}>Produto: </Text>{item.nome || item.NomeProduto}
                </Text>
                <Text style={styles.productText}>
                  <Text style={styles.label}>Valor R$: </Text>{item.valor || item.Valor}
                </Text>
                <Text style={styles.productText}>
                  <Text style={styles.label}>Categoria: </Text>
                  {item.nomeCategoria || item.NomeCategoria || item.idCategoria || 'Sem categoria'}
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => openEdit(item)}
                >
                  <Text style={styles.editText}>✏️ Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(item.id || item.Id, item.nome || item.NomeProduto)}
                >
                  <Text style={styles.deleteText}>🗑️ Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        )}
      />
    </View>
  );
}

const COLORS = {
  primary: '#000eab',
  background: '#ffffff',
  textTitle: '#1E293B',
  textBody: '#333333',
  textMuted: '#888888',
  white: '#ffffff',
  bgEdit: '#E3F2FD',
  textEdit: '#2196F3',
  bgDelete: '#FFEBEE',
  textDelete: '#F44336',
};

const styles = StyleSheet.create({
  // --- Estrutura Principal ---
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 10,
  },
  titleScreen: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textTitle,
  },
  listContent: {
    paddingBottom: 20,
  },

  // --- Estado Vazio ---
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: COLORS.textMuted,
  },

  // --- Componente: Card ---
  card: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '92%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginTop: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  sideBar: {
    width: 6,
    backgroundColor: COLORS.primary,
  },
  cardInner: {
    flex: 1,
    padding: 16,
  },
  cardContent: {
    marginBottom: 12,
  },
  productText: {
    fontSize: 14,
    color: COLORS.textBody,
    marginBottom: 4,
  },
  label: {
    fontWeight: '700',
    color: COLORS.textTitle,
  },

  // --- Área de Ações dentro do Card ---
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: COLORS.bgEdit,
  },
  editText: {
    fontWeight: '600',
    fontSize: 13,
    color: COLORS.textEdit,
  },
  deleteButton: {
    backgroundColor: COLORS.bgDelete,
  },
  deleteText: {
    fontWeight: '600',
    fontSize: 13,
    color: COLORS.textDelete,
  },
});