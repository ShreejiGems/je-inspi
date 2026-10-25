type FontOptions = { variable?: string; [key: string]: unknown };

const font = (className: string, family: string) => (_options: FontOptions = {}) => ({
  className,
  variable: className,
  style: { fontFamily: family },
});

export const EB_Garamond = font("font-display", "Georgia, 'Times New Roman', serif");
export const Roboto = font("font-ui", "Arial, Helvetica, sans-serif");
export const Poppins = font("font-ui", "Arial, Helvetica, sans-serif");
