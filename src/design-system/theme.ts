import { theme, type ThemeConfig } from 'antd';

// Food Passport brand blue with expressive supporting illustration colors.
export const palette = {
  blue: '#2563EB', blueLight: '#BFDBFE', feather: '#58CC02', mask: '#89E219', macaw: '#1CB0F6', cardinal: '#FF4B4B',
  bee: '#FFC800', fox: '#FF9600', beetle: '#CE82FF', humpback: '#2B70C9',
  eel: '#4B4B4B', wolf: '#777777', hare: '#AFAFAF', swan: '#E5E5E5', polar: '#F7F7F7', snow: '#FFFFFF',
} as const;

// Color-only overrides. All non-color tokens remain exact antd@6.0.0 values.
export const brandTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  components: {
    Tabs: { itemSelectedColor: '#1D4ED8', itemHoverColor: '#1E40AF', itemActiveColor: '#1E40AF' },
    Radio: { colorPrimary: '#1D4ED8', colorPrimaryHover: '#1E40AF' },
    Checkbox: { colorPrimary: '#1D4ED8', colorPrimaryHover: '#1E40AF' },
    Switch: { colorPrimary: '#1D4ED8', colorPrimaryHover: '#1E40AF' },
  },
  token: {
    colorPrimary: palette.blue, colorSuccess: palette.feather,
    colorInfo: palette.macaw, colorWarning: palette.bee, colorError: palette.cardinal,
    colorText: palette.eel, colorTextHeading: palette.eel, colorTextSecondary: '#686868',
    colorBgLayout: palette.polar, colorBgContainer: palette.snow, colorBgElevated: palette.snow,
    colorBorder: palette.hare, colorBorderSecondary: palette.swan,
    colorPrimaryHover: '#1D4ED8', colorPrimaryActive: '#1E40AF',
    colorTextLightSolid: '#FFFFFF', colorLink: '#1D4ED8', colorLinkHover: '#1E40AF',
    colorPrimaryText: '#1D4ED8', colorPrimaryTextHover: '#1E40AF', colorPrimaryTextActive: '#1E40AF',
    colorSuccessText: '#206B00', colorErrorText: '#B62525', colorWarningText: '#795A00', colorInfoText: '#176AA0',
  },
};
export const baseTokens = theme.getDesignToken();
export const resolvedTokens = theme.getDesignToken(brandTheme);
export const nonColorTokenNames = [
  'fontFamily','fontSize','fontSizeSM','fontSizeLG','fontSizeHeading1','fontSizeHeading2','fontSizeHeading3',
  'lineHeight','lineHeightHeading1','fontWeightStrong','sizeUnit','sizeStep',
  'paddingXS','paddingSM','padding','paddingLG','paddingXL','marginXS','marginSM','margin','marginLG','marginXL',
  'borderRadius','borderRadiusSM','borderRadiusLG','lineWidth','controlHeight','controlHeightSM','controlHeightLG',
  'boxShadow','boxShadowSecondary','motionDurationFast','motionDurationMid','motionDurationSlow','motionEaseInOut',
] as const;
