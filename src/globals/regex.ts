export const getUrlProperties = (str: string, props: string | string[] = []) => {
  props = Array.isArray(props) ? props : [props];

  try {
    const url = new URL(str);
    let constructedString = '';

    for (let i = 0; i < props.length; i++) {
      if (!url[props[i]]) {
        continue;
      }

      constructedString += url[props[i]];
    }

    return constructedString;
  } catch {
    throw `${str} is not a valid url`;
  }
};

const achievementUrl = new RegExp('^/a[0-9]*/(?!.*/).*$', 'i');
const achievementUrlWithGamerId = new RegExp('^/a[0-9]*/.*\\?gamerid=[0-9]*', 'i');
const achievementsUrl = new RegExp('^/game/.*/achievements$', 'i');
const achievementsUrlWithGamerId = new RegExp('^/game/.*/achievements\\?gamerid=[0-9]*', 'i');
const challengesUrl = new RegExp('^/game/.*/challenges$', 'i');
const challengesUrlWithGamerId = new RegExp('^/game/.*/challenges\\?gamerid=[0-9]*', 'i');
const clipsUrl = new RegExp('^/game/.*/videos$', 'i');
const dlcUrl = new RegExp('^/game/.*/dlc$', 'i');
const dlcUrlWithGamerId = new RegExp('^/game/.*/dlc\\?gamerid=[0-9]*', 'i');
const individualDlcUrl = new RegExp('^/game/.*/dlc/(?!.*/).*$', 'i');
const individualDlcUrlWithGamerId = new RegExp('^/game/.*/dlc/.*\\?gamerid=[0-9]*', 'i');
const walkthroughUrl = new RegExp('^/game/.*/walkthrough$', 'i');
const gameForumUrl = new RegExp('^/game/.*/forum$', 'i');
const gameForumUrlWithAll = new RegExp('^/game/.*/forum\\?type=all', 'i');
const gameForumUrlWithCommunity = new RegExp('^/game/.*/forum\\?type=community', 'i');
const gameForumUrlWithGameInfo = new RegExp('^/game/.*/forum\\?type=gameinfo', 'i');
const reviewsUrl = new RegExp('^/game/.*/review$', 'i');
const productUrl = new RegExp('^/products/[0-9]*/.*$', 'i');
const gamesUrl = new RegExp('^/games.aspx', 'i');
const gameUrl = new RegExp('^/game/.*$', 'i');
const editWalkthroughUrl = new RegExp('^/staff/walkthrough/editwalkthroughpage.aspx', 'i');
const manageWalkthroughUrl = new RegExp('^/staff/walkthrough/managewalkthrough.aspx', 'i');
const manageWalkthroughUrlWithWalkthroughId = new RegExp(
  '^/staff/walkthrough/managewalkthrough.aspx\\?walkthroughid=[0-9]*',
  'i'
);
const walkthroughPageUrl = new RegExp('^/staff/walkthrough/walkthroughpage.aspx', 'i');
const walkthroughPreviewUrl = new RegExp('^/staff/walkthrough/walkthroughpreview.aspx', 'i');
const walkthroughPreviewUrlWithWalkthroughId = new RegExp(
  '^/staff/walkthrough/walkthroughpreview.aspx\\?walkthroughid=[0-9]*',
  'i'
);
const walkthroughPagePreviewUrl = new RegExp('^/staff/walkthrough/walkthroughpagepreview.aspx', 'i');
const walkthroughPagePreviewUrlWithPageId = new RegExp(
  '^/staff/walkthrough/walkthroughpagepreview.aspx\\?pageid=[0-9]*',
  'i'
);
const autosave = new RegExp('^/ajaxfunctions.aspx/AutoSave', 'i');
const forumsUrl = new RegExp('^/forum/forums.aspx', 'i');
const myTheadsUrl = new RegExp('^/forum/viewthreads.aspx', 'i');
const viewBoardUrlWithBoardId = new RegExp('^/forum/viewboard.aspx\\?messageboardid=[0-9]*', 'i');
const viewThreadUrlWithThreadId = new RegExp('^/forum/viewthread.aspx\\?tid=[0-9]*', 'i');
const pollUrl = new RegExp('^/poll/[0-9]*/*', 'i');
const newsUrl = new RegExp('^/n[0-9]*/*', 'i');
const gamerUrl = new RegExp('^/gamer/.*$', 'i');
const gamerAchievementsUrl = new RegExp('^/gamer/.*/achievements$', 'i');
const winXboxGamesUrl = new RegExp('^/win-xbox-games', 'i');

