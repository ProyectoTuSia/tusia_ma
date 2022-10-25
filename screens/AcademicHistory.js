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

  const SUMMARY=gql`query AH_getCreditSummary($id: Int) {
    aH_getCreditSummary(id: $id) {
      surplus_credits
      canceled_credits
      completion_percentage
      aditional_credits
      credit_quota
      available_credits
    }
  }`

  const CREDITS=gql`query AH_getCreditHistory($id: Int) {
    aH_getCreditHistory(id: $id) {
      id_story
      fundamentacion_optativa_approved
      fundamentacion_obligatoria_approved
      disciplinar_optativa_approved
      disciplinar_obligatoria_approved
      nivelacion_approved
      trabajo_de_grado_approved
      libre_eleccion_approved
      total_approved
      fundamentacion_optativa_pending
      fundamentacion_obligatoria_pending
      disciplinar_optativa_pending
      disciplinar_obligatoria_pending
      nivelacion_pending
      trabajo_de_grado_pending
      libre_eleccion_pending
      total_pending
      fundamentacion_optativa_signed
      fundamentacion_obligatoria_signed
      disciplinar_optativa_signed
      disciplinar_obligatoria_signed
      nivelacion_signed
      trabajo_de_grado_signed
      libre_eleccion_signed
      total_signed
      fundamentacion_optativa_taken
      fundamentacion_obligatoria_taken
      disciplinar_optativa_taken
      disciplinar_obligatoria_taken
      nivelacion_taken
      trabajo_de_grado_taken
      libre_eleccion_taken
      total_taken
    }
  }`

  const CAREER=gql`query AH_getCareerCredits($code: Int) {
    aH_getCareerCredits(code: $code) {
      code
      fundamentacion_obligatoria
      fundamentacion_optativa
      disciplinar_obligatoria
      disciplinar_optativa
      libre_eleccion
      nivelacion
      trabajo_de_grado
      total
    }
  }`

