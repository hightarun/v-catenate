const initialState = {
  token:
    typeof localStorage !== "undefined" ? localStorage.getItem("token") : null,
  isAuthenticated: false,
  loading: true,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "OK":
    default:
      return state;
  }
};

export default authReducer;
