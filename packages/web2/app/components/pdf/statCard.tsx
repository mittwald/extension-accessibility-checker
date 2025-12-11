import { View, Text, StyleSheet } from '@react-pdf/renderer';

interface StatCardProps {
  value: string | number;
  label: string;
  description: string;
}

const styles = StyleSheet.create({
  accentBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 8,

    width: 161,
    height: 172,

    backgroundColor: '#F8F8F8',
    borderRadius: 4,
    flexGrow: 1,
  },
  bigNumberWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  valueText: {
    fontFamily: 'Inter',
    fontWeight: 700,
    fontSize: 24,
    lineHeight: 1.5,
    textAlign: 'center',
    color: '#222222',
  },
  labelText: {
    fontFamily: 'Inter',
    fontWeight: 700,
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: 'center',
    color: '#222222',
  },
  descriptionText: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: 'center',
    color: '#222222',
  },
});

const StatCard = ({ value, label, description }: StatCardProps) => {
  return (
    <View style={styles.accentBox}>
      <View style={styles.bigNumberWrapper}>
        <Text style={styles.valueText}>{value}</Text>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <Text style={styles.descriptionText}>
        {description}
      </Text>
    </View>
  );
};

export default StatCard;
