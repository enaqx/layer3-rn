if (typeof globalThis.__ExpoImportMetaRegistry === 'undefined') {
  globalThis.__ExpoImportMetaRegistry = {
    register: () => {},
    get: () => undefined,
  };
}

jest.mock('expo', () => ({
  ...jest.requireActual('expo'),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
  Stack: {
    Screen: 'Screen',
  },
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('expo-image', () => ({
  Image: 'Image',
}));

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
}));
