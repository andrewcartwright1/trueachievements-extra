import { setLocalStorage } from '@ta-x-test';
import { config } from './config';

describe('stickyHeader', () => {
  describe('enabled', () => {
    describe('get', () => {
      test.concurrent.each([
        { existingSettings: new Map<string, boolean>(), expected: false },
        {
          existingSettings: new Map([['stickyHeader-enabled', false]]),
          expected: false
        },
        {
          existingSettings: new Map([['stickyHeader-enabled', true]]),
          expected: true
        }
      ])('should return the existing value $expected when getting', ({ existingSettings, expected }) => {
        setLocalStorage(existingSettings);
        expect(config.miscellaneousImprovements.stickyHeader.enabled).toEqual(expected);
      });
    });

    describe('set', () => {
      test.concurrent.each([
        {
          input: false,
          expected: false
        },
        {
          input: true,
          expected: true
        }
      ])('should return the new value $expected when getting after setting to be $input', ({ expected, input }) => {
        config.miscellaneousImprovements.stickyHeader.enabled = input;
        expect(config.miscellaneousImprovements.stickyHeader.enabled).toEqual(expected);
      });
    });
  });

  describe('remainStuck', () => {
    describe('get', () => {
      test.concurrent.each([
        { existingSettings: new Map<string, boolean>(), expected: false },
        {
          existingSettings: new Map([['stickyHeader-remainStuck', false]]),
          expected: false
        },
        {
          existingSettings: new Map([['stickyHeader-remainStuck', true]]),
          expected: true
        }
      ])('should return the existing value $expected when getting', ({ existingSettings, expected }) => {
        setLocalStorage(existingSettings);
        expect(config.miscellaneousImprovements.stickyHeader.remainStuck).toEqual(expected);
      });
    });

    describe('set', () => {
      test.concurrent.each([
        {
          input: false,
          expected: false
        },
        {
          input: true,
          expected: true
        }
      ])('should return the new value $expected when getting after setting to be $input', ({ expected, input }) => {
        config.miscellaneousImprovements.stickyHeader.remainStuck = input;
        expect(config.miscellaneousImprovements.stickyHeader.remainStuck).toEqual(expected);
      });
    });
  });
});

describe('emojis', () => {
  describe('enabled', () => {
    describe('get', () => {
      test.concurrent.each([
        { existingSettings: new Map<string, boolean>(), expected: false },
        {
          existingSettings: new Map([['emojis-enabled', false]]),
          expected: false
        },
        {
          existingSettings: new Map([['emojis-enabled', true]]),
          expected: true
        }
      ])('should return the existing value $expected when getting', ({ existingSettings, expected }) => {
        setLocalStorage(existingSettings);
        expect(config.miscellaneousImprovements.emojis).toEqual(expected);
      });
    });

    describe('set', () => {
      test.concurrent.each([
        {
          input: false,
          expected: false
        },
        {
          input: true,
          expected: true
        }
      ])('should return the new value $expected when getting after setting to be $input', ({ expected, input }) => {
        config.miscellaneousImprovements.emojis = input;
        expect(config.miscellaneousImprovements.emojis).toEqual(expected);
      });
    });
  });
});

describe('staffWalkthroughImprovements', () => {
  describe('editWalkthrough', () => {
    describe('improvedImageSelector', () => {
      describe('get', () => {
        test.concurrent.each([
          { existingSettings: new Map<string, boolean>(), expected: false },
          {
            existingSettings: new Map([['improvedImageSelector', false]]),
            expected: false
          },
          {
            existingSettings: new Map([['improvedImageSelector', true]]),
            expected: true
          }
        ])('should return the existing value $expected when getting', ({ existingSettings, expected }) => {
          setLocalStorage(existingSettings);
          expect(config.staffWalkthroughImprovements.editWalkthrough.improvedImageSelector).toEqual(expected);
        });
      });

      describe('set', () => {
        test.concurrent.each([
          {
            input: false,
            expected: false
          },
          {
            input: true,
            expected: true
          }
        ])('should return the new value $expected when getting after setting to be $input', ({ expected, input }) => {
          config.staffWalkthroughImprovements.editWalkthrough.improvedImageSelector = input;
          expect(config.staffWalkthroughImprovements.editWalkthrough.improvedImageSelector).toEqual(expected);
        });
      });
    });

    describe('autoSaveNotification', () => {
      describe('get', () => {
        test.concurrent.each([
          { existingSettings: new Map<string, boolean>(), expected: false },
          {
            existingSettings: new Map([['autoSaveNotification', false]]),
            expected: false
          },
          {
            existingSettings: new Map([['autoSaveNotification', true]]),
            expected: true
          }
        ])('should return the existing value $expected when getting', ({ existingSettings, expected }) => {
          setLocalStorage(existingSettings);
          expect(config.staffWalkthroughImprovements.editWalkthrough.autoSaveNotification).toEqual(expected);
        });
      });

      describe('set', () => {
        test.concurrent.each([
          {
            input: false,
            expected: false
          },
          {
            input: true,
            expected: true
          }
        ])('should return the new value $expected when getting after setting to be $input', ({ expected, input }) => {
          config.staffWalkthroughImprovements.editWalkthrough.autoSaveNotification = input;
          expect(config.staffWalkthroughImprovements.editWalkthrough.autoSaveNotification).toEqual(expected);
        });
      });
    });

    describe('tinymceTheme', () => {
      describe('get', () => {
        test.concurrent.each([
          { existingSettings: new Map<string, boolean>(), expected: null },
          {
            existingSettings: new Map([['tinymceTheme', 'dark']]),
            expected: 'dark'
          },
          {
            existingSettings: new Map([['tinymceTheme', 'light']]),
            expected: 'light'
          }
        ])('should return the existing value $expected when getting', ({ existingSettings, expected }) => {
          setLocalStorage(existingSettings);
          expect(config.staffWalkthroughImprovements.editWalkthrough.tinymceTheme).toEqual(expected);
        });
      });

      describe('set', () => {
        test.concurrent.each([
          {
            input: 'dark',
            expected: 'dark'
          },
          {
            input: 'light',
            expected: 'light'
          }
        ])('should return the new value $expected when getting after setting to be $input', ({ expected, input }) => {
          config.staffWalkthroughImprovements.editWalkthrough.tinymceTheme = input;
          expect(config.staffWalkthroughImprovements.editWalkthrough.tinymceTheme).toEqual(expected);
        });
      });
    });
  });
});
