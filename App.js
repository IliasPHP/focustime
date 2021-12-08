import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  AsyncStorage,
} from 'react-native';
import { Focus } from './src/features/focus/Focus';
import { FocusHistory } from './src/features/focus/FocusHistory';
import { Timer } from './src/features/timer/Timer';
import { colors } from './src/util/Colors';
import { spacing } from './src/util/FontSizes';

const STATUS = {
  COMPLET: 1,
  CANCEL: 0,
};
export default function App() {
  const [focusSubject, SetFocusSubject] = useState(null);
  const [focusHistory, SetFocusHistory] = useState([]);

  const addSubjectToHistory = (subject, status) => {
    SetFocusHistory([
      ...focusHistory,
      { key: String(focusHistory.length + 1), subject, status },
    ]);
  };
  const onClear = () => {
    SetFocusHistory([]);
  };

  const saveFocusHistory = async () => {
    try {
      await AsyncStorage.setItem('focusHistory', JSON.stringify(focusHistory));
    } catch (e) {
      console.log(e);
    }
  };

  const loadHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('focusHistory');
      if (history && JSON.parse(history).length) {
        SetFocusHistory(JSON.parse(history));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    saveFocusHistory();
  }, [focusHistory]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.darkBlue} barStyle="light-content" />

      {focusSubject ? (
        <Timer
          focusSubject={focusSubject}
          onTimeEnd={() => {
            addSubjectToHistory(focusSubject, STATUS.COMPLET);
            SetFocusSubject(null);
          }}
          clearSubject={() => {
            addSubjectToHistory(focusSubject, STATUS.CANCEL);
            SetFocusSubject(null);
          }}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <Focus addSubject={SetFocusSubject} />
          <FocusHistory focusHistory={focusHistory} onClear={onClear} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBlue,
    padding: Platform.OS === 'ios' ? spacing.xl : spacing.xxxl,
    paddingLeft: Platform.OS === 'ios' ? spacing.md : spacing.lg,
    paddingRight: Platform.OS === 'ios' ? spacing.md : spacing.lg,
  },
});
