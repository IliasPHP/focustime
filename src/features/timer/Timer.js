import { useKeepAwake } from 'expo-keep-awake';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Platform } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { colors } from '../../util/Colors';
import { spacing, fontSizes } from '../../util/FontSizes';
import { CountDown } from '../../components/CountDown';
import { Timing } from './Timing';
import {RoundedButton} from '../../components/RoundedButton';

const DEFAULT_MIN = 0.1;
export const Timer = ({ focusSubject, onTimeEnd, clearSubject }) => {
  useKeepAwake();
  const [isStarted, SetIsStarted] = useState(false);
  const [progress, setProgress] = useState(1);
  const [minutes, setMinutes] = useState(DEFAULT_MIN);

  const onProgress = (progress) => {
    setProgress(progress)
  }

  const vibrate = () => {
    if(Platform.OS === 'ios'){
      const interval = setInterval(() => Vibration.vibrate(),1000);
      setTimeout(() => clearInterval(interval),10000);
    }else {
      Vibration.vibrate(10000);
    }
  }

  const onEnd = () => {
    vibrate();
    setMinutes(DEFAULT_MIN)
    setProgress(1)
    SetIsStarted(false)
    onTimeEnd()
  }

  const changeTime = (min) => {
    setMinutes(min)
    setProgress(1)
    SetIsStarted(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.count}>
        <CountDown onEnd={onEnd} minutes={minutes} inPaussed={!isStarted} onProgress={onProgress} />
      </View>

      <View style={{ paddingTop: spacing.xxl }}>
        <Text style={styles.title}>Focussing on:</Text>
        <Text style={styles.task}>{focusSubject}</Text>
      </View>
      <View style={styles.progress}>
        <ProgressBar 
        progress={progress}
        color= '#5E84E2'
        style={{height:10}}
       />
      </View>
      <View style={styles.btnContainer}>
        <Timing onChangeTime={changeTime} />
      </View>
     <View style={styles.btnContainer}>
      {isStarted ?
        (<RoundedButton
          title='pause'
          onPress={() => {
            SetIsStarted(false);
          }}>
        </RoundedButton>
        )
       :
        (<RoundedButton
        title='start'
        onPress={() => {
          SetIsStarted(true);
        }}>
        </RoundedButton>
        )
      }
     </View>
      <View style={styles.clearSubject}>
        <RoundedButton
          title='Exit'
          size={50}
          onPress={() => {
            clearSubject()
          }}>
        </RoundedButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: colors.white,
    textAlign: 'center',
  },
  task: {
    fontSize: fontSizes.lg,
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  count: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    flex: 0.3,
    flexDirection: 'row',
    padding:spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: {
    paddingTop: spacing.sm
  },
  clearSubject: {
    paddingBottom: 25,
    paddingLeft: 25
  }
});
