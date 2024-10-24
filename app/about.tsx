import  React from 'react';
import { Text, View, StyleSheet, TextInput,SafeAreaView } from 'react-native';


export default function AboutScreen() {
    const [text, onChangeText] = React.useState('Useless Text');
    const [number, onChangeNumber] = React.useState('');
    return (
        <View style={styles.container}>
            <Text style={styles.text}>About screen</Text>
            <SafeAreaView>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={text}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeNumber}
                    value={number}
                    placeholder="useless placeholder"
                    keyboardType="numeric"
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
    },
    input: {
        
        backgroundColor: 'white',
        fontSize: 18, 
        padding: 17, 
        borderWidth: 1, 
        borderColor: '#999', 
        borderRadius: 5, 
        marginBottom: 20, 
    },
});
