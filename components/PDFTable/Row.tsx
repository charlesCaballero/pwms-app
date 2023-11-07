import React, { Fragment } from "react";
import { Text, View, 
  Font,
  StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingTop: "10px",
  },
  title: {
    // width: "60%",
    width: "100%",
    paddingRight: "10px", 
  },
  // description: {
  //   width: "100%",
  // },
  // rds: {
  //   width: "15%",
  // },
  // documentdate: {
  //   width: "20%",
  // },
});


const Row = ({ items }) => {
  // console.log("items: " + JSON.stringify(items));

  const rows = items.map((item,count) => (
    <Fragment>
      <View style={styles.row} key={item.id}>
        <Text style={styles.title}>{"("+(count+1)+") "+item.document_title}</Text>
        {/* <Text style={styles.rds}>{item.rds_number}</Text> */}
        {/* <Text style={styles.documentdate}>{item.document_date}</Text> */}
      </View>
    </Fragment>
  )); 
  return rows;
};

export default Row;
