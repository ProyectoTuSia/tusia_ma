import React, {useState} from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  TouchableOpacity
} from "react-native";
import { Block, Text, theme, Button as GaButton} from "galio-framework";
import { Table, TableWrapper, Row, Rows, Col, Cell } from 'react-native-table-component';
import { gql , useQuery, useLazyQuery } from '@apollo/client'
import { Icon, Button, Input } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

const GETALLCOURSESINFO = gql`query GetSubject {
  getSubject {
    Id_subject
    Name_subject
    Credits    
    Typology    
  }
}`

const GET_TYPOLOGY = gql`query GetTypeTypology {
  getTypeTypology {
    Id_typology
    Name_typology
  }
}`

function RedirectCell(props) {
  return(
    <Text style={styles.redirectText} onPress = {()=> props.navigation.navigate('CourseInfo', {props, courseCode:props.text})}> {props.text} </Text>
  )
}


function CourseSearchContent(props) {
  
  const tableHead = [ 'Código' , 'Asignatura' , 'Créditos' , 'Tipología']
  const [courseList, setCourseList] = useState([])
  const [stringMatch, setStringMatch] = useState('')
  const { loading:loadingcoursesInfo, error:errorcoursesInfo, data:coursesInfo } = useQuery(GETALLCOURSESINFO)
  const { loading:loadingtypology, error:errortypology, data:typologyInfo} = useQuery(GET_TYPOLOGY)
  let courses = coursesInfo && coursesInfo.getSubject ? coursesInfo.getSubject : [];    
  courses = courses && typologyInfo && typologyInfo.getTypeTypology ? courses.map((course) => [<RedirectCell text={course.Id_subject} navigation={props.navigation}/>, course.Name_subject ,course.Credits, typologyInfo.getTypeTypology[course.Typology-1].Name_typology ]) : []   
  
  //const redirectCell  = (text) => (<Text style={styles.redirectText}> {text} </Text>);

  if(loadingcoursesInfo || loadingtypology){
    return(
      <Text>Loading...</Text>
    )
  }

  if(errorcoursesInfo || errortypology){
    return(
      <Text>Error ${errorcoursesInfo ? errorcoursesInfo:errortypology}</Text>
    )
  }

  return (
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
              
              <Block style={styles.info}>
                <Block middle style={styles.avatarContainer}>
                  
                </Block>
              </Block>
              <Block flex>
                <Text bold center size={28} color="#32325D">
                  Buscador de Cursos
                </Text>              
               
                <Input right placeholder="Ingrese el nombre del curso" iconContent={<Block />} onChangeText = {(texto) => { setStringMatch(texto)
                }}/> 
                
                <Block center>
                  <Button color="default" style={styles.button} onPress = {()=> setCourseList(courses.filter((course)=> {
                    const comparation = course[1].toLowerCase().includes(stringMatch.toLowerCase()) || course[0] == stringMatch                    
                    return comparation
                  })) } >
                    BUSCAR
                </Button>
                </Block>               
                
                <Block middle style={{ marginTop: 30, marginBottom: 16 }}>                  
                  <Block style={styles.divider} />
                </Block>
                
                <Block>
                  <Table borderStyle={{ borderWidth: 1 }}>
                        <Row
                          data={tableHead}
                          flexArr={[1, 2, 1, 2]}
                          style={styles.head}
                          textStyle={styles.text}
                        />

                        {/*courseList.map((rowdata , index) =>( 
                          <TableWrapper key ={index} style={styles.wrapper} widthArr>                              
                            {
                              rowdata.map((cellData, cellIndex) => ( <Cell key={cellIndex} data={cellIndex === 1 ? <RedirectCell text={cellData} />: cellData} textStyle={styles.text} />))
                            }
                          </TableWrapper>
                          ))*/}
                        {
                        <TableWrapper style={styles.wrapper}>
                          <Rows
                            data={courseList}
                            flexArr={[1, 2, 1 ,2]}
                            
                            style={styles.row}
                            textStyle={styles.text}
                          />
                        </TableWrapper>}
                  </Table>
                  
                </Block>
              </Block>
            </Block>
          </ScrollView>
        </ImageBackground>
      </Block>
    </Block>
  )
}

class CourseSearch extends React.Component {
  render() {
    return (
      <CourseSearchContent {...this.props}/>
    )
  }
}

const styles = StyleSheet.create({
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
  },
  button: {
    marginBottom: theme.SIZES.BASE * 0.1 ,
    width: width - theme.SIZES.BASE * 15,  
  },  
  title: { flex: 1, backgroundColor: '#2ecc71' },
  row: { height: 35},
  head: { height: 40, backgroundColor: '#CC085E' },
  wrapper: { flexDirection: 'row' },
  text: { textAlign: 'center', fontSize: 10 },
  redirectText: { textAlign: 'center', fontSize: 10, color: 'blue', textDecorationLine: 'underline'}
});

export default CourseSearch;