const xboxAchievementsGuide = new RegExp('^/game/.*/guide((/$)|$)', 'i');
const playstationTrophiesGuide = new RegExp('^/game/.*/guide((/$)|$)', 'i');
const gamertagNationGuide = new RegExp('^/games.php\\?g=.*&do=guides((/$)|$)', 'i');

export const AchievementsRegex = {
  achievementUrl,
  achievementUrlWithGamerId,
  Test: {
    achievementUrl: (str: string = window.location.href): boolean =>
      achievementUrl.test(getUrlProperties(str, 'pathname')),
    achievementUrlWithGamerId: (str: string = window.location.href): boolean =>
      achievementUrlWithGamerId.test(getUrlProperties(str, ['pathname', 'search']))
  }
};

export const GamesRegex = {
  achievementsUrl,
  achievementsUrlWithGamerId,
  challengesUrl,
  challengesUrlWithGamerId,
  clipsUrl,
  dlcUrl,
  dlcUrlWithGamerId,
  individualDlcUrl,
  individualDlcUrlWithGamerId,
  forumUrl: gameForumUrl,
  gameUrl,
  gamesUrl,
  reviewsUrl,
  walkthroughUrl,
  Extract: {
    gameName: (str: string = window.location.href): string =>
      getUrlProperties(str, 'pathname').match(/(?<=\/game\/)[^/]+/)[0],

    dlcName: (str: string = window.location.href): string =>
      getUrlProperties(str, 'pathname').match(/(?<=\/dlc\/)[^/]+/)[0]
  },
  Test: {
    dlc: (str: string = window.location.href): boolean =>
      dlcUrl.test(getUrlProperties(str, 'pathname')) || individualDlcUrl.test(getUrlProperties(str, 'pathname')),
    dlcWithGamerId: (str: string = window.location.href): boolean =>
      dlcUrlWithGamerId.test(getUrlProperties(str, ['pathname', 'search'])) ||
      individualDlcUrlWithGamerId.test(getUrlProperties(str, ['pathname', 'search'])),
    forum: (str: string = window.location.href): boolean =>
      gameForumUrl.test(getUrlProperties(str, 'pathname')) ||
      gameForumUrlWithAll.test(getUrlProperties(str, ['pathname', 'search'])) ||
      gameForumUrlWithCommunity.test(getUrlProperties(str, ['pathname', 'search'])) ||
      gameForumUrlWithGameInfo.test(getUrlProperties(str, ['pathname', 'search'])),

    achievementsUrl: (str: string = window.location.href): boolean =>
      achievementsUrl.test(getUrlProperties(str, 'pathname')),
    achievementsUrlWithGamerId: (str: string = window.location.href): boolean =>
      achievementsUrlWithGamerId.test(getUrlProperties(str, ['pathname', 'search'])),
    clipsUrl: (str: string = window.location.href): boolean => clipsUrl.test(getUrlProperties(str, 'pathname')),
    dlcUrl: (str: string = window.location.href): boolean => dlcUrl.test(getUrlProperties(str, 'pathname')),
    dlcUrlWithGamerId: (str: string = window.location.href): boolean =>
      dlcUrlWithGamerId.test(getUrlProperties(str, ['pathname', 'search'])),
    challengesUrl: (str: string = window.location.href): boolean =>
      challengesUrl.test(getUrlProperties(str, 'pathname')),
    challengesUrlWithGamerId: (str: string = window.location.href): boolean =>
      challengesUrlWithGamerId.test(getUrlProperties(str, ['pathname', 'search'])),
    individualDlcUrl: (str: string = window.location.href): boolean =>
      individualDlcUrl.test(getUrlProperties(str, 'pathname')),
    individualDlcUrlWithGamerId: (str: string = window.location.href): boolean =>
      individualDlcUrlWithGamerId.test(getUrlProperties(str, ['pathname', 'search'])),
    forumUrl: (str: string = window.location.href): boolean => gameForumUrl.test(getUrlProperties(str, 'pathname')),
    gameForumUrlWithAll: (str: string = window.location.href): boolean =>
      gameForumUrlWithAll.test(getUrlProperties(str, ['pathname', 'search'])),
    gameForumUrlWithCommunity: (str: string = window.location.href): boolean =>
      gameForumUrlWithCommunity.test(getUrlProperties(str, ['pathname', 'search'])),
    gameForumUrlWithGameInfo: (str: string = window.location.href): boolean =>
      gameForumUrlWithGameInfo.test(getUrlProperties(str, ['pathname', 'search'])),
    gameUrl: (str: string = window.location.href): boolean => gameUrl.test(getUrlProperties(str, 'pathname')),
    gamesUrl: (str: string = window.location.href): boolean => gamesUrl.test(getUrlProperties(str, 'pathname')),
    reviewsUrl: (str: string = window.location.href): boolean => reviewsUrl.test(getUrlProperties(str, 'pathname')),
    walkthroughUrl: (str: string = window.location.href): boolean =>
      walkthroughUrl.test(getUrlProperties(str, 'pathname'))
  }
};

