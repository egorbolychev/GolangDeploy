import modalActions from '/src/modules/modal/actions';
import signActions from '/src/modules/sign/actions';

const signCallButtonActions = {
  showSignup: () => dispatch => {
    dispatch(signActions.showSignup());
    dispatch(modalActions.showModalWindow('UnauthorizedMessage'));
  },
  showSignin: () => dispatch => {
    dispatch(signActions.showSignin());
    dispatch(modalActions.showModalWindow('UnauthorizedMessage'));
  },
};

export default signCallButtonActions;
