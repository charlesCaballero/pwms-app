import React from "react";
import Cookies from "js-cookie";
import {
  Page,
  Text,
  Document,
  StyleSheet,
  Font,
  PDFViewer,
  View,
} from "@react-pdf/renderer";
import Row from "@components/PDFTable/Row";

interface LabelProps {
  data: any;
}

export default function Pdf(props: LabelProps) {
  const { data } = props;
  const office_name = Cookies.get("office_name");
  console.log("data: " + JSON.stringify(data));

  return (
    <PDFViewer width={window.innerWidth} height={window.innerHeight}>
      <Document>
        <Page style={styles.body} orientation={"landscape"}>
          <View
            style={{
              borderLeft: "1px solid black",
              borderRight: "1px solid black",
            }}
          >
            <Text style={styles.box_label}>BOX LABEL # {data.box_code}</Text>
            <Text style={styles.department}>{office_name}</Text>
            {/* <Text style={styles.document}>{"1. VOUCHER TRANSMITTAL"}</Text> */}
            {/* {"RDS-A #1" + " BDVS#	B15-1909-00003" + " Oct-Dec 2021"} */}
            <View style={{ height: "395px" }}>
              <Row items={data.box_details} />
            </View>
            <Text style={styles.box_label}>
              Disaposal Date: {data.disposal_date}
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  box_label: {
    fontSize: 30,
    textAlign: "right",
    borderBottom: "1px solid black",
    borderTop: "1px solid black",
    fontFamily: "Times-Roman",
    fontWeight: "bold",
    paddingRight: 8,
  },
  department: {
    fontSize: 25,
    textAlign: "left",
    borderBottom: "1px solid black",
    fontFamily: "Times-Roman",
    paddingLeft: 8,
  },
  document: {
    fontSize: 25,
    textAlign: "left",
    fontFamily: "Times-Roman",
  },
  details: {
    fontSize: 20,
    textAlign: "left",
    fontFamily: "Times-Roman",
    paddingLeft: 30,
  },
});
