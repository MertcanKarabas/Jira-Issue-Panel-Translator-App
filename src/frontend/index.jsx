import React, { Fragment, useEffect, useState } from 'react';
import ForgeReconciler, { ButtonGroup, Text, Button, Heading } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {

  const LANGUAGES = [
    ['English', 'en'],
    ['Spanish', 'es'],
    ['French', 'fr'],
    ['German', 'de'],
  ]
  const [translation, setTranslation] = useState(null);
  const setLanguage = async (countryCode) => {
    const resp = await invoke('setLanguage', { countryCode });
    setTranslation(resp);
  }
  return (
    <Fragment>
      {translation &&
        <Fragment>
          <Heading as='h4'>{translation.summary}</Heading>
          <Text>{translation.description}</Text>
        </Fragment>}
      <ButtonGroup>
        {LANGUAGES.map(([language, code]) => (
          <Button
            key={code}
            onClick={async () => {
              await setLanguage(code);
            }}
          >{language}</Button>

        ))}
      </ButtonGroup>
    </Fragment>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
