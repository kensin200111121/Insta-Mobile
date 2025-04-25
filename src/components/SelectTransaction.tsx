import React, { useState, useEffect } from "react";
import { TransactionItem } from "../interface/transaction";
import { View, Text, TextInput, FlatList, StyleSheet, SafeAreaView, ListRenderItemInfo, TouchableOpacity } from "react-native";
import { getPriceNumber } from "../helpers/numberHelper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import moment from "moment";

interface SelectTransactionProps {
  transactions: TransactionItem[];
  onSelect?: (transaction: TransactionItem|undefined) => void;
}

const SelectTransaction: React.FC<SelectTransactionProps> = ({ transactions, onSelect }) => {
  const [options, setOptions] = useState<TransactionItem[]>([]);
  const [searchKey, setSearchKey] = useState('');
  const [visibleList, setVisibleList] = useState(false);

  useEffect(() => {
    if ( transactions && searchKey != '') {
      setOptions(
        transactions.filter(
          t =>
            t.transaction_id?.toUpperCase().indexOf(searchKey) >= 0 ||
            t.phone?.toUpperCase().indexOf(searchKey) >= 0 ||
            t.customer_name?.toUpperCase().indexOf(searchKey) >= 0,
        ),
      );
    } else {
      setOptions([]);
    }
  }, [transactions, searchKey]);

  const handleSelect = (item: TransactionItem) => {
    onSelect && onSelect(item);
    setSearchKey(item.transaction_id);
    setVisibleList(false);
  };

  const handleSearch = (keyword: string) => {
    setSearchKey(keyword.toUpperCase());
    if(!visibleList){
      onSelect && onSelect(undefined);
    }
    setVisibleList(keyword != '');
  };

  const renderItem = ({ item }: ListRenderItemInfo<TransactionItem>) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      style={{paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#848484'}}
    >
      <View style={styles.row}>
        <Text style={styles.text}>Transaction ID: </Text>
        <Text style={styles.value}>{item.transaction_id}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>User Name: </Text>
        <Text style={styles.value}>{item.customer_name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Phone: </Text>
        <Text style={styles.value}>{item.phone}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Amount: </Text>
        <Text style={styles.value}>{getPriceNumber(item.amount)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Date: </Text>
        <Text style={styles.value}>{moment(item.created_at).format('MM/DD/YYYY')}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{position: 'relative'}}>
      <TextInput
        onChangeText={handleSearch}
        placeholder="Enter Transaction ID / Phone / Name"
        style={styles.input}
        value={searchKey}
      />
      {visibleList && <GestureHandlerRootView style={styles.container}>
        <FlatList<TransactionItem>
          data={options}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          keyboardShouldPersistTaps="handled"
        />
      </GestureHandlerRootView>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 5
  },
  value: {
    fontWeight: '500',
    fontSize: 12
  },
  text: {
    fontSize: 12
  },
  input: {
    borderRadius: 15,
    backgroundColor: '#F3F3F3',
    lineHeight: 22,
    paddingVertical: 4,
    paddingHorizontal: 10,
    width: '100%',
    fontSize: 12
  },
  container: {
    position: 'absolute',
    width: '100%',
    top: '100%',
    backgroundColor: 'white',
    zIndex: 2,
    paddingHorizontal: 5,
    maxHeight: 200
  }
});

export default SelectTransaction;
