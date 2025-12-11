import React from 'react';
import { View, Text, StyleSheet, Svg, Path, ViewProps } from '@react-pdf/renderer';

interface AlertProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  style?: ViewProps['style'];
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: 515,
    minHeight: 115,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderStyle: 'solid',
    borderColor: '#F56800',
    borderRadius: 4,
    overflow: 'hidden',
  },
  leftBorder: {
    width: 8,
    height: '100%',
    backgroundColor: '#F56800',
    flexGrow: 0,
    flexShrink: 0,
  },
  innerFrame: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 16,
    width: 507,
    flexGrow: 1,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
    width: 475,
    flexGrow: 1,
  },
  headingRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 95,
    height: 21,
    flexGrow: 0,
  },
  iconContainer: {
    width: 21,
    height: 21,
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 0,
  },
  headline: {
    fontFamily: 'Inter',
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 1.5,
    color: '#C25200',
    height: 21,
  },
  description: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: 12,
    lineHeight: 1.5,
    color: '#222222',
    width: 475,
  },
});

const AlertIcon = () => (
  <Svg width="21" height="21" viewBox="26 18 19 19">
    <Path
      fillRule="evenodd"
      d="M29.3128 21.3128C30.9538 19.6719 33.1794 18.75 35.5 18.75C37.8206 18.75 40.0462 19.6719 41.6872 21.3128C43.3281 22.9538 44.25 25.1794 44.25 27.5C44.25 28.6491 44.0237 29.7869 43.5839 30.8485C43.1442 31.9101 42.4997 32.8747 41.6872 33.6872C40.8747 34.4997 39.9101 35.1442 38.8485 35.5839C37.7869 36.0237 36.6491 36.25 35.5 36.25C34.3509 36.25 33.2131 36.0237 32.1515 35.5839C31.0899 35.1442 30.1253 34.4997 29.3128 33.6872C28.5003 32.8747 27.8558 31.9101 27.4161 30.8485C26.9763 29.7869 26.75 28.6491 26.75 27.5C26.75 25.1794 27.6719 22.9538 29.3128 21.3128ZM35.5 20.5C33.6435 20.5 31.863 21.2375 30.5503 22.5503C29.2375 23.863 28.5 25.6435 28.5 27.5C28.5 28.4193 28.6811 29.3295 29.0328 30.1788C29.3846 31.0281 29.9002 31.7997 30.5503 32.4497C31.2003 33.0998 31.9719 33.6154 32.8212 33.9672C33.6705 34.3189 34.5807 34.5 35.5 34.5C36.4193 34.5 37.3295 34.3189 38.1788 33.9672C39.0281 33.6154 39.7997 33.0998 40.4497 32.4497C41.0998 31.7997 41.6154 31.0281 41.9672 30.1788C42.3189 29.3295 42.5 28.4193 42.5 27.5C42.5 25.6435 41.7625 23.863 40.4497 22.5503C39.137 21.2375 37.3565 20.5 35.5 20.5ZM35.5 23.125C35.9832 23.125 36.375 23.5168 36.375 24V27.5C36.375 27.9832 35.9832 28.375 35.5 28.375C35.0168 28.375 34.625 27.9832 34.625 27.5V24C34.625 23.5168 35.0168 23.125 35.5 23.125ZM34.625 31C34.625 30.5168 35.0168 30.125 35.5 30.125H35.5087C35.992 30.125 36.3837 30.5168 36.3837 31C36.3837 31.4832 35.992 31.875 35.5087 31.875H35.5C35.0168 31.875 34.625 31.4832 34.625 31Z"
      fill="#C25200"
    />
  </Svg>
);

const Alert = ({ title, description, icon, style }: AlertProps) => {
  return (
    <View style={{...styles.container, ...style}}>
      <View style={styles.leftBorder} />
      <View style={styles.innerFrame}>
        <View style={styles.content}>
          <View style={styles.headingRow}>
            <View style={styles.iconContainer}>
              {icon || <AlertIcon />}
            </View>
            <Text style={styles.headline}>{title}</Text>
          </View>
          <Text style={styles.description}>
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Alert;
