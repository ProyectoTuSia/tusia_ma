import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";

import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import { gql , useQuery, useLazyQuery } from '@apollo/client'

import jwtDecode from "jwt-decode";

const { width, height } = Dimensions.get("screen");

function LoginContent(props){
  const [loginStatus, setLoginStatus] = useState(false)
  
  //Datos del formulario
  const [userEmail, setUserEmail] = useState('')
  const [userPass, setUserPass] = useState('')
  
  const LOGINQUERYINFO = gql`query LOGINQUERYINFO($email:String!,$password:String!){authLogin(email:$email,password:$password)}`
  const [loadEntries, { data: entriesData }] = useLazyQuery(LOGINQUERYINFO);
  const entries = entriesData && entriesData.authLogin ? entriesData.authLogin : [];

  //Desencriptar token y solo pasar el usuario
  useEffect(() => {
    //Variable para almacenar la token desencriptada
    let decriptedTokenInfo = {}
    //Si se realizo el login correctamente
    if((entries != '') && (entries !== "Wrong password" && entries !== "User not found")){
      //Desencriptar la token y almacenar la información que contenia
      decriptedTokenInfo = jwtDecode(entries)
      props.navigation.navigate('Home', {decriptedTokenInfo, entries})
    }
  },[loginStatus]);

  return(
    <Block flex middle>
        <StatusBar hidden />
        <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height, zIndex: 1 }}
        >
          <Block safe flex middle>
            <Block style={styles.registerContainer}>
              <Block flex={0.25} middle style={styles.socialConnect}>
                <Text color="#8898AA" size={14}>
                  Bienvenido a TUSIA, Ingresa tus datos.
                </Text>
              </Block>
              <Block flex>
                <Block flex={0.17} middle>
                </Block>
                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >
                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                      <Input
                        onChangeText = {(texto) => setUserEmail(texto)}
                        borderless
                        placeholder="Correo Institucional"
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="hat-3"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>
                    <Block width={width * 0.8}>
                      <Input
                        onChangeText = {(texto) => setUserPass(texto)}
                        password
                        borderless
                        placeholder="Contraseña"
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="padlock-unlocked"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>
                    <Block middle>
                      <Button style={styles.createButton} onPress = {() => loadEntries({variables:{email:userEmail, password:userPass}})}>
                        <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                          INICIAR SESION
                        </Text>
                      </Button>
                      <Text color = "red">
                          {(entries != '' && !loginStatus) ? ((entries === "Wrong password" || entries === "User not found") ? "Usuario y/o contraseña incorrectas" : setLoginStatus(true)) : ''}
                      </Text>
                    </Block>
                  </KeyboardAvoidingView>
                </Block>
              </Block>
            </Block>
          </Block>
        </ImageBackground>
    </Block>
  );
}

class Register extends React.Component {  
  render() {
    return (
      <LoginContent {... this.props}/>
    );
  }
}

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.875,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden"
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
    backgroundColor : "#CC085E"
  }
});

export default Register;
