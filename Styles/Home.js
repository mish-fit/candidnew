import { Dimensions, StyleSheet } from 'react-native';
import { background, borderColor } from '../Screens/Exports/Colors';

const { width } = Dimensions.get('screen');
const { height } = Dimensions.get('screen');

export const home = StyleSheet.create({
  modalText: {},
  howToEarn: {
    color: '#555',
  },
  modalButton: {
    borderRadius: 50,
    backgroundColor: '#5D475F',
    padding: 10,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  modalButtonText: {
    color: 'white',
  },
  feedAltHeading: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 20,
    marginVertical: 10,
    color: '#444',
  },
  container: {
    flex: 1,
    backgroundColor: background,
  },
  // ACTIVITY AND MODAL
  modalContainer: {
    flex: 1,
  },
  modalView: {
    flex: 1,
    backgroundColor: background,
    width,
    height,
  },
  modalHeading: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  modalText: {
    color: borderColor,
  },
});
