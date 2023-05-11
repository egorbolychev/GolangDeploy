import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from './actions';
import userMenuActions from 'app/modules/user-menu/actions';
import UserMenuSwitcher from './UserMenuSwitcher';
import { serializeAccountName } from 'app/utils/serializers';

const mapStateToProps = ({ profiles, userMenu, account }) => ({
  name: profiles.loaded && serializeAccountName(account, profiles.data),
  avatar: profiles.loaded && serializeAccountName(account, profiles.data, 'image_60x60'),
  showUserMenu: userMenu.showUserMenu,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...actions, ...userMenuActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserMenuSwitcher);
