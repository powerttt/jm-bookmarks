import { defineStore } from 'pinia';
import { store } from '../';
import designSetting from '../../settings/designSetting';
import { GlobalThemeOverrides } from 'naive-ui';
import { lighten } from '../../utils';

const { darkTheme, appTheme, appThemeList } = designSetting;

interface DesignSettingState {
  //深色主题
  darkTheme: boolean;
  //系统风格
  appTheme: string;
  //系统内置风格
  appThemeList: string[];

  // all 主题
  globalTheme: GlobalThemeOverrides;
}

export const useDesignSettingStore = defineStore({
  id: 'app-design-setting',
  state: (): DesignSettingState => ({
    darkTheme,
    appTheme,
    appThemeList,
    globalTheme: {
      common: {
        fontSize: '12px',
        fontSizeTiny: '11px',
        fontSizeSmall: '12px',
        fontSizeMedium: '12px',
        fontSizeLarge: '13px',
        fontSizeHuge: '14px',
        borderRadius: '6px',
        borderRadiusSmall: '4px',
        baseColor: lighten('#f5f5f5', 6),
        primaryColor: appTheme,
        primaryColorHover: lighten(appTheme, 6),
        primaryColorPressed: lighten(appTheme, 6),
      },
      LoadingBar: {
        colorLoading: appTheme,
      },
      Layout: {
        color: '#F5f5f5',
      },
      Card: {
        titleFontSizeSmall: '12px',
        titleFontSizeMedium: '13px',
        titleFontSizeLarge: '14px',
        titleFontSizeHuge: '15px',

        paddingSmall: '8px',
        paddingMedium: '10px',
        paddingLarge: '12px',
        paddingHuge: '14px',
      },
    },
  }),
  getters: {
    getDarkTheme(): boolean {
      return this.darkTheme;
    },
    getAppTheme(): string {
      return this.appTheme;
    },
    getAppThemeList(): string[] {
      return this.appThemeList;
    },
    getGlobalTheme(): GlobalThemeOverrides {
      return this.globalTheme;
    },
  },
  actions: {},
});

// Need to be used outside the setup
export function useDesignSettingWithOut() {
  return useDesignSettingStore(store);
}
