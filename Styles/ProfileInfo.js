import { StyleSheet } from 'react-native';
import { background, theme } from '../Screens/Exports/Colors';
import { width } from '../Screens/Exports/Constants';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
  },
  // mainView
  mainViewContentContainer: {
    marginBottom: 5,
    backgroundColor: background,
  },
  mainViewContainer: {
    marginBottom: 5,
    backgroundColor: background,
  },
  // main view cover picture
  mainViewCoverContainer: {
    width,
    height: 180,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainViewCoverImage: {
    width,
    height: 180,
  },
  // main view display picture
  mainViewDisplayContainer: {
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
  },
  mainViewDisplayImage: {
    width: 80,
    height: 80,
  },
  // main View Details
  mainViewDetailsContainer: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainViewDetailsUserNameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    marginLeft: 0,
  },
  mainViewDetailsUserNameText: {
    padding: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: 'Roboto',
  },
  mainViewDetailsSummaryContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mainViewDetailsSummaryButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ddd',
  },
  mainViewDetailsSummaryValue: {
    marginRight: 15,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  mainViewDetailsSummaryName: {
    marginTop: 2,
    marginRight: 15,
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  // referral code container
  mainViewReferralCodeView: {
    borderStyle: 'dashed',
    borderRadius: 1,
    elevation: 1,
    borderColor: theme,
    padding: 5,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainViewReferralCodeText: {
    color: 'black',
  },

  // main view edit button
  mainViewEditProfileContainer: {},
  mainViewEditProfileButton: {
    backgroundColor: '#eee',
    margin: 10,
    borderRadius: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
    shadowColor: '#aaa',
  },
  mainViewEditProfileText: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    shadowOpacity: 2,
  },
  // list container
  listContainer: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  listHeaderView: {
    marginBottom: 10,
  },
  listHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  listOptionButton: {
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingBottom: 5,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  listOptionButtonText: {
    fontSize: 14,
    marginLeft: 10,
    fontStyle: 'italic',
  },
  listOptionButtonTextView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // my posted reviews view
  myPostedReviewsContainer: {},
  myPostedReviewsHeading: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    fontSize: 18,
    marginLeft: 20,
    margin: 5,
  },
  myPostedReviewsEmptyContainer: {},
  myPostedReviewsEmptyText: {
    fontSize: 16,
    fontFamily: 'Roboto',
    marginLeft: 10,
  },
  myPostedReviewsItemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ddd',
  },
  myPostedReviewsItemImageBackground: {
    flex: 1,
    width: width * 0.45,
    height: width * 0.45,
    borderColor: 'black',
    borderWidth: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    borderRadius: 10,
    opacity: 0.4,
    backgroundColor: 'black',
  },
  myPostedReviewsItemTextView: {
    ...StyleSheet.absoluteFillObject,
  },
  myPostedReviewsItemText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Roboto',
    fontWeight: '200',
    textAlign: 'center',
    marginTop: width * 0.05,
    marginLeft: 5,
    marginRight: 5,
  },
  updateReviewView: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'transparent',
    marginTop: 4,
    marginRight: 4,
    // marginBottom : 5,
    borderRadius: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
    shadowColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateReviewText: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    shadowOpacity: 2,
    color: theme,
  },

  // Edit User Details
  editUserDetailsDisplayContainer: {
    marginTop: 10,
    alignSelf: 'center',
  },
  editUserDetailsDisplayImageButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 20,
    overflow: 'hidden',
  },
  editUserDetailsDisplayImage: {
    width: 100,
    height: 100,
  },

  editUserDetailsInputContainer: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    flex: 1,
  },
  editUserProfileHeader: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  editUserDetailsElementContainer: {
    marginTop: 10,
  },
  editUserDetailsElementText: {
    color: '#888',
  },
  editUserDetailsElementTextInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    fontSize: 15,
    marginTop: 5,
    marginLeft: 0,
  },
  datepicker: {
    justifyContent: 'center',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    marginLeft: 20,
    marginRight: 10,
  },
  dateView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    marginLeft: 10,
  },
  editUserDetailsSubmitContainer: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  editUserDetailsSubmitButton: {
    backgroundColor: 'white',
    width: width * 0.5,
    marginTop: 20,
    alignItems: 'center',
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: theme,
  },
  editUserDetailsSubmitText: {
    color: theme,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Roboto',
  },
});
