import React , {useState} from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Button } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { gql , useQuery, useLazyQuery } from '@apollo/client'


const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

const GETCOURSEINFO = gql`query GetSubjectById($idSubject: Int!) {
  getSubjectById(Id_subject: $idSubject) {
    Id_subject
    Name_subject
    Credits
    Typology
    Description
    Id_career
  }
}`

const GET_TYPOLOGY = gql`query GetTypeTypology {
  getTypeTypology {
    Id_typology
    Name_typology
  }
}`

function CourseInfoContent(props){
  // const {loading, error, data} = useQuery(PROFILEQUERYINFO,{variables:{token:props.route.params}})  
  // console.log(props.route.params.courseCode)
  // const [basicInfo , setBasicInfo] = useState([])
  const { data:typologyInfo} = useQuery(GET_TYPOLOGY) 

  const { data:courseInfo } = useQuery(GETCOURSEINFO, { variables:{idSubject:props.route.params.courseCode} })
  
  let basicInfo = ['','','','','','','']
  if (courseInfo && courseInfo.getSubjectById && typologyInfo && typologyInfo.getTypeTypology) {
    basicInfo = [courseInfo.getSubjectById.Id_subject, courseInfo.getSubjectById.Name_subject, courseInfo.getSubjectById.Credits, typologyInfo.getTypeTypology[courseInfo.getSubjectById.Typology].Name_typology , courseInfo.getSubjectById.Description, courseInfo.getSubjectById.Id_career.reduce( (total,current) => total + '\n-' + current,'')]
  }
  /* if(loading){
    return(
      <Text>Loading...</Text>
    )
  }

  if(error){
    //Lanza warning
    //Volver a la pantalla de inicio porque la token ya expiro
    //Depronto mandar un mensaje de advertencia en la pantalla principal 
    return(
      <>{props.navigation.navigate('Onboarding')}</>
    )
  } */

  //La query fue exitosa, usar esta variable para reducir texto abajo
  // const userData = data.authGetAllUsers[0]

  return (
    <Block flex style={styles.profile}>
      <Block flex>
        <ImageBackground
          source={Images.ProfileBackground}
          style={styles.profileContainer}
          imageStyle={styles.profileBackground}
        >
          <ScrollView
            showsVerticalScrollIndicator={true}
            style={{ width, marginTop: '25%' }}
          >
            <Block flex style={styles.profileCard}>
              <Block middle style={styles.avatarContainer}>
                <Image
                  source={{ uri: 'https://images.vexels.com/media/users/3/147101/isolated/preview/b4a49d4b864c74bb73de63f080ad7930-instagram-profile-button.png' }}
                  style={styles.avatar}
                />
              </Block>
              <Block flex>
                <Block middle style={styles.nameInfo}>
                  <Text bold size={28} center color="#32325D">
                    Información de la asignatura
                  </Text>
                </Block>
                <Block middle style={{ marginTop: 0, marginBottom: 0 }}>
                  <Block style={styles.divider} />
                </Block>
                <Block middle style={{ marginTop: 10, marginBottom: 10 }}>
                  <Text italic bold size={20} color="#32325D">
                    Datos de la asignatura
                  </Text>
                  <Text size={16} color="#32325D" style={{ marginTop: 1, textAlign: "left" }}>      
                    <Text bold>{'\n'}1.Código:</Text><Text>{basicInfo[0]}{'\n'}</Text>
                    <Text bold>2.Nombre: </Text><Text>{basicInfo[1]}{'\n'}</Text>            
                    <Text bold>3.Número de créditos: </Text> <Text>{basicInfo[2]}{'\n'}</Text>
                    <Text bold>4.Tipología: </Text> <Text>{basicInfo[3]}{'\n'}</Text>
                    <Text bold>5.Descripción:{'\n'}</Text> <Text style={{paddingLeft: 10}}>{basicInfo[4]}{'\n'}</Text>
                    <Text bold>6.Carreras a las que se oferta: </Text> <Text>{basicInfo[5]} </Text>
                  </Text>
                </Block>

                <Block middle style={{ marginTop: 10, marginBottom: 0 }}>
                  <Block style={styles.divider} />
                </Block>      


                <Block middle style={{ marginTop: 10, marginBottom: 0 }}>
                  <Block style={styles.divider} />
                </Block>   

              </Block>
            </Block>
          </ScrollView>
        </ImageBackground>
      </Block>
    </Block>
  );
}
class CourseInfo extends React.Component {
  render() {
    return(
      <CourseInfoContent {...this.props} />
    ); 
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
    width: width    
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
    marginTop: 35,
    textAlign: "center"
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

export default CourseInfo;
