export class Constants {
  static Styles = class {
    static readonly root = 'trueachievement-extras';

    static Components = class {
      static readonly askLoader = 'js-ta-x-ask-loader-container';

      static AskLoader = class {
        static readonly featureJs = 'js-ta-x-ask-loader';
        static readonly containerJs = 'js-ta-x-ask-loader-container';
        static readonly askJs = 'js-ta-x-ask-loader-ask';
        static readonly inputJs = 'js-ta-x-ask-loader-ask-input';
        static readonly buttonJs = 'js-ta-x-ask-loader-ask-button';
      };

      static Tab = class {
        static readonly featureStyle = 'ta-x-tabs';
        static readonly featureJs = 'js-ta-x-tabs';
        static readonly tabLinkContainer = 'js-ta-x-tabs-link-container';
        static readonly tabLink = 'js-ta-x-tabs-link';
        static readonly tabContent = 'js-ta-x-tabs-content';
        static readonly tabSelected = 'ta-x-tabs-selected';
        static readonly tabScroll = 'ta-x-tabs-scroll';
      };
    };

    static Animations = class {
      static readonly yShow = 'ta-x-y-show';
      static readonly yHide = 'ta-x-y-hide';
      static readonly yHideNoTransition = 'ta-x-y-hide-no-transition';
    };

    static Base = class {
      static readonly hide = 'ta-x-hide';
    };

    static SettingsMenu = class {
      static readonly featureJs = 'js-ta-x-settings-menu';
      static readonly featureStyle = 'ta-x-settings-menu';
      static readonly subSetting = 'ta-x-settings-menu-sub-setting';
      static readonly wrenchJs = 'js-ta-x-settings-menu-wrench';
      static readonly closeJs = 'js-ta-x-settings-menu-close';
      static readonly versionLink = 'js-ta-x-settings-menu-version';
      static readonly documentationLink = 'js-ta-x-settings-menu-documentation';
      static readonly changelogView = 'js-ta-x-settings-menu-changelog';
      static readonly featureDocumentationView = 'js-ta-x-settings-menu-feature-documentation';
    };

    static Emojis = class {
      static readonly featureJs = 'js-ta-x-emojis';
      static readonly featureStyle = 'ta-x-emojis';
    };

    static StickyHeader = class {
      static readonly featureJs = 'js-ta-x-sticky-header';
      static readonly featureStyle = 'ta-x-sticky-header';
    };

    static NewsImprovements = class {
      static readonly featureJs = 'js-ta-x-news-improvements';
      static readonly featureStyle = 'ta-x-news-improvements';
    };

    static GamesImprovements = class {
      static readonly featureJs = 'js-ta-x-games-improvements';
      static readonly featureStyle = 'ta-x-games-improvements';
      static readonly highlightGamesButtonJs = 'js-ta-x-games-improvements-highlight-games-collection-button';

      static Forums = class {
        static readonly featureJs = 'js-ta-x-games-improvements-forum-improvements';
        static readonly featureStyle = 'ta-x-games-improvements-forum-improvements';
      };

      static Achievements = class {
        static readonly featureJs = 'js-ta-x-game-achievements';
        static readonly featureStyle = 'ta-x-game-achievements';
        static readonly showXboxAchievementGuidesJs = 'js-ta-x-game-achievements-xbox-achievement-guides';
        static readonly showXboxAchievementGuidesStyle = 'ta-x-game-achievements-xbox-achievement-guides';
        static readonly askForWalkthroughWalkthroughJs = 'js-ta-x-game-achievements-xbox-achievement-guides-ask-for-walkthrough';
        static readonly saveWalkthroughInputJs = 'js-ta-x-game-achievements-xbox-achievement-guides-save-walkthrough-input';
        static readonly saveWalkthroughButtonJs = 'js-ta-x-game-achievements-xbox-achievement-guides-save-walkthrough-button';
        static readonly showPlaystationTrophyGuidesJs = 'js-ta-x-game-achievements-playstation-trophy-guides';
        static readonly showPlaystationTrophyGuidesStyle = 'ta-x-game-achievements-playstation-trophy-guides';
        static readonly showGamertagNationGuidesJs = 'js-ta-x-game-achievements-gamertag-nation-guides';
        static readonly showGamertagNationGuidesStyle = 'ta-x-game-achievements-gamertag-nation-guides';
        static readonly showAchievementLeaderboardLinksStyle = 'ta-x-game-achievements-achievement-leaderboard-links';
        static readonly importGuidesJs = 'js-ta-x-game-achievements-import-guides';
        static readonly importGuidesStyle = 'ta-x-game-achievements-import-guides';
        static readonly collapsibleGroupsJs = 'js-ta-x-game-achievements-collapsible-groups';
        static readonly collapsibleGroupsStyle = 'ta-x-game-achievements-collapsible-groups';
      };
    };

    static GamerImprovements = class {
      static readonly featureJs = 'js-ta-x-gamer-improvements';
      static readonly featureStyle = 'ta-x-gamer-improvements';
      static readonly groupByGameButtonJs = 'js-ta-x-gamer-improvements-group-by-game-button';
    };

    static ForumImprovements = class {
      static readonly featureJs = 'js-ta-x-forum-improvements';
      static readonly featureStyle = 'ta-x-forum-improvements';
      static readonly filterThreadsTitleStyle = 'ta-x-forum-improvements-filter-threads-title';
      static readonly filterThreadsUnhideStyle = 'ta-x-forum-improvements-filter-threads-unhide';
      static readonly filterThreadsUnhideJs = 'js-ta-x-forum-improvements-filter-threads-unhide';

      static Walkthroughs = class {
        static readonly featureJs = 'js-ta-x-forum-improvements-walkthroughs';
        static readonly featureStyle = 'ta-x-forum-improvements-walkthroughs';
        static readonly showOwnerProgressJs = 'js-ta-x-forum-improvements-walkthroughs-show-owner-progress';
        static readonly showOwnerProgressStyle = 'ta-x-forum-improvements-walkthroughs-show-owner-progress';
        static readonly showOwnerProgressEditorWrapperStyle = 'ta-x-forum-improvements-walkthroughs-show-owner-progress-editor-wrapper';
        static readonly showOwnerProgressEditorRowStyle = 'ta-x-forum-improvements-walkthroughs-show-owner-progress-editor-row';
        static readonly showOwnerProgressEditorStyle = 'ta-x-forum-improvements-walkthroughs-show-owner-progress-editor';
        static readonly askForWalkthroughWalkthroughJs = 'js-ta-x-forum-improvements-walkthroughs-show-owner-progress-ask-for-walkthrough';
        static readonly saveWalkthroughInputJs = 'js-ta-x-forum-improvements-walkthroughs-show-owner-progress-save-walkthrough-input';
        static readonly saveWalkthroughButtonJs = 'js-ta-x-forum-improvements-walkthroughs-show-owner-progress-save-walkthrough-button';
      };
    };

    static StaffWalkthroughImprovements = class {
      static readonly featureJs = 'js-ta-x-staff-walkthrough-improvements';
      static readonly featureStyle = 'ta-x-staff-walkthrough-improvements';

      static readonly WalkthroughPage = class {
        static readonly featureJs = 'js-ta-x-staff-walkthrough-improvements-walkthrough-page';
        static readonly featureStyle = 'ta-x-staff-walkthrough-improvements-walkthrough-page';
        static readonly containerJs = 'js-ta-x-staff-walkthrough-improvements-walkthrough-page-container';
        static readonly containerStyle = 'ta-x-staff-walkthrough-improvements-walkthrough-page-container';
        static readonly stickyPageHistoryJs = 'js-ta-x-staff-walkthrough-improvements-walkthrough-page-sticky-page-history';
        static readonly stickyPageHistoryStyle = 'ta-x-staff-walkthrough-improvements-walkthrough-page-sticky-page-history';
        static readonly moveButtonsToLeftStyle = 'ta-x-staff-walkthrough-improvements-walkthrough-page-move-buttons-to-left';
        static readonly walkthroughTeamButtonJs = 'js-ta-x-staff-walkthrough-improvements-walkthrough-page-walkthrough-team-button';
      };

      static readonly ManageWalkthroughPage = class {
        static readonly featureJs = 'js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page';
        static readonly featureStyle = 'ta-x-staff-walkthrough-improvements-manage-walkthrough-page';
        static readonly containerJs = 'js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container';
        static readonly containerStyle = 'ta-x-staff-walkthrough-improvements-manage-walkthrough-page-container';
        static readonly clickableAchievementsJs = 'js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-clickable-achievements';
        static readonly missingButtonsContainerJs = 'js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-missing-buttons-container';
        static readonly addPageButtonJs = 'js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-add-page-button';
        static readonly previewButtonJs = 'js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-preview-button';
        static readonly viewContentButtonJs = 'js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-view-content-button';
        static readonly readyForReviewButtonJs = 'js-ta-x-staff-walkthrough-improvements-manage-walkthrough-page-ready-for-review-button';
      };

      static readonly EditWalkthroughPage = class {
        static readonly featureJs = 'js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page';
        static readonly featureStyle = 'ta-x-staff-walkthrough-improvements-edit-walkthrough-page';
        static readonly containerJs = 'js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-container';
        static readonly containerStyle = 'ta-x-staff-walkthrough-improvements-edit-walkthrough-page-container';
        static readonly improvedImageSelectorJs = 'js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector';
        static readonly improvedImageSelectorStyle = 'ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector';
        static readonly improvedImageSelectorContainerJs = 'js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-container';
        static readonly improvedImageSelectorContainerStyle = 'ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-container';
        static readonly improvedImageSelectorImageTitleJs = 'js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title';
        static readonly improvedImageSelectorImageTitleStyle = 'ta-x-staff-walkthrough-improvements-edit-walkthrough-page-improved-image-selector-image-title';
        static readonly themeToggleJs = 'js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle';
        static readonly themeToggleStyle = 'ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle';
        static readonly themeToggleDarkStyle = 'ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-dark';
        static readonly themeToggleLightStyle = 'ta-x-staff-walkthrough-improvements-edit-walkthrough-page-theme-toggle-light';
        static readonly stickyTinymceToolbarJs = 'js-ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar';
        static readonly stickyTinymceToolbarStyles = 'ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar';
      };

      static readonly WalkthroughPreview = class {
        static readonly featureJs = 'js-ta-x-staff-walkthrough-improvements-walkthrough-preview';
        static readonly featureStyle = 'ta-x-staff-walkthrough-improvements-walkthrough-preview';
        static readonly populateAsideContentJs = 'js-ta-x-staff-walkthrough-improvements-walkthrough-preview-populate-aside-content';
        static readonly populateAsideContentWalkthroughPagesJs = 'js-ta-x-staff-walkthrough-improvements-walkthrough-preview-populate-aside-content-walkthrough-pages';
        static readonly populateAsideContentWalkthroughThanksJs = 'js-ta-x-staff-walkthrough-improvements-walkthrough-preview-populate-aside-content-walkthrough-thanks';
        static readonly populateAsideContentWalkthroughAchievementsJs = 'js-ta-x-staff-walkthrough-improvements-walkthrough-preview-populate-aside-content-walkthrough-achievements';
      };
    };

    static Variables = class {
      static StickyHeader = class {
        static readonly featureVariableStylePrefix = '--ta-x-sticky-header';
        static readonly height = '--ta-x-sticky-header-height';
      };

      static StaffWalkthroughImprovements = class {
        static readonly WalkthroughPage = class {
          static readonly featureVariableStylePrefix = '--ta-x-staff-walkthrough-improvements-walkthrough-page';
          static readonly stickyPageHistoryTop = '--ta-x-staff-walkthrough-improvements-walkthrough-page-sticky-page-history-top';
        };

        static readonly EditWalkthroughPage = class {
          static readonly featureVariableStylePrefix = '--ta-x-staff-walkthrough-improvements-edit-walkthrough-page';
          static readonly stickyTinymceToolbarWidth = '--ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar-width';
          static readonly stickyTinymceToolbarTop = '--ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar-top';
          static readonly stickyTinymceToolbarFloatingMenu = '--ta-x-staff-walkthrough-improvements-edit-walkthrough-page-sticky-tinymce-toolbar-floating-menu';
        };
      };
    };
  };

