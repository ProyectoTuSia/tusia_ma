import React from 'react';
import { StyleSheet, Dimensions, ScrollView, Image} from 'react-native';
import { Block, theme, Text } from 'galio-framework';

import { Button, Card } from '../components';
import articles from '../constants/articles';
const { width } = Dimensions.get('screen');

class Home extends React.Component {
  renderArticles = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
        <Block flex>
          <Block center>
            <Image source={{ uri:'https://lh3.googleusercontent.com/d/1Q7xLn2tppzd3-8ySQi98vKEDI6JcgFRQ'}} style={styles.logo} />
          </Block>
          <Text center size={20}>
            Bienvenido 
          </Text>
          <Text center>
          {this.props.route.params.decriptedTokenInfo.role + ": " + this.props.route.params.decriptedTokenInfo.email.split('@')[0]}
          </Text>
          <Card item={articles[0]} horizontal target = 'Profile' extraData = {this.props.route.params} />
          <Block flex row>
            { this.props.route.params.decriptedTokenInfo.role == "Estudiante" &&
            <Card item={articles[1]} style={{ marginRight: theme.SIZES.BASE }} target = 'AcademicHistory' extraData = {this.props.route.params.decriptedTokenInfo.email.split('@')[0]}/>
            }
            <Card item={articles[2]} target = 'CourseSearch' extraData={this.props}/>
          </Block>

          <Block flex center>
            <Button small center color="default" style={{backgroundColor : "#CC085E"}} onPress = {() => this.props.navigation.navigate('Onboarding')}>
                Cerrar Sesión
            </Button>
          </Block>
        </Block>
      </ScrollView>
    )
  }

  render() {
    return (
      <Block flex center style={styles.home}>
        {this.renderArticles()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    zIndex: 2,
    position: 'relative'
  },
  home: {
    width: width,    
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
});

export default Home;