export const GamerRegex = {
  gamerUrl,
  gamerAchievementsUrl,
  Test: {
    all: (str: string = window.location.href): boolean =>
      gamerUrl.test(getUrlProperties(str, 'pathname')) || gamerAchievementsUrl.test(getUrlProperties(str, 'pathname')),

    gamerUrl: (str: string = window.location.href): boolean => gamerUrl.test(getUrlProperties(str, 'pathname')),
    gamerAchievementsUrl: (str: string = window.location.href): boolean =>
      gamerAchievementsUrl.test(getUrlProperties(str, 'pathname'))
  }
};

export const AjaxRegex = {
  autosave,
  Test: {
    autosave: (str: string = window.location.href): boolean => autosave.test(getUrlProperties(str, 'pathname'))
  }
};

export const StaffRegex = {
  Walkthroughs: {
    editWalkthroughUrl,
    manageWalkthroughUrl,
    manageWalkthroughUrlWithWalkthroughId,
    walkthroughPageUrl,
    walkthroughPreviewUrl,
    walkthroughPreviewUrlWithWalkthroughId,
    walkthroughPagePreviewUrl,
    walkthroughPagePreviewUrlWithPageId,
    Test: {
      all: (str: string = window.location.href): boolean =>
        editWalkthroughUrl.test(getUrlProperties(str, 'pathname')) ||
        manageWalkthroughUrl.test(getUrlProperties(str, 'pathname')) ||
        walkthroughPageUrl.test(getUrlProperties(str, 'pathname')) ||
        walkthroughPreviewUrl.test(getUrlProperties(str, 'pathname')) ||
        walkthroughPagePreviewUrl.test(getUrlProperties(str, 'pathname')),
      preview: (str: string = window.location.href): boolean =>
        walkthroughPreviewUrl.test(getUrlProperties(str, 'pathname')) ||
        walkthroughPagePreviewUrl.test(getUrlProperties(str, 'pathname')),

      editWalkthroughUrl: (str: string = window.location.href): boolean =>
        editWalkthroughUrl.test(getUrlProperties(str, 'pathname')),
      manageWalkthroughUrl: (str: string = window.location.href): boolean =>
        manageWalkthroughUrl.test(getUrlProperties(str, 'pathname')),
      manageWalkthroughUrlWithWalkthroughId: (str: string = window.location.href): boolean =>
        manageWalkthroughUrlWithWalkthroughId.test(getUrlProperties(str, ['pathname', 'search'])),
      walkthroughPageUrl: (str: string = window.location.href): boolean =>
        walkthroughPageUrl.test(getUrlProperties(str, 'pathname')),
      walkthroughPreviewUrl: (str: string = window.location.href): boolean =>
        walkthroughPreviewUrl.test(getUrlProperties(str, 'pathname')),
      walkthroughPreviewUrlWithWalkthroughId: (str: string = window.location.href): boolean =>
        walkthroughPreviewUrlWithWalkthroughId.test(getUrlProperties(str, ['pathname', 'search'])),
      walkthroughPagePreviewUrl: (str: string = window.location.href): boolean =>
        walkthroughPagePreviewUrl.test(getUrlProperties(str, 'pathname')),
      walkthroughPagePreviewUrlWithPageId: (str: string = window.location.href): boolean =>
        walkthroughPagePreviewUrlWithPageId.test(getUrlProperties(str, ['pathname', 'search']))
    }
  }
};

