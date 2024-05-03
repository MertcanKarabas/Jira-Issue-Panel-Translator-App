import Resolver from '@forge/resolver';
import { checkResponse } from './utils/checkResponse';
import api, { route } from '@forge/api';

const resolver = new Resolver();

const API_KEY = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0'
resolver.define('setLanguage', async ({ context, payload }) => {
  const countryCode = payload.countryCode;
  const issueKey = context.extension.issue.key;

  const issueResponse = await api
    .asApp()
    .requestJira(
      route`/rest/api/2/issue/${issueKey}?fields=summary,description`
    );

  await checkResponse('Jira API', issueResponse);
  const { summary, description } = (await issueResponse.json()).fields;
  const translateResponse = await api.fetch(
    `${API_KEY}&to=${countryCode}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        // See README.md for details on generating a Translation API key
        'Ocp-Apim-Subscription-Key': process.env.TRANSLATE_API_KEY,
        'Ocp-Apim-Subscription-Region': process.env.TRANSLATE_API_LOCATION,
      },
      body: JSON.stringify([
        { Text: summary },
        { Text: description || 'No description' },
      ]),
    }
  );
  await checkResponse('Translate API', translateResponse);
  const [summaryTranslation, descriptionTranslation] =
    await translateResponse.json();

  // Update the UI with the translations
  return {
    to: countryCode,
    summary: summaryTranslation.translations[0].text,
    description: descriptionTranslation.translations[0].text,
  };

});

export const handler = resolver.getDefinitions();
