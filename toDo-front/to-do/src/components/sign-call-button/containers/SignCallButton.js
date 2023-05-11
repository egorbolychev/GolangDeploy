import { connect } from 'react-redux';

import signCallButtonActions from '../actions';

import SignCallButton from '../components/SignCallButton.jsx';

const mapStateToProps = ({ account }) => ({
  isAuth: account.isAuth,
  isLoaded: account.loaded,
});

const mapDispatchToProps = {
  ...signCallButtonActions,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignCallButton);
