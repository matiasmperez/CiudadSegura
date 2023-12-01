import React from 'react';
import {TextInput} from 'react-native';
import Colors from '../../constants/colors';

const Input = props => {
  return (
    <TextInput
      {...props}
      style={{borderRadius: 100, color: Colors.white, paddingHorizontal: 10, width: '90%', backgroundColor: Colors.secondary, marginVertical: 10, height: 40}}
      placeholderTextColor={Colors.white}
      value={props.value}
      onChangeText={props.onChangeText}
      ></TextInput>
  );
};

export default Input;