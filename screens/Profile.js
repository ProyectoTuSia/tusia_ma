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

const PROFILEQUERYINFO = gql`query PROFILEQUERYINFO($token:String!){
  authGetAllUsers(token:$token){
    basicData{
      mail
      role
      fullName
      idCard
      idIssuingDept
      idIssuingPlace
      gender
      ethnicity
      personalMail
      mobileNumber
      landlineTelephone
    }
    birthData {
      birthDate
      countryBirth
      departmentBirth
      municipalityBirth
      nationality
    }
    healthData {
      bloodType
      rhFactor
      eps
    }
    responsible {
      responsibleFatherData {
        nameResponsibleParent
        firstSurname
        secondSurname
        documentType
        idNumber
      }
      responsibleMotherData {
        nameResponsibleParent
        firstSurname
        secondSurname
        documentType
        idNumber
      }
    }
    originData {
      address
      municipality
      department
      postalCode
      stratum
    }
    residenceData {
      address
      municipality
      department
      postalCode
      telephone
    }
    militarySituation {
      militaryPassbook
    }
  }
}`

function ProfileContent(props){
  console.log(props.route.params)
  const {loading, error, data} = useQuery(PROFILEQUERYINFO,{variables:{token:props.route.params}})

  if(loading){
    return(
      <Text>Loading...</Text>
    )
  }

  if(error){
    return(
      <Text>Error ${error.message}</Text>
    )
  }

  //La query fue exitosa, usar esta variable para reducir texto abajo
  const userData = data.authGetAllUsers[0]

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
                  <Text bold size={28} color="#32325D">
                    Información Personal
                  </Text>
                </Block>
                <Block middle style={{ marginTop: 0, marginBottom: 0 }}>
                  <Block style={styles.divider} />
                </Block>
                <Block middle style={{ marginTop: 10, marginBottom: 10 }}>
                  <Text italic bold size={20} color="#32325D">
                    Datos básicos
                  </Text>
                  <Text size={16} color="#32325D" style={{ marginTop: 1, textAlign: "center" }}>
                    {userData.basicData.fullName}
                    {'\n'}
                    {'\n'}
                    {"Rol: "+userData.basicData.role}
                    {'\n'}
                    {"Correo: "+userData.basicData.mail}
                    {'\n'}
                    {"Documento: "+userData.basicData.idCard}
                    {'\n'}
                    {"Sexo Biologico: "+userData.basicData.gender}
                    {'\n'}
                    {"Etnia: "+userData.basicData.ethnicity}
                    {'\n'}
                    {"Celular: "+userData.basicData.mobileNumber}
                    {'\n'}
                    {"Télefono: "+userData.basicData.landlineTelephone}
                    {'\n'}
                    {"Correo personal: "+userData.basicData.personalMail}
                  </Text>
                </Block>

                <Block middle style={{ marginTop: 10, marginBottom: 0 }}>
                  <Block style={styles.divider} />
                </Block>
                <Block middle style={{ marginTop: 10, marginBottom: 10 }}>
                  <Text italic bold size={20} color="#32325D">
                    Datos de nacimiento
                  </Text>
                  <Text size={16} color="#32325D" style={{ marginTop: 1, textAlign: "center" }}>
                    {"Fecha: "+userData.birthData.birthDate.slice(0,10)}
                    {'\n'}
                    {"Nacionalidad : "+userData.birthData.nationality}
                  </Text>
                </Block>

                <Block middle style={{ marginTop: 10, marginBottom: 0 }}>
                  <Block style={styles.divider} />
                </Block>
                <Block middle style={{ marginTop: 10, marginBottom: 10 }}>
                  <Text italic bold size={20} color="#32325D">
                    Datos médicos
                  </Text>
                  <Text size={16} color="#32325D" style={{ marginTop: 1, textAlign: "center" }}>
                    {"Tipo de sangre: "+userData.healthData.bloodType}
                    {'\n'}
                    {"Factor RH: "+userData.healthData.rhFactor}
                    {'\n'}
                    {"EPS: "+userData.healthData.eps}
                  </Text>
                </Block>

                <Block middle style={{ marginTop: 10, marginBottom: 0 }}>
                  <Block style={styles.divider} />
                </Block>
                <Block middle style={{ marginTop: 10, marginBottom: 10 }}>
                  <Text italic bold size={20} color="#32325D">
                    Responsables
                  </Text>
                  <Text italic size={18} color="#32325D" style={{ marginTop: 1, textAlign: "center" }}>
                    Datos Responsable 1:
                  </Text>
                  <Text size={16} color="#32325D" style={{ marginTop: 1, textAlign: "center" }}>
                    {"Nombre: "+userData.responsible.responsibleFatherData.nameResponsibleParent+" "+userData.responsible.responsibleFatherData.firstSurname+" "+userData.responsible.responsibleFatherData.secondSurname}
                    {'\n'}
                    {"Tipo de documento: "+userData.responsible.responsibleFatherData.documentType}
                    {'\n'}
                    {"Numero: "+userData.responsible.responsibleFatherData.idNumber}
                  </Text>
                  <Text italic size={18} color="#32325D" style={{ marginTop: 1, textAlign: "center" }}>
                    Datos Responsable 2:
                  </Text>
                  <Text size={16} color="#32325D" style={{ marginTop: 1, textAlign: "center" }}>
                  {"Nombre: "+userData.responsible.responsibleMotherData.nameResponsibleParent+" "+userData.responsible.responsibleMotherData.firstSurname+" "+userData.responsible.responsibleMotherData.secondSurname}
                    {'\n'}
                    {"Tipo de documento: "+userData.responsible.responsibleMotherData.documentType}
                    {'\n'}
                    {"Numero: "+userData.responsible.responsibleMotherData.idNumber}
                  </Text>
                </Block>

                <Block middle style={{ marginTop: 10, marginBottom: 0 }}>
                  <Block style={styles.divider} />
                </Block>
                <Block middle style={{ marginTop: 10, marginBottom: 10 }}>
                  <Text italic bold size={20} color="#32325D">
                    Datos de procedencia
                  </Text>
                  <Text size={16} color="#32325D" style={{ marginTop: 1, textAlign: "center" }}>
                    {"Direccion: "+userData.originData.address}
                    {'\n'}
                    {"Municipio : "+userData.originData.municipality}
                    {'\n'}
                    {"Departamento : "+userData.originData.department}
                    {'\n'}
                    {"Código postal: "+userData.originData.postalCode}
                    {'\n'}
                    {"Estrato: "+userData.originData.stratum}
                  </Text>
                </Block>

                <Block middle style={{ marginTop: 10, marginBottom: 0 }}>
                  <Block style={styles.divider} />
                </Block>
                <Block middle style={{ marginTop: 10, marginBottom: 10 }}>
                  <Text italic bold size={20} color="#32325D">
                    Datos de residencia
                  </Text>
                  <Text size={16} color="#32325D" style={{ marginTop: 1, textAlign: "center" }}>
                    {"Dirección: "+userData.residenceData.address}
                    {'\n'}
                    {"Municipio: "+userData.residenceData.municipality}
                    {'\n'}
                    {"Departamento: "+userData.residenceData.department}
                    {'\n'}
                    {"Código postal: "+userData.residenceData.postalCode}
                    {'\n'}
                    {"Teléfono: "+userData.residenceData.telephone}
                  </Text>
                </Block>

                <Block middle style={{ marginTop: 10, marginBottom: 0 }}>
                  <Block style={styles.divider} />
                </Block>
                <Block middle style={{ marginTop: 10, marginBottom: 10 }}>
                  <Text italic bold size={20} color="#32325D">
                    Situación militar
                  </Text>
                  <Text size={16} color="#32325D" style={{ marginTop: 1, textAlign: "center" }}>
                    {"¿Cuenta con libreta militar? "+(userData.militarySituation.militaryPassbook ? 'Sí' : 'No')}
                  </Text>
                </Block>

              </Block>
            </Block>
          </ScrollView>
        </ImageBackground>
      </Block>
    </Block>
  );
}
class Profile extends React.Component {
  render() {
    return(
      <ProfileContent {... this.props}/>
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

export default Profile;
