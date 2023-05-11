import { connect } from 'react-redux';
import Logotype from '../components/Logotype';
import InputSearchActions from 'app/modules/input-search/actions';

export default connect(
  ({ account: { isAuth }, router: { location } }) => ({
    isAuth,
    location,
  }),
  dispatch => ({
    resetQuerySearch: () => dispatch(InputSearchActions.resetSeacrhInput()),
  })
)(Logotype);
