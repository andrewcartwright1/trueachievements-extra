import emojiJson from 'emoji.json';
import { Compressed, decompress } from 'compress-json';
import { pubSub } from '@ta-x-components';
import { Constants, miscellaneousImprovements } from '@ta-x-globals';
import { allConcurrently, extractBetween, waitForElement, waitForElements, waitForImages } from '@ta-x-utilities';
import { template } from '@ta-x-helpers';
import templatedTabs from '@ta-x-views/templates/tab-link.html';
import html from './emojis.html';

let builtEmojis: Element = null;
const elementSelectors = [
  '#aeb_txtQuickReply',
  '#aeb_aebMessageBody',
  '#aeb_aebMessage',
  '#aeb_txtAddSubComment',
  '#aeb_aebComment'
];

const apply = async (containers: HTMLElement[]): Promise<void[]> =>
  await allConcurrently(
    'Emojis - Apply',
    containers.map((container: HTMLElement) => ({
      name: 'emojis-container',
      task: async (): Promise<void> => {
        const trueAchievementsContent = builtEmojis.querySelector('#ta-x-tabs-trueachievements');
        let insertAtCursorElement: string = null;

        await waitForImages(container);

        const smileys = [...container.querySelectorAll('.smileydropdown span')] as HTMLElement[];
        smileys.forEach((smiley) => {
          if (!insertAtCursorElement) {
            insertAtCursorElement = extractBetween("'", smiley.getAttribute('onclick'));
          }

          trueAchievementsContent.appendChild(smiley);
        });

        const smileyDropdowns = [...container.querySelectorAll('.smileydropdown')] as HTMLElement[];
        smileyDropdowns.forEach((smileyDropdown) => smileyDropdown.parentElement.remove());

        const quickReplyEmojiToolbar = await waitForElement('.toolbar .formatbuttons:last-child', container);
        const emojiContent = template(builtEmojis, { emojis: { id: insertAtCursorElement } });
        quickReplyEmojiToolbar.appendChild(emojiContent);

        const firstTab = await waitForElement(`.${Constants.Styles.Components.Tab.tabLink}:first-child`, container);
        pubSub.publish('tabs:set', firstTab);
      }
    }))
  );

const buildEmojis = (): void => {
  const decompressedEmojis = decompress(emojiJson as unknown as Compressed);
  const keys = decompressedEmojis.slice(0, decompressedEmojis.length / 2);
  const values = decompressedEmojis.slice(decompressedEmojis.length / 2);
  const groupedEmojis = new Map(keys.map((k, i) => [k, values[i]]));
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const parsedTemplateDocument = new DOMParser().parseFromString(templatedTabs, 'text/html');

  const emojiButton = parsedDocument.querySelector(`.${Constants.Styles.Emojis.featureJs}`);
  const emojiTabs = emojiButton.querySelector(`.${Constants.Styles.Components.Tab.tabLinkContainer}`);

  Array.from(groupedEmojis.entries()).forEach((emojiGroup: [string, unknown[]]) => {
    const tabLink = (
      parsedTemplateDocument.querySelector(`#${Constants.Templates.Components.Tab.tabLink}`) as HTMLTemplateElement
    ).content.firstElementChild.cloneNode(true);

    const tabId = emojiGroup[0].replace(/[^A-Z0-9]/gi, '').toLowerCase();
    const templatedTabLink = template(tabLink as HTMLElement, {
      tab: { link: emojiGroup[0], id: tabId }
    });
    emojiTabs.appendChild(templatedTabLink);

    const tabContent = (
      parsedTemplateDocument.querySelector(`#${Constants.Templates.Components.Tab.tabContent}`) as HTMLTemplateElement
    ).content.firstElementChild.cloneNode(true);

    let emojiHtml = '';
    emojiGroup[1].forEach((emoji: { char: string; name: string; codes: string }) => {
      emojiHtml += `<span onclick="InsertAtCursor('{emojis.id}','${emoji.char}', 'ta-x-emoji-dropdown'); return false;" title='${emoji.name}'>${emoji.char}</span>`;
    });

    const templatedTabContent = template(tabContent as HTMLElement, {
      tab: { content: emojiHtml, link: emojiGroup[0], id: tabId }
    });

    emojiTabs.parentNode.append(templatedTabContent);
  });

  builtEmojis = emojiButton;
};

const listen = (): void => {
  const observer = new MutationObserver(async (mutations: MutationRecord[]) => {
    for (const mutation of mutations) {
      if (mutation.type !== 'childList') {
        return;
      }

      if (!(mutation.target instanceof HTMLElement)) {
        return;
      }

      if (!mutation.addedNodes || mutation.addedNodes.length === 0) {
        return;
      }

      const matchingNodes = [...mutation.addedNodes].filter((node: Node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) {
          return false;
        }

        const elementNode = node as HTMLElement;
        return (
          elementNode.matches(elementSelectors.join(', ')) || elementNode.querySelector(elementSelectors.join(', '))
        );
      }) as HTMLElement[];

      if (matchingNodes.length > 0) {
        if (!builtEmojis) {
          buildEmojis();
        }

        await apply(matchingNodes);
      }
    }
  });

  observer.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true
  });
};

export default async (): Promise<void> => {
  if (!miscellaneousImprovements.emojis) {
    return;
  }

  const replyContainers = await waitForElements(elementSelectors.join(', '));
  if (replyContainers) {
    buildEmojis();
    await apply(replyContainers);
  }

  listen();
};
