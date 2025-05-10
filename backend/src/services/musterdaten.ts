import { DOMParser } from '../deps.ts';
import type { MusterData } from '../types.ts';
import { request } from './request.ts';

/**
 * takes HTML of search result page and returns the musterdaten for the first result
 * fails if there are more than one result
 */
export async function collectMusterdaten(
  rawHtml: string,
  rootUrl: string,
): Promise<MusterData | null> {
  const doc = new DOMParser().parseFromString(rawHtml, 'text/html');
  if (!doc) {
    throw new Error("couldn't parse HTML");
  }

  const searchResults = doc.querySelectorAll(
    'form > table.backcolor table tr:not(:first-child)',
  );
  if (searchResults.length !== 1) {
    return null;
  }

  const tableRow = searchResults[0] as HTMLTableRowElement;
  const hrefOfMusterDataLink = tableRow!
    .querySelector('a')
    ?.getAttribute('href');
  if (hrefOfMusterDataLink) {
    const urlToMusterData = new URL(hrefOfMusterDataLink, rootUrl);
    const musterdataResponse = await request(urlToMusterData.href);
    if (!musterdataResponse.ok) {
      console.error('wasnt able to fetch muster data from ${urlToMusterData}');
      return null;
    }

    const body = await musterdataResponse.text();
    const dataDoc = new DOMParser().parseFromString(body, 'text/html');
    if (!dataDoc) {
      throw new Error("couldn't parse HTML");
    }

    const specRows = dataDoc?.querySelectorAll(
      '#Table5 > tbody > tr:nth-child(2) > td > form > table > tbody > tr > td > table > tbody > tr:nth-child(4) tr',
    );
    let classification = '';
    let enClassification = '';
    let startWeight = 0;
    let endWeigth = 0;
    for (const row of specRows) {
      if (row.textContent.includes('EN-Klassifizierung')) {
        enClassification = row.textContent.replace('EN-Klassifizierung', '');
      }
      if (
        row.textContent.includes('Klassifizierung') &&
        !row.textContent.includes('EN-Klassifizierung')
      ) {
        classification = row.textContent.replace('Klassifizierung', '');
      }
      if (row.textContent.includes('EN-Startgewicht')) {
        const weights = row.textContent.match(
          /(\d{1,3}) - (\d{1,3})/,
        ) as RegExpMatchArray;
        [startWeight, endWeigth] = weights
          .slice(1, 3)
          .map((rawValue) => parseInt(rawValue, 10));
      }
    }
    const classifitationString = classification !== enClassification
      ? `${classification} (EN-${enClassification})`
      : classification;
    const musterdata: MusterData = {
      databaseUrl: urlToMusterData.href,
      takeoffWeight: {
        to: endWeigth,
        from: startWeight,
      },
      classification: classifitationString,
    };
    return musterdata;
  }

  return null;
}
