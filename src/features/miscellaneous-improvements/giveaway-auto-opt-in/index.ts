import { pubSub } from '@ta-x-components';
import { miscellaneousImprovements } from '@ta-x-globals';
import { fetch, memoizeFetch, updateMemoizedFetch } from '@ta-x-helpers';
import { MiscellaneousRegex } from 'globals/regex';

const getGiveaways = async (): Promise<{ current: HTMLElement; previous: HTMLElement; }> => {
  let giveawayBody = document;

  if (!MiscellaneousRegex.Test.winXboxGamesUrl()) {
    let giveawayResponse = await memoizeFetch('/win-xbox-games', {}, { deleteAfter: { value: 12, period: 'hours' } });
    giveawayBody = new DOMParser().parseFromString(giveawayResponse, 'text/html');
  } else {
    return null;
  }

  const giveaways = [...giveawayBody.querySelectorAll('.competition .game')];
  const mappedGiveaways = giveaways.reduce(
    (acc, giveaway, index) => {
      if (index === 0) {
        if (giveaway.classList.contains('winner')) {
          acc.previous = giveaway;
        } else {
          acc.current = giveaway;
        }
      } else if (index === 1) {
        acc.previous = giveaway;
      }
      return acc;
    },
    { current: null, previous: null }
  );

  if (!mappedGiveaways.current) {
    return null;
  }

  return mappedGiveaways;
}

const getBody = (giveaway: HTMLElement): Record<string, string> => {
  const enterLink = giveaway.querySelector('.entry a') as HTMLAnchorElement;
  if (!enterLink) {
    return null;
  }

  const form = giveaway.closest('form') as HTMLFormElement;
  if (!form) {
    return null;
  }

  const onClickParams = enterLink.outerHTML.match(/Postback\('([^']+)',\s*(\d+)\)/);
  if (!onClickParams) {
    return null;
  }

  let data = {
    Command: onClickParams[1],
    Argument: onClickParams[2]
  };

  new FormData(form).forEach((value, key) => {
    data[key] = value;
  });

  return data;
};

const enterGiveaway = async (requestBody: Record<string, string>): Promise<void> => {
  try {
    const response = await fetch('/win-xbox-games', {
      method: 'POST',
      body: new URLSearchParams(requestBody),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const body = await(response as Response).text();
    const bodyDocument = new DOMParser().parseFromString(body, 'text/html');

    if (!bodyDocument.querySelector('.entry a')) {
      const gameTitle = bodyDocument.querySelector('.competition a') as HTMLAnchorElement;

      pubSub.publish('snackbar:show', {
        text: gameTitle ? `Entered giveaway for ${gameTitle.outerHTML}.` : 'Giveaway entered.',
        type: 'success',
        timeoutMS: 5000
      });

      updateMemoizedFetch('/win-xbox-games', bodyDocument.documentElement.outerHTML, {
        deleteAfter: { value: 12, period: 'hours' }
      });
    }
  } catch {
    // Do nothing
  }
}

const giveawayAutoOptIn = async (): Promise<void> => {
  const mappedGiveaways = await getGiveaways();
  if (!mappedGiveaways) {
    return;
  }

  if (mappedGiveaways.current.classList.contains('entered')) {
    return;
  }

  const requestBody = getBody(mappedGiveaways.current);
  if (!requestBody) {
    return;
  }

  await enterGiveaway(requestBody);
};

export default async (): Promise<void> => {
  if (!miscellaneousImprovements.giveawayAutoOptIn) {
    return;
  }

  await giveawayAutoOptIn();
};
