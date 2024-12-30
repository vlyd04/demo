import * as actionType from '../actionTypes';

const setLoading = (loading) => {
    return {
        type: actionType.SET_LOADING,
        loading
    }
}

const setWebsiteLogo = (webLogo) => {
    return {
        type: actionType.SET_WEBSITE_LOGO,
        payload: webLogo
    }
}
const setLangCodeInRedux = (langCode) => {
    return {
        type: actionType.SET_LANGUAGE_CODE,
        payload: langCode
    }
}

const setLeftMenu = (isSet) => {
    return {
        type: actionType.SET_LEFT_MENU,
        payload: isSet
        
    }
}


export default {
    setLoading,
    setWebsiteLogo,
    setLangCodeInRedux,
    setLeftMenu
}