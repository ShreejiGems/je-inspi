import type { ThemeConfig } from 'antd';

export const brandColors = {
  sage: '#6B8965',
  primary: '#526F4D',
  hover: '#40583C',
  forest: '#263329',
  ivory: '#F8F7F1',
  soft: '#F1F4ED',
  selected: '#E3EBDD',
  border: '#CBD9C3',
  muted: '#73796F',
};

export const brandTheme: ThemeConfig = {
  token: {
    colorPrimary: brandColors.primary,
    colorPrimaryHover: brandColors.hover,
    colorPrimaryActive: '#31452E',
    colorPrimaryBg: brandColors.selected,
    colorPrimaryBgHover: brandColors.border,
    colorLink: brandColors.primary,
    colorLinkHover: brandColors.hover,
    colorInfo: brandColors.primary,
    colorSuccess: brandColors.primary,
    colorWarning: brandColors.sage,
    colorText: brandColors.forest,
    colorTextSecondary: brandColors.muted,
    colorBorder: brandColors.border,
    colorBgLayout: brandColors.ivory,
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#FFFFFF',
    controlOutline: 'rgba(107, 137, 101, 0.2)',
  },
  components: {
    Table: {
      headerBg: brandColors.ivory,
      headerColor: brandColors.forest,
      rowHoverBg: brandColors.soft,
      rowSelectedBg: brandColors.selected,
    },
    Menu: {
      itemSelectedBg: brandColors.selected,
      itemSelectedColor: brandColors.forest,
      itemHoverBg: brandColors.soft,
    },
  },
};