export const ForumRegex = {
  forumsUrl,
  viewBoardUrlWithBoardId,
  viewThreadUrlWithThreadId,
  myTheadsUrl,
  Test: {
    all: (str: string = window.location.href): boolean =>
      forumsUrl.test(getUrlProperties(str, 'pathname')) ||
      viewBoardUrlWithBoardId.test(getUrlProperties(str, ['pathname', 'search'])) ||
      viewThreadUrlWithThreadId.test(getUrlProperties(str, ['pathname', 'search'])) ||
      myTheadsUrl.test(getUrlProperties(str, 'pathname')),

    forumsUrl: (str: string = window.location.href): boolean => forumsUrl.test(getUrlProperties(str, 'pathname')),
    myTheadsUrl: (str: string = window.location.href): boolean => myTheadsUrl.test(getUrlProperties(str, 'pathname')),
    viewBoardUrlWithBoardId: (str: string = window.location.href): boolean =>
      viewBoardUrlWithBoardId.test(getUrlProperties(str, ['pathname', 'search'])),
    viewThreadUrlWithThreadId: (str: string = window.location.href): boolean =>
      viewThreadUrlWithThreadId.test(getUrlProperties(str, ['pathname', 'search']))
  }
};

export const NewsRegex = {
  pollUrl,
  newsUrl,
  Test: {
    pollUrl: (str: string = window.location.href): boolean => pollUrl.test(getUrlProperties(str, 'pathname')),
    newsUrl: (str: string = window.location.href): boolean => newsUrl.test(getUrlProperties(str, 'pathname'))
  }
};

export const ProductRegex = {
  productUrl,
  Test: {
    productUrl: (str: string = window.location.href): boolean => productUrl.test(getUrlProperties(str, 'pathname'))
  }
};

export const DatesRegex = {
  today: new RegExp('Today', 'i'),
  yesterday: new RegExp('Yesterday', 'i')
};

export const SentencesRegex = {
  discussWalkthrough: new RegExp('^Please use this thread to discuss the .* walkthrough?.$'),
  walkthroughPublished: new RegExp(
    '^The walkthrough has now been published.(?:\\n\\n)?You can find it here: .* Walkthrough?.$'
  )
};

export const ExternalRegex = {
  xboxAchievementsGuide,
  playstationTrophiesGuide,
  gamertagNationGuide,

  Test: {
    xboxAchievementsGuide: (str: string = window.location.href): boolean =>
      xboxAchievementsGuide.test(getUrlProperties(str, 'pathname')),
    playstationTrophiesGuide: (str: string = window.location.href): boolean =>
      playstationTrophiesGuide.test(getUrlProperties(str, 'pathname')),
    gamertagNationGuide: (str: string = window.location.href): boolean =>
      gamertagNationGuide.test(getUrlProperties(str, ['pathname', 'search']))
  }
};

export const MiscellaneousRegex = {
  winXboxGamesUrl,

  Test: {
    winXboxGamesUrl: (str: string = window.location.href): boolean =>
      winXboxGamesUrl.test(getUrlProperties(str, 'pathname'))
  }
};

export default {
  AchievementsRegex,
  GamesRegex,
  GamerRegex,
  StaffRegex,
  ForumRegex,
  DatesRegex,
  SentencesRegex,
  NewsRegex,
  ProductRegex,
  ExternalRegex,
  MiscellaneousRegex
};
