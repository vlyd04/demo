import { useEffect, useState } from 'react';
import logo from './logo.svg';
import { getLanguageCodeFromSession } from './helpers/CommonHelper';
import Config from './helpers/Config';
import RouteConfig from './RouteConfig';

//--Redux related imports starts here
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, reduxStore } from '../src/stateManagment/reduxStore';
//--Redux related imports ends here

// Styles
import "./resources/themeContent/scss/app.scss"
import './resources//custom/css/site.css'
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [langCode, setLangCode] = useState('en');

    useEffect(() => {

        try {
            let lnCode = getLanguageCodeFromSession();
            setLangCode(lnCode);
            if (langCode == Config.LANG_CODES_ENUM["Arabic"]) {
                document.documentElement.lang = Config.LANG_CODES_ENUM["Arabic"];
                if (document.body?.classList.contains("ltr")) {
                    document.body.classList.add("rtl");
                    document.body.classList.remove("ltr");
                  }
            } else {
                document.documentElement.lang = Config.LANG_CODES_ENUM["English"];
                document.body.classList.add("ltr");
                document.body.classList.remove("rtl");
            }


        } catch (error) {
            console.error('An error occurred:', error.message);
            document.documentElement.lang = Config.LANG_CODES_ENUM["English"];
        }

    }, [langCode]);



  return (
      <Provider store={reduxStore}>
          <PersistGate loading={null} persistor={persistor}>

              <RouteConfig />
              

          </PersistGate>
      </Provider>

  );
}

export default App;
