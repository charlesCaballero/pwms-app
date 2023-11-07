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
  const [innerHeight,setInnerHeight] = React.useState(0);
  const [innerWidth,setInnerWidth] = React.useState(0);
  const user_name = Cookies.get("user_name");
  // console.log("data@PDF renderer: " + JSON.stringify(data));


  React.useEffect(()=>{
    setInnerWidth(window.innerWidth);
    setInnerHeight(window.innerHeight);
  },[window.innerWidth,window.innerHeight])

  return (
    <PDFViewer width={innerWidth} height={innerHeight} showToolbar={true} >
      <Document>
        <Page style={styles.body} orientation={"landscape"} size={'A4'}>
          <View style={styles.priority_row}>
            <Text >Priority Level: </Text>
            <Text style={styles.priority_code}>{data.priority_level}</Text>
          </View>

          <View
            style={{
              border: "1px solid black",
            }}
          >
            <View style={styles.row}>
              <Text>Records Classification: </Text>
              <Text style={styles.row_value}>{data.classification}</Text>
            </View>
            <View style={styles.row}>
              <Text>Department: </Text>
              <Text style={styles.row_value}>{office_name}</Text>
            </View>
            <View style={styles.row}>
              <Text>Box Code/Control No.: </Text>
              <Text style={styles.row_value}>{data.box_code}</Text>
            </View>
            <View style={{borderBottom: '1px solid black', padding: 5,height:200}}>
              <Text>Title of Records per RDS: </Text>
              <View>
                <Row items={data.box_details} />
                {data.remarks!=="" || undefined?
                <View >
                  <Text style={{padding: '8 8 0 8',fontWeight:'bold'}}>Remarks:</Text>
                  <Text style={{padding: '5 20 0 20'}}>{data.remarks}</Text>
                </View>
                :""}
                </View>
            </View>
            <View style={styles.row}>
              <Text>Records Officer Designate: </Text>
              <Text style={styles.row_value}>{user_name}</Text>
            </View>
            {/* 
            <View style={{display: "flex", borderBottom: '1px solid black', flexDirection:"row"}}>
              <Text>Document Date: </Text>
              <Text style={styles.row_value}>{'STORAGE'}</Text>
            </View> 
            */}
            <View style={styles.row}>
              <Text >Record Date: </Text>
              <Text style={styles.row_value}>
              {
                data.box_details.map((details,count)=> (
                  "("+(count+1)+") "+details.document_date+", "
                ))
              }
              </Text>
            </View>
            <View style={styles.row_no_border}>
              <Text >Disposal Date: </Text>
              <Text style={styles.row_value}>{data.disposal_date}</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

// Font.register({
//   family: "Georgia",
//   src: "https://db.onlinewebfonts.com/t/7dca09e227fdfe16908cebb4244589e4.ttf",
//   format: 'truetype',
// });

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    // fontFamily: "Georgia"
  },
  row: {
    display: "flex", 
    borderBottom: '1px solid black', 
    flexDirection:"row", 
    padding: 4,
  },
  row_no_border: {
    display: "flex", 
    flexDirection:"row", 
    padding: 3,
  },
  row_value: {
    // flexGrow: 1,
    width:"100%",
    fontWeight: 'bold', 
    textAlign:'center', 
    padding :5
  },
  priority_row: {
    display:'flex',
    flexDirection: "row", 
    marginBottom:10, 
    height:  50, 
    justifyContent: 'center', 
    alignItems:'center'
  },
  priority_code: {
    flexGrow:1, 
    border: "1px solid black", 
    textAlign: 'center', 
    textTransform: "uppercase",
    padding:8
  }
});
