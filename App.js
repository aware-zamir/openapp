import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
    const [randomNumber, setRandomNumber] = useState(0);

    const generateRandomNumber = () => {
        setRandomNumber(Math.floor(Math.random() * 100));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{randomNumber}</Text>
            <Button title="Generate" onPress={generateRandomNumber} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 24,
        marginBottom: 20,
    },
});