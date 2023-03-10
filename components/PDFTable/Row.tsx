import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: "20px",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  title: {
    width: "60%",
  },
  description: {
    width: "100%",
  },
  xyz: {
    width: "20%",
  },
});

const Row = ({ items }) => {
  console.log("items: " + JSON.stringify(items));

  const rows = items.map((item) => (
    <Fragment>
      <View style={styles.row} key={item.id}>
        <Text style={styles.title}>{item.document_title}</Text>
        <Text style={styles.xyz}>{item.rds_number}</Text>
        <Text style={styles.xyz}>{item.document_date}</Text>
      </View>
      <View
        key={item.id + "-description"}
        style={{ paddingLeft: "40px", paddingRight: "20px" }}
      >
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </Fragment>
  ));
  return rows;
};

export default Row;
