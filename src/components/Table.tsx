import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet, ViewStyle, StyleProp } from 'react-native';

export type TableColumn = {
  title: string,
  dataIndex?: string,
  render?: ((val: any, record: any) => React.ReactNode) | ((val: any, record: any) => string)
}

type PaginationConfig = {
  current: number,
  pageSize: number,
  pageCount: number,
  total: number,
}

const defaultPaginationConfig : PaginationConfig = {
  current: 0,
  pageSize: 25,
  pageCount: 3,
  total: 0
}

type MyTableProps = {
  columns: TableColumn[],
  dataSource: Record<string, any>[]
  rowStyle?: (item: any) => StyleProp<ViewStyle>,
}

const MyTable : React.FC<MyTableProps> = ({columns, dataSource, rowStyle}) => {
  const [listHeightStyle, setListHeightStyle] = useState<StyleProp<ViewStyle>>({height: 10});
  const [columnWidth, setColumnWidth] = useState<number[]>([]);

  useEffect(() => {
    if(columnWidth.length == 0){
      setColumnWidth(columns.map(() => 10));
    }
  }, [columns]);

  // // Pagination Logic
  // const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);
  // const totalPages = Math.ceil(data.length / pageSize);

  // // Filter Logic
  // const handleFilter = (text) => {
  //   setFilterText(text);
  //   if (text) {
  //     const filteredData = sampleData.filter(row =>
  //       Object.values(row).some(value =>
  //         String(value).toLowerCase().includes(text.toLowerCase())
  //       )
  //     );
  //     setData(filteredData);
  //     setPage(1);
  //   } else {
  //     setData(sampleData);
  //   }
  // };

  const render = (column: TableColumn, data: any) => {
    let result: any = data[column.dataIndex || ''];
    if(column.render){
      result = column.render(result, data);
    }
    if(typeof result === 'string' || typeof result === 'number'){
      result = (<Text style={styles.text}>{result}</Text>)
    }
    return result;
  }

  const handleColWidthChange = ( colIndex: number, width: number ) => {
    if( columnWidth[colIndex] < width ){
      columnWidth[colIndex] = width;
      setColumnWidth(columnWidth);
    }
  }

  return (
    <View>
      <ScrollView horizontal>
        <View>
          <View style={styles.headerRow}>
            {columns.map((col, index, data) => (
                <View key={col.dataIndex || col.title} 
                  style={[styles.headerCell, {minWidth: columnWidth[index]}]}
                  onLayout={(event) => {handleColWidthChange(index, event.nativeEvent.layout.width)}}
                >
                  <Text style={styles.headerText}>{col.title}</Text>
                  { (index < data.length - 1) && (
                    <View style={styles.splitter}></View>
                  )}
                </View>
            ))}
          </View>

          {/* Table Rows */}
          <FlatList
            data={dataSource}
            keyExtractor={(item) => item._id.toString()}
            scrollEnabled={false}
            onContentSizeChange={(width, height) => setListHeightStyle({height})}
            style={listHeightStyle}
            renderItem={({ item }) => (
              <View style={[styles.row, rowStyle && rowStyle(item)]} key={item._id}>
                {columns.map((col, index) => (
                  <View key={col.dataIndex || col.title}
                    style={[styles.cell, {minWidth: columnWidth[index]}]}
                    onLayout={(event) => {handleColWidthChange(index, event.nativeEvent.layout.width)}}
                  >
                    { render(col, item) }
                  </View>
                ))}
              </View>
            )}
          />
        </View>
      </ScrollView>

      {/* Pagination Controls
      <View style={styles.pagination}>
        <TouchableOpacity
          disabled={page === 1}
          onPress={() => setPage(page - 1)}
          style={[styles.pageButton, page === 1 && styles.disabledButton]}
        >
          <Text>Prev</Text>
        </TouchableOpacity>
        <Text style={styles.pageText}>{page} / {totalPages}</Text>
        <TouchableOpacity
          disabled={page === totalPages}
          onPress={() => setPage(page + 1)}
          style={[styles.pageButton, page === totalPages && styles.disabledButton]}
        >
          <Text>Next</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
  },
  headerCell: {
    padding: 8,
    paddingRight: 0,
    minWidth: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8
  },
  headerText: {
    fontWeight: '500',
    fontSize: 12,
    marginRight: 8
  },
  splitter: {
    width: 1,
    borderRightWidth: 1,
    borderColor: '#e0e0e0'
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5"
  },
  cell: {
    padding: 8,
    minWidth: 100,
    fontSize: 12
  },
  text: {
    fontSize: 12
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10
  },
  pageButton: {
    padding: 8,
    backgroundColor: "#ddd",
    marginHorizontal: 5,
    borderRadius: 5
  },
  disabledButton: {
    opacity: 0.5
  },
  pageText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10
  }
});

export default MyTable;
