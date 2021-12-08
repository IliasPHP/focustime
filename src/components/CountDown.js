import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fontSizes, spacing } from '../util/FontSizes';
import { colors } from '../util/Colors';

const minuteToMills = (min) => min * 1000 * 60;

const formatTime = (time) => time < 10 ? `0${time}` : time

export const CountDown = ({ minutes = 0.1, inPaussed, onProgress, onEnd }) => {

  const interval = React.useRef(null);
  const [mills, SetMills] = useState(null);

  const countdown = () => {
    SetMills((time) => {
      if(time === 0) {
        return time;
      }
      const timeLeft = time - 1000;
      return timeLeft
    })
  }

  useEffect(() => {
    SetMills(minuteToMills(minutes));
  }, [minutes])

  useEffect(() => {
      onProgress(mills / minuteToMills(minute));
      if(mills === 0) {
          onEnd();        
      }
  },[mills])
  
  useEffect(() => {
    if(inPaussed) {
      if(interval.current) clearInterval(interval.current);
      return;
    }
    interval.current = setInterval(countdown,1000);
    return () => clearInterval(interval.current);
  },[inPaussed])



  const minute = Math.floor(mills / 1000 / 60) % 60;
  const seconds = Math .floor(mills / 1000) % 60;
  return <Text style={styles.text}>{formatTime(minute)}:{formatTime(seconds)}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    color: colors.white,
    padding: spacing.lg,
    backgroundColor: 'rgba(94,132,226,0.3)',
  },
});