  static Templates = class {
    static Components = class {
      static Tab = class {
        static readonly featureTemplatePrefix = 'ta-x-template-tabs';
        static readonly tabLink = 'ta-x-template-tabs-link';
        static readonly tabContent = 'ta-x-template-tabs-content';
      };
    };

    static GamesImprovements = class {
      static Achievements = class {
        static readonly featureTemplatePrefix = 'ta-x-template-games-improvements-achievements';
        static readonly achievementGuideSolution = 'ta-x-template-games-improvements-achievements-achievement-guide';
      };
    };

    static StaffWalkthroughImprovements = class {
      static ManageWalkthroughPage = class {
        static readonly featureTemplatePrefix = 'ta-x-template-manage-walkthrough';
        static readonly achievementRow = 'ta-x-template-manage-walkthrough-achievement-row';
      };

      static WalkthroughPreview = class {
        static readonly featureTemplatePrefix = 'ta-x-template-walkthrough-preview';
        static readonly walkthroughPagesSummary = 'ta-x-template-walkthrough-preview-walkthrough-pages-summary';
        static readonly walkthroughPagesNumbered = 'ta-x-template-walkthrough-preview-walkthrough-pages-numbered';
        static readonly walkthroughPagesNumberedSelected = 'ta-x-template-walkthrough-preview-walkthrough-pages-numbered-selected';
        static readonly walkthroughAchievements = 'ta-x-template-walkthrough-preview-walkthrough-achievements';
      };
    };
  };
}
