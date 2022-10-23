import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import { Button } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { gql , useQuery, useLazyQuery } from '@apollo/client'


const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;
const STORIINFO = gql`query AH_getStoriesByUser($user: String) {
  aH_getStoriesByUser(user: $user) {
    id
    faculty
    username
    career_code
    career_name
    state
    }
  }`

  const AVERAGES= gql `query AH_getAverages($id: Int) {
    aH_getAverages(id: $id) {
      PAPA
      PA
    }
  }`

  const SUBJECTS=gql`query AH_getStudentSubjects($id: Int) {
    aH_getStudentSubjects(id: $id) {
      subject_code
      id_story
      tipology
      period
      grade
      outcome
      name
      credits
    }
  }`

function HistoryContent(props){
  const[Pahook,setPaHook]=useState(0)
  const[Papahook,setPapaHook]=useState(0)
  const[subjectList, setSubjectList]=useState([])
  const [tableData, setTableData]=useState([])

  

  
  const {data, loading, error} = useQuery(STORIINFO, {variables: { user: "sarodriguezca" }});
  const [getAver, {data: averagesData, loading:averagesLoading, error:averagesError}] = useLazyQuery(AVERAGES);
  const [getSubjects, {data: subjectsData, loading:subjectsLoading, error:subjectsError}] = useLazyQuery(SUBJECTS);
  
  useEffect(() => {
    if(data) {
      getAver({variables: { id: data.aH_getStoriesByUser[0].id }})
      getSubjects({variables:{id:data.aH_getStoriesByUser[0].id}})
    
    if (averagesData){
      setPaHook(averagesData.aH_getAverages.PA)
      setPapaHook(averagesData.aH_getAverages.PAPA)
    }
    if(subjectsData){
      setSubjectList(subjectsData.aH_getStudentSubjects)
    }
    if(tempList!=''){
      setTableData(tempList)
      console.log(tableData)
    }
  }
   }, [data, averagesData,subjectsData])
  
  
  if(loading||averagesLoading||subjectsLoading){ return(<Text>Loading...</Text>)}

  if(error||averagesError||subjectsError){return(<Text>Error ${error.message}</Text>)}
  let usuario=data.aH_getStoriesByUser[0].username 
  let careerName= decodeURIComponent(escape(data.aH_getStoriesByUser[0].career_name))
  let careerCode= data.aH_getStoriesByUser[0].career_code
  let faculty=decodeURIComponent(escape(data.aH_getStoriesByUser[0].faculty))
  let state=data.aH_getStoriesByUser[0].state
  let id=data.aH_getStoriesByUser[0].id
  let tempList=[]
  for (let subj in subjectList){
    let temprow=[]
    temprow.push(decodeURIComponent(escape(subjectList[subj].name)))
    temprow.push(decodeURIComponent(escape(subjectList[subj].credits)))
    temprow.push(decodeURIComponent(escape(subjectList[subj].tipology)))
    temprow.push(decodeURIComponent(escape(subjectList[subj].period)))
    temprow.push(decodeURIComponent(escape(subjectList[subj].grade))+" "+decodeURIComponent(escape(subjectList[subj].outcome)))
    tempList.push(temprow)
  }
  //console.log(tempList)
  


  
 
  let tableHead= ['Asignatura', 'Créditos', 'Tipología','Período','Calificación']
  
  


  return(
  <Block flex style={styles.profile}>
        <Block flex>
          <ImageBackground
            source={Images.ProfileBackground}
            style={styles.profileContainer}
            imageStyle={styles.profileBackground}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >
              <Block flex style={styles.profileCard}>
                <Block middle style={styles.avatarContainer}>
                  <Image
                    source={{ uri:'https://img.freepik.com/vector-gratis/pila-libros-diseno-plano-dibujado-mano_23-2149342941.jpg?w=2000'}}
                    style={styles.avatar}
                  />
                </Block>
                <Block middle style={styles.nameInfo}>
                    <Text bold size={28} color="#32325D">
                      Historia Académica
                    </Text>
                    <Text size={20} color="#32325D" style={{ marginTop: 10 }}>
                      {usuario}
                    </Text>
                  </Block>
                <Block style={styles.info}>

                  
                  <Block middle>
                    <Text
                      size={16}
                      color="#525F7F"
                    >
                      {careerName}
                      {"\n"} 
                      {faculty}
                      {"\n"} 
                      Estado: {state}
                      {"\n"}
                    </Text>
                  </Block>
                  <Block row space="evenly">
                    <Block middle>
                      <Text
                        bold
                        size={20}
                        color="#525F7F"
                        style={{ marginBottom: 4 }}
                      >
                        PAPA
                      </Text>
                      <Text size={14} color={argonTheme.COLORS.TEXT}>{Papahook}</Text>
                    </Block>
                    <Block middle>
                    
                      <Text
                        bold
                        color="#525F7F"
                        size={20}
                        style={{ marginBottom: 4 }}
                      >
                        PA
                        
                      </Text>
                      <Text size={14} color={argonTheme.COLORS.TEXT}>{Pahook}</Text>
                    </Block>
                    
                  </Block>
                </Block>
                <Block flex>
                  <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                    <Block style={styles.divider} />
                  </Block>
                  <Block>
                    <Text
                      size={20}
                      color="#525F7F"
                      style={{ textAlign: "center" }}
                    >
                      Materias cursadas
                    </Text>
                  </Block>
                    <Table borderStyle={{ borderWidth: 1 }}>
                      <Row
                        data={tableHead}
                        flexArr={[1, 1, 2, 1, 1]}
                        style={styles.head}
                        textStyle={styles.text}
                      />
                      <TableWrapper style={styles.wrapper}>
                        <Rows
                          data={tempList}
                          flexArr={[1,1,2,1,1]}
                          
                          style={styles.row}
                          textStyle={styles.text}
                        />
                      </TableWrapper>
                    </Table>
                </Block>
              </Block>
            </ScrollView>
          </ImageBackground>
        </Block>
      </Block>
  );
}

class AcademicHistory extends React.Component {
  render() {
    return (
      <HistoryContent {... this.props}/>
    );
  }
}

const styles = StyleSheet.create({

  container: { flex: 1, padding: 16, paddingTop: 100, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#CC085E' },
  wrapper: { flexDirection: 'row' },
  title: { flex: 1, backgroundColor: '#2ecc71' },
  row: { height: 35},
  text: { textAlign: 'center', fontSize: 10 },
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  info: {
    paddingHorizontal: 40
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0
  },
  nameInfo: {
    marginTop: 35
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF"
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  }
});

export default AcademicHistory;