function HistoryContent(props){
  const[Pahook,setPaHook]=useState(0)
  const[Papahook,setPapaHook]=useState(0)
  const[subjectList, setSubjectList]=useState([])
  const[surplus, SetSurplus]=useState(0)
  const[canceled, SetCanceled]=useState(0)
  const[completition, SetCompletition]=useState(0)
  const[aditional, SetAditional]=useState(0)
  const[quota, SetQuota]=useState(0)
  const[available, SetAvailable]=useState(0)
  const[credits, setCredits]=useState({})
  const[career,setCareer]=useState({})
  

  
  const {data, loading, error} = useQuery(STORIINFO, {variables: { user: props.route.params }});
  const [getAver, {data: averagesData, loading:averagesLoading, error:averagesError}] = useLazyQuery(AVERAGES);
  const [getSubjects, {data: subjectsData, loading:subjectsLoading, error:subjectsError}] = useLazyQuery(SUBJECTS);
  const [getSummary, {data: summaryData, loading:summaryLoading, error:summaryError}] = useLazyQuery(SUMMARY);
  const [getCreditHistory, {data: creditData, loading:creditLoading, error:creditError}] = useLazyQuery(CREDITS);
  const [getCareer, {data: careerData, loading:careerLoading, error:careerError}] = useLazyQuery(CAREER);
  
  useEffect(() => {
    if(data) {
      getAver({variables: { id: data.aH_getStoriesByUser[0].id }})
      getSubjects({variables:{id:data.aH_getStoriesByUser[0].id}})
      getSummary({variables:{id:data.aH_getStoriesByUser[0].id}})
      getCreditHistory({variables:{id:data.aH_getStoriesByUser[0].id}})
      getCareer({variables:{code:data.aH_getStoriesByUser[0].career_code}})
    
    if (averagesData){
      setPaHook(averagesData.aH_getAverages.PA)
      setPapaHook(averagesData.aH_getAverages.PAPA)
    }
    if(subjectsData){
      setSubjectList(subjectsData.aH_getStudentSubjects)
    }
    if(summaryData){
      SetSurplus(summaryData.aH_getCreditSummary.surplus_credits)
      SetCanceled(summaryData.aH_getCreditSummary.canceled_credits)
      SetCompletition(summaryData.aH_getCreditSummary.completion_percentage)
      SetAditional(summaryData.aH_getCreditSummary.aditional_credits)
      SetQuota(summaryData.aH_getCreditSummary.credit_quota)
      SetAvailable(summaryData.aH_getCreditSummary.available_credits)
    }
    if(creditData){
      setCredits(creditData.aH_getCreditHistory)
    }
    if(careerData){
      setCareer(careerData.aH_getCareerCredits)
    }
    
  }
   }, [data, averagesData,subjectsData,summaryData,creditData, careerData])
  
  
  if(loading||averagesLoading||subjectsLoading||summaryLoading||creditLoading||careerLoading){ return(<Text>Loading...</Text>)}

  if(error||averagesError||subjectsError||summaryError||creditError||careerError){return(<Text>Error ${error.message}</Text>)}
  let usuario=data.aH_getStoriesByUser[0].username 
  let careerName= decodeURIComponent(escape(data.aH_getStoriesByUser[0].career_name))
  let careerCode= data.aH_getStoriesByUser[0].career_code
  let faculty=decodeURIComponent(escape(data.aH_getStoriesByUser[0].faculty))
  let state=data.aH_getStoriesByUser[0].state
  let id=data.aH_getStoriesByUser[0].id
  let tempList=[]
  let creditTemp

  creditTemp=[
    ["Fundamentación obligatoria",career.fundamentacion_obligatoria,credits.fundamentacion_obligatoria_approved,credits.fundamentacion_obligatoria_pending,credits.fundamentacion_obligatoria_signed,credits.fundamentacion_obligatoria_taken],
    ["Fundamentación optativa",career.fundamentacion_optativa,credits.fundamentacion_optativa_approved,credits.fundamentacion_optativa_pending,credits.fundamentacion_optativa_signed,credits.fundamentacion_optativa_taken],
    ["Disciplinar obligatoria",career.disciplinar_obligatoria,credits.disciplinar_obligatoria_approved,credits.disciplinar_obligatoria_pending,credits.disciplinar_obligatoria_signed,credits.disciplinar_obligatoria_taken],
    ["Disciplinar optativa",career.disciplinar_optativa,credits.disciplinar_optativa_approved,credits.disciplinar_optativa_pending,credits.disciplinar_optativa_signed,credits.disciplinar_optativa_taken],
    ["Libre elección",career.libre_eleccion,credits.libre_eleccion_approved,credits.libre_eleccion_pending,credits.libre_eleccion_signed,credits.libre_eleccion_taken],
    ["Nivelación",career.nivelacion,credits.nivelacion_approved,credits.nivelacion_pending,credits.nivelacion_signed,credits.nivelacion_taken],
    ["Trabajo de grado",career.trabajo_de_grado,credits.trabajo_de_grado_approved,credits.trabajo_de_grado_pending,credits.trabajo_de_grado_signed,credits.trabajo_de_grado_taken],
    ["Total",career.total,credits.total_approved,credits.total_pending,credits.total_signed,credits.total_taken],
  ]

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
  let creditTableHead= ['Tipología', 'Exigidos', 'Aprobados','Pendientes','Inscritos','Cursados']
  
  


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
                    <Text>
                      {"\n"}
                    </Text>
                    <Block>
                    <Text
                    size={20}
                    color="#525F7F"
                    style={{ textAlign: "left" }}>
                      Resumen de créditos:
                    </Text>
                    <Text
                      size={14}
                      color="#525F7F"
                      style={{ textAlign: "left" }}
                    >
                     Porcentaje de avance: {completition}%
                     {"\n"}
                     Créditos excedentes: {surplus}
                     {"\n"}
                     Créditos cancelados: {canceled}
                     {"\n"}
                     Créditos adicionales: {aditional}
                     {"\n"}
                     Créditos disponibles: {available}
                     {"\n"}
                     Cupo de créditos: {quota}
                    </Text>
                  </Block><Text>
                      {"\n"}
                    </Text>
                  <Table borderStyle={{ borderWidth: 1 }}>
                      <Row
                        data={creditTableHead}
                        flexArr={[1, 1, 1, 1, 1,1]}
                        style={styles.head}
                        textStyle={styles.text}
                      />
                      <TableWrapper style={styles.wrapper}>
                        <Rows
                          data={creditTemp}
                          flexArr={[1,1,1,1,1,1]}
                          
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