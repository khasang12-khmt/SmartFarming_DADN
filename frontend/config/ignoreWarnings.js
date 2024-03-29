import { LogBox } from "react-native";

if (__DEV__) {
  const ignoreWarns = [
    "EventEmitter.removeListener",
    "[fuego-swr-keys-from-collection-path]",
    "Setting a timer for a long period of time",
    "ViewPropTypes will be removed from React Native",
    "AsyncStorage has been extracted from react-native",
    "exported from 'deprecated-react-native-prop-types'.",
    "Non-serializable values were found in the navigation state.",
    "VirtualizedLists should never be nested inside plain ScrollViews",
    "AxiosError: Request failed with status code 404",
    "Calling getExpoPushTokenAsync without specifying a projectId is deprecated and will no longer be supported in SDK 49+",
  ];

  const warn = console.warn;
  console.warn = (...arg) => {
    for (const warning of ignoreWarns) {
      if (arg[0].startsWith(warning)) {
        return;
      }
    }
    warn(...arg);
  };
  console.err = (...arg) => {
    for (const warning of ignoreWarns) {
      if (arg[0].startsWith(warning)) {
        return;
      }
    }
    err(...arg);
  };

  LogBox.ignoreLogs(ignoreWarns);
}
