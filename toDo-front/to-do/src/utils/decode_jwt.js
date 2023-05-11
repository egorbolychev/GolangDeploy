
const decode_jwt = (name, token) => {
    if (token) {
        try {
            return jwt(token)[name]
        } catch (e) {
            return ""
        }
    } else {
        return ''
    }
  }

export default decode_jwt