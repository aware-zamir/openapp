import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
  Image,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { Button, Text, Card, Title, IconButton } from 'react-native-paper';

// Constants
const SCREEN_WIDTH = Dimensions.get('window').width;
const GAME_CHOICES = ['rock', 'paper', 'scissors'];
const CHOICE_EMOJIS = {
  rock: '🧱',
  paper: '📄',
  scissors: '✂️',
};

const App = () => {
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [level, setLevel] = useState(1);
  const [levelPassed, setLevelPassed] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    if (level > 3) {
      setGameCompleted(true);
    }
  }, [level]);

  const determineWinner = (user, computer) => {
    if (user === computer) return "tie! 🤝";
    
    const winningConditions = {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper'
    };

    if (winningConditions[user] === computer) {
      setLevelPassed(true);
      return 'win! 🎉';
    } else {
      setLevelPassed(false);
      return 'lose! 😞';
    }
  };

  const play = (choice) => {
    const randomChoice = GAME_CHOICES[Math.floor(Math.random() * GAME_CHOICES.length)];
    setUserChoice(choice);
    setComputerChoice(randomChoice);
    setResult(determineWinner(choice, randomChoice));
  };

  const goToNextLevel = () => {
    if (levelPassed) {
      setLevel(prev => prev + 1);
      setUserChoice(null);
      setComputerChoice(null);
      setResult('');
      setLevelPassed(false);
    } else {
      Alert.alert('Level Locked', 'You must win this level to proceed!');
    }
  };

  const restartGame = () => {
    setLevel(1);
    setUserChoice(null);
    setComputerChoice(null);
    setResult('');
    setLevelPassed(false);
    setGameCompleted(false);
  };

  const closeGame = () => {
    Alert.alert(
      'Exit Game',
      'Are you sure you want to exit?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: () => console.log('Game exited'),
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const renderLevelContent = () => {
    if (gameCompleted) {
      return (
        <View style={styles.screenContainer}>
          <IconButton 
            icon="close" 
            onPress={closeGame} 
            style={styles.closeButton}
            size={24}
            color="#666"
          />
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Title style={styles.title}>🎉 Congratulations!</Title>
              <Text style={styles.text}>You've completed all the games!</Text>
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/7435/7435977.png' }}
                style={styles.chestImage}
                resizeMode="contain"
              />
              <Text style={styles.giftText}>🎁 Here's your treasure: Infinite Laughter 🪙😆</Text>
              <Button 
                mode="contained" 
                onPress={restartGame} 
                style={styles.button}
                labelStyle={styles.buttonLabel}
                contentStyle={styles.buttonContent}
              >
                Play Again
              </Button>
            </Card.Content>
          </Card>
        </View>
      );
    }

    switch (level) {
      case 1:
        return (
          <View style={styles.screenContainer}>
            <IconButton 
              icon="close" 
              onPress={closeGame} 
              style={styles.closeButton}
              size={24}
              color="#666"
            />
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Title style={styles.title}>Level 1: Wanna Play?</Title>
                <View style={styles.choicesContainer}>
                  {GAME_CHOICES.map((choice) => (
                    <TouchableOpacity
                      key={choice}
                      style={styles.choiceButton}
                      onPress={() => play(choice)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.choiceEmoji}>{CHOICE_EMOJIS[choice]}</Text>
                      <Text style={styles.choiceText}>{choice.toUpperCase()}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {userChoice && computerChoice && (
                  <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>
                      You chose {CHOICE_EMOJIS[userChoice]} {userChoice.toUpperCase()}
                    </Text>
                    <Text style={styles.resultText}>
                      Computer chose {CHOICE_EMOJIS[computerChoice]} {computerChoice.toUpperCase()}
                    </Text>
                    <Text style={[styles.result, { color: result.includes('win') ? '#4CAF50' : result.includes('lose') ? '#F44336' : '#2196F3' }]}>
                      {result}
                    </Text>
                  </View>
                )}
                {levelPassed && (
                  <Button
                    mode="outlined"
                    onPress={goToNextLevel}
                    style={styles.nextButton}
                    labelStyle={styles.nextButtonLabel}
                    contentStyle={styles.buttonContent}
                  >
                    Next Level ✨
                  </Button>
                )}
              </Card.Content>
            </Card>
          </View>
        );
      case 2:
        return <EmojiMemoryGame 
          onComplete={() => setLevelPassed(true)} 
          goToNextLevel={goToNextLevel} 
          onClose={closeGame}
        />;
      case 3:
        return <CatchTheCrazyEmoji 
          onLevelComplete={() => setLevelPassed(true)} 
          goToNextLevel={goToNextLevel} 
          onClose={closeGame}
        />;
      default:
        return <></>;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderLevelContent()}
    </SafeAreaView>
  );
};

const EmojiMemoryGame = ({ onComplete, goToNextLevel, onClose }) => {
  const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'];
  const [shuffled, setShuffled] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);

  useEffect(() => {
    const duplicated = [...EMOJIS, ...EMOJIS];
    setShuffled(duplicated.sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (matched.length === EMOJIS.length * 2) {
      onComplete();
    }
  }, [matched]);

  const handlePress = (index) => {
    if (selected.length === 2 || selected.includes(index) || matched.includes(index)) return;

    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (shuffled[first] === shuffled[second]) {
        setMatched(prev => [...prev, first, second]);
      }
      setTimeout(() => setSelected([]), 1000);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <IconButton 
        icon="close" 
        onPress={onClose} 
        style={styles.closeButton}
        size={24}
        color="#666"
      />
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Title style={styles.title}>Level 2: Memory Game 🧠</Title>
          <View style={styles.memoryGameContainer}>
            {shuffled.map((emoji, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handlePress(index)}
                style={[
                  styles.memoryCard,
                  (selected.includes(index) || matched.includes(index)) && styles.memoryCardFlipped
                ]}
                activeOpacity={0.7}
                disabled={(selected.includes(index) || matched.includes(index)) && selected.length === 2}
              >
                <Text style={styles.memoryCardEmoji}>
                  {selected.includes(index) || matched.includes(index) ? emoji : '❓'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {matched.length === EMOJIS.length * 2 && (
            <Button 
              mode="outlined" 
              onPress={goToNextLevel} 
              style={styles.nextButton}
              labelStyle={styles.nextButtonLabel}
              contentStyle={styles.buttonContent}
            >
              Next Level 🚀
            </Button>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

const CatchTheCrazyEmoji = ({ onLevelComplete, goToNextLevel, onClose }) => {
  const [position] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
  const [score, setScore] = useState(0);
  const animationRef = useRef();

  useEffect(() => {
    const move = () => {
      animationRef.current = Animated.timing(position, {
        toValue: {
          x: Math.random() * (SCREEN_WIDTH - 100),
          y: Math.random() * 300,
        },
        duration: score >= 5 ? 300 : 1200,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      });
      
      animationRef.current.start(() => move());
    };
    
    move();

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [score]);

  useEffect(() => {
    if (score >= 10) onLevelComplete();
  }, [score]);

  return (
    <View style={styles.screenContainer}>
      <IconButton 
        icon="close" 
        onPress={onClose} 
        style={styles.closeButton}
        size={24}
        color="#666"
      />
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Title style={styles.title}>Level 3:eat the soap</Title>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <View style={styles.gameArea}>
            <Animated.View
              style={[
                styles.targetContainer,
                {
                  transform: [
                    { translateX: position.x },
                    { translateY: position.y },
                  ],
                },
              ]}
            >
              <TouchableOpacity 
                onPress={() => setScore(prev => prev + 1)}
                activeOpacity={0.7}
              >
                <Text style={styles.targetEmoji}>🧼</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
          {score >= 10 && (
            <Button 
              mode="outlined" 
              onPress={goToNextLevel} 
              style={styles.nextButton}
              labelStyle={styles.nextButtonLabel}
              contentStyle={styles.buttonContent}
            >
              Open Treasure Chest 💎
            </Button>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    elevation: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  choicesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  choiceButton: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#e3f2fd',
    width: 110,
    height: 110,
    elevation: 4,
  },
  choiceEmoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  choiceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textTransform: 'uppercase',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    width: '100%',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 6,
    color: '#555',
    fontWeight: '500',
  },
  result: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  gameArea: {
    width: '100%',
    height: 320,
    backgroundColor: '#e0f7fa',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  targetContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  targetEmoji: {
    fontSize: 52,
  },
  memoryGameContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  memoryCard: {
    width: 70,
    height: 70,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f7fa',
    borderRadius: 16,
    elevation: 4,
  },
  memoryCardFlipped: {
    backgroundColor: '#b2ebf2',
    transform: [{ rotateY: '180deg' }],
  },
  memoryCardEmoji: {
    fontSize: 34,
  },
  button: {
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    width: '100%',
    maxWidth: 200,
  },
  nextButton: {
    marginTop: 16,
    borderRadius: 12,
    borderColor: '#2196F3',
    borderWidth: 2,
    paddingVertical: 8,
    width: '100%',
    maxWidth: 200,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  nextButtonLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2196F3',
  },
  giftText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
    lineHeight: 24,
    fontWeight: '500',
  },
  chestImage: {
    width: 140,
    height: 140,
    marginVertical: 16,
  },
});

export default App;